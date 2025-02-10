from flask import Flask
from .controllers.exoplanet_controller import exoplanet_bp
from waitress import serve
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.register_blueprint(exoplanet_bp)


def app_start():
    print('Aplicação iniciada...')
    serve(app, host="0.0.0.0", port=80)
    #app.run(debug=True)