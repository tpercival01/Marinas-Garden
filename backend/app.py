from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)

CORS(app)

basedir = os.path.abspath(os.path.dirname(__file__))

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'garden.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Plant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plot_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    plant_type = db.Column(db.String(100), nullable=False)
    last_watered = db.Column(db.String(50), nullable=True)
    plant_start = db.Column(db.String(50), nullable=True)
    plant_room = db.Column(db.String(100), nullable=True)
    plant_stage = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'plot_id': self.plot_id,
            'name': self.name,
            'plant_type': self.plant_type,
            'last_watered': self.last_watered,
            'plant_start': self.plant_start,
            'plant_room': self.plant_room,
            'plant_stage': self.plant_stage,
        }
    
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/plants', methods=['GET'])
def get_plants():
    plants = Plant.query.all()
    return jsonify([plant.to_dict() for plant in plants])

@app.route('/api/plants', methods=['POST'])
def add_plant():
    data = request.get_json()
    new_plant = Plant(name=data['name'], species=data['species'])
    db.session.add(new_plant)
    db.session.commit()

    return jsonify(new_plant.to_dict()), 201 

@app.route('/api/plants/<int:id>', methods=['PUT'])
def update_plant(id):
    plant = Plant.query.get_or_404(id)
    data = request.get_json()
    plant.name = data.get('name', plant.name)
    plant.species = data.get('species', plant.species)
    db.session.commit()

    return jsonify(plant.to_dict())

@app.route('/api/plants/<int:id>', methods=['DELETE'])
def delete_plant(id):
    plant = Plant.query.get_or_404(id)
    db.session.delete(plant)
    db.session.commit()

    return jsonify({'message': 'Plant deleted successfully'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    app.run(debug=True)