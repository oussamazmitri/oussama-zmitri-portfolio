from flask import Flask, Blueprint, jsonify, send_from_directory, request
import json
import os
bp = Blueprint("apis", __name__)

with open("profil_overview.json","r", encoding = "utf-8") as f:
    content = json.load(f)

@bp.route("/get_overview", methods = ["get"])
def get_overview():
    try : 
        return content, 200
    except :
        return jsonify ({"error": "An unexpected error occurred. The developer denies all responsibility."}), 400

@bp.route("/get_cv", methods = ["GET"])
def get_cv():
    langauge = request.args.get("langauge")
    try : 
        if langauge == "french" :
            return send_from_directory(
                os.path.join(os.path.dirname(__file__), "static", "files"),
                "cv_french.pdf",
                mimetype = "application/pdf",
                as_attachment=False
        )

        elif langauge == "english":
            return send_from_directory(
                            os.path.join(os.path.dirname(__file__), "static", "files"),
                            "cv_english.pdf",
                            mimetype = "application/pdf",
                            as_attachment=False
                    )
        else :
            return jsonify ({"error":"please select a language"}), 400
    except :
        return jsonify ({"error": "An unexpected error occurred. The developer denies all responsibility."}), 400

