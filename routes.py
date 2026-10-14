from flask import Flask, Blueprint, jsonify, send_from_directory, request
import json
import os
bp = Blueprint("apis", __name__)

def load_profile_data():
    json_path = os.path.join(os.path.dirname(__file__), "profil_overview.json")
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)

# Initial load
content = load_profile_data()

@bp.route("/get_overview", methods=["GET"])
@bp.route("/get_overall", methods=["GET"])
def get_overview():
    try:
        # Dynamically reload if file changed, fallback to cached content
        data = load_profile_data()
        return jsonify(data), 200
    except Exception:
        if content:
            return jsonify(content), 200
        return jsonify({"error": "An unexpected error occurred. The developer denies all responsibility."}), 400

@bp.route("/get_cv", methods=["GET"])
def get_cv():
    lang = request.args.get("langauge") or request.args.get("language")
    as_attachment = request.args.get("download", "").lower() in ("true", "1", "yes")
    try:
        files_dir = os.path.join(os.path.dirname(__file__), "static", "files")
        if lang == "french":
            return send_from_directory(
                files_dir,
                "cv_french.pdf",
                mimetype="application/pdf",
                as_attachment=as_attachment,
                download_name="Oussama_Zmitri_CV_FR.pdf" if as_attachment else None
            )
        elif lang == "english":
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
        return jsonify({"error": "An unexpected error occurred. The developer denies all responsibility."}), 400


