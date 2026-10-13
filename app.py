from flask import Flask
from routes import bp

app = Flask(__name__)

app.register_blueprint(bp, url_prefix = "/apis")

if __name__ == "__main__":
    app.run(debug = True)
