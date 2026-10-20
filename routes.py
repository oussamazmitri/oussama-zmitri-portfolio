from flask import Flask, Blueprint, jsonify, send_from_directory, request
import json
import os
import copy

bp = Blueprint("apis", __name__)

# Cache store to prevent unnecessary disk reads on every request
_CACHE = {
    "profile": {},       # "en": {...}, "fr": {...}
    "translations": {}   # "en": {...}, "fr": {...}
}

SUPPORTED_LANGUAGES = {"en", "fr"}
DEFAULT_LANGUAGE = "en"

def normalize_language(lang_input):
    """Normalize input language string to supported code ('en' or 'fr'), defaulting to 'en'."""
    if not lang_input or not isinstance(lang_input, str):
        return DEFAULT_LANGUAGE
    
    clean = lang_input.strip().lower()
    if clean in ("en", "eng", "english"):
        return "en"
    if clean in ("fr", "fra", "french"):
        return "fr"
    return DEFAULT_LANGUAGE

def resolve_file_path(filename):
    """Locate translation file, checking backend/files/ first, then workspace root."""
    backend_path = os.path.join(os.path.dirname(__file__), "backend", "files", filename)
    if os.path.isfile(backend_path):
        return backend_path
    root_path = os.path.join(os.path.dirname(__file__), filename)
    if os.path.isfile(root_path):
        return root_path
    return backend_path

def load_json_file(filename):
    """Load JSON file from disk with UTF-8 encoding."""
    path = resolve_file_path(filename)
    if not os.path.isfile(path):
        raise FileNotFoundError(f"Authoritative translation file '{filename}' could not be located at '{path}'.")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def deep_merge(base, override):
    """Deep merge override into base, ensuring any missing keys fall back to base."""
    merged = copy.deepcopy(base)
    if not isinstance(override, dict):
        return override if override is not None else merged
    for key, val in override.items():
        if key in merged and isinstance(merged[key], dict) and isinstance(val, dict):
            merged[key] = deep_merge(merged[key], val)
        else:
            merged[key] = copy.deepcopy(val)
    return merged

def get_cached_profile(lang_code):
    """Retrieve profile data with in-memory caching."""
    if lang_code not in _CACHE["profile"]:
        filename = "profil_overview_eng.json" if lang_code == "en" else "profil_overview_eng_french.json"
        try:
            data = load_json_file(filename)
        except FileNotFoundError:
            # Fallback to profil_overview_french.json if eng_french is absent
            if lang_code == "fr":
                try:
                    data = load_json_file("profil_overview_french.json")
                except Exception:
                    # Final fallback to English
                    data = get_cached_profile("en")
            else:
                raise
        _CACHE["profile"][lang_code] = data
    return _CACHE["profile"][lang_code]

def get_cached_translations(lang_code):
    """Retrieve UI translations with in-memory caching and English fallback for missing keys."""
    if lang_code not in _CACHE["translations"]:
        # Ensure English translations are loaded as authoritative base
        en_profile = get_cached_profile("en")
        en_trans = en_profile.get("translations", {})

        if lang_code == "en":
            _CACHE["translations"]["en"] = en_trans
        else:
            fr_profile = get_cached_profile("fr")
            fr_trans = fr_profile.get("translations", {})
            # Deep merge fallback ensures 100% key coverage even if French has missing entries
            merged_trans = deep_merge(en_trans, fr_trans)
            _CACHE["translations"]["fr"] = merged_trans

    return _CACHE["translations"][lang_code]

# Pre-warm cache on startup
try:
    get_cached_translations("en")
    get_cached_translations("fr")
except Exception as e:
    print(f"Warning during initial translation load: {e}")

@bp.route("/translations", methods=["GET"])
@bp.route("/get_translations", methods=["GET"])
@bp.route("/translations/<string:lang>", methods=["GET"])
def get_translations_route(lang=None):
    """
    API endpoint returning centralized interface translations for the requested language.
    Query parameters: 'lang', 'language', or 'langauge'.
    Defaults to 'en' (English).
    """
    req_lang = lang or request.args.get("lang") or request.args.get("language") or request.args.get("langauge")
    resolved_lang = normalize_language(req_lang)

    try:
        translations = get_cached_translations(resolved_lang)
        response_data = {
            "status": "success",
            "lang": resolved_lang,
            "language": resolved_lang,
            "translations": translations
        }
        for k, v in translations.items():
            if k not in response_data:
                response_data[k] = v
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": "Failed to load authoritative translation files.",
            "details": str(e)
        }), 500

@bp.route("/get_overview", methods=["GET"])
@bp.route("/get_overall", methods=["GET"])
def get_overview():
    """
    Profile overview API endpoint supporting English and French.
    Preserves existing data structure and backward-compatible route contracts.
    """
    req_lang = request.args.get("lang") or request.args.get("language") or request.args.get("langauge")
    resolved_lang = normalize_language(req_lang)

    try:
        data = get_cached_profile(resolved_lang)
        return jsonify(data), 200
    except Exception as e:
        # Fallback to English if possible
        try:
            fallback = get_cached_profile("en")
            return jsonify(fallback), 200
        except Exception:
            return jsonify({
                "error": "An unexpected error occurred while loading profile data.",
                "details": str(e)
            }), 500

@bp.route("/get_cv", methods=["GET"])
def get_cv():
    """Download curriculum vitae in English or French."""
    lang_param = request.args.get("lang") or request.args.get("language") or request.args.get("langauge")
    as_attachment = request.args.get("download", "").lower() in ("true", "1", "yes")

    if not lang_param:
        return jsonify({"error": "please select a language"}), 400

    clean_lang = lang_param.strip().lower()
    files_dir = os.path.join(os.path.dirname(__file__), "static", "files")

    try:
        if clean_lang in ("french", "fr", "fra"):
            return send_from_directory(
                files_dir,
                "cv_french.pdf",
                mimetype="application/pdf",
                as_attachment=as_attachment,
                download_name="Oussama_Zmitri_CV_FR.pdf" if as_attachment else None
            )
        elif clean_lang in ("english", "en", "eng"):
            return send_from_directory(
                files_dir,
                "cv_english.pdf",
                mimetype="application/pdf",
                as_attachment=as_attachment,
                download_name="Oussama_Zmitri_CV_EN.pdf" if as_attachment else None
            )
        else:
            return jsonify({"error": "please select a language"}), 400
    except Exception:
        return jsonify({"error": "An unexpected error occurred while serving the requested CV."}), 500



