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


# Duplicacion de codigo
def search_protein_by(id):
    search_protein = Protein.query.get(id)
    if not search_protein:
        raise APIException(
            f"protein with id {id} not in database.", status_code=404)
    return search_protein


def search_sauce_by(id):
    search_sauce = Sauce.query.get(id)
    if not search_sauce:
        raise APIException(
            f"sauce with id {id} not in database.", status_code=404)
    return search_sauce


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


def update_instance_values(instance, values_dict, keys):
    for key in keys:
        if key in values_dict:
            setattr(instance, key, values_dict[key])

@api.route('/proteins/<int:id>', methods=['PUT'])
def update_protein(id):
    search_protein = search_protein_by(id)

    body = request.get_json()
    update_instance_values(search_protein, body, ["name", "price"])
    db.session.commit()

    return jsonify(search_protein.serialize()), 200


@api.route('/proteins/<int:id>', methods=['DELETE'])
def delete_protein(id):
    search_protein = search_protein_by(id)
    db.session.delete(search_protein)
    db.session.commit()
    return jsonify({"done": True}), 200


@api.route('/taco', methods=['POST'])
def create_taco():

    body = request.get_json()

    tortilla, proteina, sauces = reqValues(
        body, ['tortilla', 'protein', 'sauces']
    )

    protein = search_protein_by(proteina)

    sauces = [search_sauce_by(sauce_id) for sauce_id in sauces]

    try:
        new_taco = Taco(tortilla=tortilla, protein=protein, sauces=sauces)
        new_taco.save()

    except ValueError as err:
        return jsonify({"msg": "Error while adding a new Taco. " + str(err)}), 500

    return jsonify(new_taco.serialize()), 201


@api.route('/taco', methods=['GET'])
def get_tacos():
    tacos = Taco.query.all()
    return jsonify([taco.serialize() for taco in tacos]), 200
