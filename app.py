import os
from flask import Flask, render_template, send_from_directory
from routes import bp

app = Flask(
    __name__,
    template_folder=os.path.join(os.path.dirname(__file__), "templates"),
    static_folder=os.path.join(os.path.dirname(__file__), "static")
)

app.register_blueprint(bp, url_prefix="/apis")

@app.route("/")
@app.route("/side-quests")
@app.route("/writing")
def serve_index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)

