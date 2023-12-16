from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import Earthquake, User
import os, jwt
from functools import wraps
import sys

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db = SQLAlchemy(app)

#### JWT AUTH MIDDLEWARE ####
def jwt_token_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return {
                "message": "Authentication Token is missing!",
                "data": None,
                "error": "Unauthorized"
            }, 401
        try:
            data=jwt.decode(token, os.environ.get('SECRET'), algorithms=["HS256"])
            current_user= User.get_by_id(db.session, data["user_id"])
            if current_user is None:
                return {
                    "message": "Invalid Authentication token!",
                    "data": None,
                    "error": "Unauthorized"
                }, 401      
        except Exception as e:
            return {
                "message": "Something went wrong",
                "data": None,
                "error": str(e)
            }, 500

        return f(current_user, *args, **kwargs)

    return decorated


#### ROUTES ####
@app.route('/earthquakes/<id>', methods=['GET'])
@jwt_token_auth
def get_earthquake_by_id(auth_user, id):
    earthquake = Earthquake.get_by_id(db.session, id)

    result = {
            'id': earthquake.id,
            'date': str(earthquake.date),
            'time': str(earthquake.time),
            'latitude': float(earthquake.latitude),
            'longitude': float(earthquake.longitude),
            'type': str(earthquake.type),
            'depth': float(earthquake.depth),
            'depth_error': float(earthquake.depth_error) if earthquake.depth_error is not None else float(0),
            'depth_seismic_stations': float(earthquake.depth_seismic_stations) if earthquake.depth_seismic_stations is not None else float(0),
            'magnitude': float(earthquake.magnitude),
            'magnitude_type': str(earthquake.magnitude_type),
            'magnitude_seismic_stations': float(earthquake.magnitude_seismic_stations) if earthquake.magnitude_seismic_stations is not None else float(0),
            'magnitude_error': float(earthquake.magnitude_error) if earthquake.magnitude_error is not None else float(0),
            'azimuthal_gap' : float(earthquake.azimuthal_gap) if earthquake.azimuthal_gap is not None else float(0),
            'horizontal_distance': float(earthquake.horizontal_distance) if earthquake.horizontal_distance is not None else float(0),
            'horizontal_error': float(earthquake.horizontal_error) if earthquake.horizontal_error is not None else float(0),
            'root_mean_square': float(earthquake.root_mean_square) if earthquake.root_mean_square is not None else float(0),
            'source': str(earthquake.source),
            'location_source': str(earthquake.location_source),
            'magnitude_source': str(earthquake.magnitude_source),
            'status': str(earthquake.status)
        }

    return jsonify(result)

# Get earthquake data
@app.route('/earthquakes', methods=['GET'])
@jwt_token_auth
def get_all_earthquakes(auth_user):
    earthquakes = Earthquake.get_all(db.session, request.args.get('page'))

    result = []
    for earthquake in earthquakes:
        result.append({
            'id': earthquake.id,
            'date': str(earthquake.date),
            'time': str(earthquake.time),
            'latitude': float(earthquake.latitude),
            'longitude': float(earthquake.longitude),
            'type': str(earthquake.type),
            'depth': float(earthquake.depth),
            'depth_error': float(earthquake.depth_error) if earthquake.depth_error is not None else float(0),
            'depth_seismic_stations': float(earthquake.depth_seismic_stations) if earthquake.depth_seismic_stations is not None else float(0),
            'magnitude': float(earthquake.magnitude),
            'magnitude_type': str(earthquake.magnitude_type),
            'magnitude_seismic_stations': float(earthquake.magnitude_seismic_stations) if earthquake.magnitude_seismic_stations is not None else float(0),
            'magnitude_error': float(earthquake.magnitude_error) if earthquake.magnitude_error is not None else float(0),
            'azimuthal_gap' : float(earthquake.azimuthal_gap) if earthquake.azimuthal_gap is not None else float(0),
            'horizontal_distance': float(earthquake.horizontal_distance) if earthquake.horizontal_distance is not None else float(0),
            'horizontal_error': float(earthquake.horizontal_error) if earthquake.horizontal_error is not None else float(0),
            'root_mean_square': float(earthquake.root_mean_square) if earthquake.root_mean_square is not None else float(0),
            'source': str(earthquake.source),
            'location_source': str(earthquake.location_source),
            'magnitude_source': str(earthquake.magnitude_source),
            'status': str(earthquake.status)
        })

    return jsonify(result)

# Add Earthquake Data
@app.route('/earthquakes', methods=['POST'])
@jwt_token_auth
def add_earthquake(auth_user):
    data = request.get_json()
    earthquake = Earthquake.add_earthquake(db.session, data)

    result = {
            'id': earthquake.id
        }

    return jsonify(result)

# Edit Earthquake Data
@app.route('/earthquakes', methods=['PUT'])
@jwt_token_auth
def edit_earthquake(auth_user):
    data = request.get_json()
    earthquake = Earthquake.edit_earthquake(db.session, data)
    result = {
            'id': earthquake.id,  
        }

    return jsonify(result)

@app.route('/earthquakes/<id>', methods=['DELETE'])
@jwt_token_auth
def delete_earthquake_by_id(auth_user, id):
    earthquake = Earthquake.delete_earthquake_by_id(db.session, id)

    result = {
            'id': earthquake.id,  
        }

    return jsonify(result)

# Earthquake count data rows
@app.route('/earthquakes/count', methods=['GET'])
@jwt_token_auth
def get_total_rows(auth_user):
    count = Earthquake.get_total_rows(db.session)
    return jsonify({'total': count})

# Get Data used for dashboard
@app.route('/dashboard', methods=['GET'])
@jwt_token_auth
def get_dashboard_data(auth_user):
    depthMax, magMax, depthAvg, count = Earthquake.get_dashboard_data(db.session)
    return jsonify({'total': count, 'depthMax': depthMax, 'depthAvg': depthAvg, 'magMax': magMax})

# User registration
@app.route('/users/register', methods=['POST'])
def register_user():
    try:
        data = request.get_json()
        new_user = User.register(db.session, data['username'], data['password'])
        
        return make_response(jsonify({'message': 'created user ' + new_user.username}), 201)
    except Exception as e:
        return make_response(jsonify({'message': 'error creating user: ' + str(e)}), 500)

# User Login   
@app.route('/login', methods=['POST'])
def user_login():
    try:
        data = request.get_json()
        user, token = User.login(db.session, data['username'], data['password'])
        result = {
            'id': user.id,
            'username': user.username,
            'token': token 
        }
        if (user):
            return make_response(jsonify(result), 201)
        else:
            return make_response(jsonify({'message': 'incorrect login information'}), 201)

    except Exception as e:
        return make_response(jsonify({'message': 'error logging in: ' + str(e)}), 500)

if __name__ == '__main__':
    app.run(debug=True)