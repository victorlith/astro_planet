from flask import Blueprint, render_template, request, jsonify
from app.models.exoplanet_model import ExoplanetModel

exoplanet_bp = Blueprint('exoplanet', __name__)

@exoplanet_bp.route('/')
def index():
    return render_template('index.html')

@exoplanet_bp.route(f'/exoplanet/<nome>', methods=['GET'])
def buscar_exoplaneta(nome):
    exoplanet = ExoplanetModel()
    response = exoplanet.buscar_exoplaneta(nome)

    if response:
        return jsonify(response)
    else:
        return jsonify(None), 400
    
@exoplanet_bp.route(f'/search/<nome>', methods=['GET'])
def pesquisar_exoplaneta(nome):
    if nome:
        exoplanet = ExoplanetModel()
        response = exoplanet.pesquisar_por_exoplaneta(nome)

        if response:
            return jsonify(response)
        else:
            return jsonify({'resultado': None, 'msg': f'O exoplaneta com o nome ({nome}) não foi encontrado.'})
    else:
        return jsonify({'resultado': 'Nome do exoplaneta não fornecido'})

@exoplanet_bp.route(f'/filtrarExoplaneta', methods=['GET'])
def filtrar_exoplaneta():
    offset = request.args.get('offset', default=0, type=int)
    filtro = request.args.get('filter', default=None, type=str)

    exoplanet = ExoplanetModel()
    response = exoplanet.filtrar_exoplanetas(offset, filtro)

    if response:
        return jsonify(response)
    else:
        return jsonify(None), 400