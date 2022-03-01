from flask import Flask, jsonify, request
from flask_cors import CORS # comment this on deployment
from flask_restful import Resource, Api
import os
from werkzeug.utils import secure_filename
from models import getModelPrediction

app = Flask(__name__)
CORS(app) # comment this on deployment
api = Api(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'static')

class Upload(Resource):
    def post(self):
        # deletes any images in static folder, saves new image to static folder
        for f in os.listdir(UPLOAD_FOLDER):
            os.remove(os.path.join(UPLOAD_FOLDER, f))

        file = request.files['file']
        filename = secure_filename(file.filename)
        destination = os.path.join(UPLOAD_FOLDER, filename)
        file.save(destination)
        return '', 200

class Predict(Resource):
    def get(self):
        if len(os.listdir(UPLOAD_FOLDER)) == 1:
            image_file = os.listdir(UPLOAD_FOLDER)[0]
            img_path = os.path.join(UPLOAD_FOLDER, image_file)
            predictionInfo = getModelPrediction(img_path)
            return jsonify(predictionInfo)


api.add_resource(Upload, '/flask/upload')
api.add_resource(Predict, '/flask/predict')


if __name__ == '__main__':
    app.run(debug=True)