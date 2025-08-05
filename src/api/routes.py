"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint

from api.models import db, User, Protein, Sauce, Taco

from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/sauces', methods=['GET'])
def get_sauces():

    lista_de_salsas = Sauce.query.all()

    return jsonify([
        salsa.serialize() for salsa in lista_de_salsas
    ]), 200


@api.route('/proteins', methods=['GET'])
def get_proteins():

    proteins = Protein.query.all()

    return jsonify([
        protein.serialize() for protein in proteins
    ]), 200


def search_protein_by(id):
    search_protein = Protein.query.get(id)
    if not search_protein:
        raise APIException(
            f"protein with id {id} not in database.", status_code=404)
    return search_protein


@api.route('/proteins/<int:id>', methods=['GET'])
def get_single_protein(id):
    search_protein = search_protein_by(id)
    return jsonify(search_protein.serialize()), 200


def reqValues(body, keys):
    for key in keys:
        if key not in body:
            raise APIException(f"Missing key {key} in body.", status_code=400)

    return tuple(body.get(key) for key in keys)


@api.route('/proteins', methods=['POST'])
def create_protein():

    body = request.get_json()
    name, price = reqValues(body, ['name', 'price'])

    try:
        new_protein = Protein(name=name, price=price)
        new_protein.save()
    except:
        return jsonify({"msg": "Somethign weird happened."}), 500

    return jsonify(new_protein.serialize()), 201


@api.route('/proteins/<int:id>', methods=['PUT'])
def update_protein(id):
    search_protein = search_protein_by(id)

    body = request.get_json()

    new_name = body.get("name")
    new_price = body.get("price")

    if new_name:
        search_protein.name = new_name
    if new_price:
        search_protein.price = new_price

    db.session.commit()  # Actualizar la BD

    return jsonify(search_protein.serialize()), 200


@api.route('/proteins/<int:id>', methods=['DELETE'])
def delete_protein(id):
    search_protein = search_protein_by(id)
    db.session.delete(search_protein)
    db.session.commit()
    return jsonify({"done": True}), 200
