from flask import Flask, Blueprint, jsonify
import json

bp = Blueprint("apis", __name__)

with open("profil_overview.json","r", encoding = "utf-8") as f:
    content = json.load(f)

@bp.route("/get_overview", methods = ["get"])
def get_overview():
    try : 
        return content, 200
    except :
        return jsonify ({"error": "An unexpected error occurred. The developer denies all responsibility."}), 400