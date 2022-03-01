# Handles loading the model and using the uploaded image as input for the model
# returns the prediction and confidence (percentage) back to HelloApiHandler.py to post to React frontend
from keras.preprocessing.image import load_img, img_to_array
from keras.models import load_model
import numpy as np

IMAGE_SIZE = (150, 150)

def getModelPrediction(image):
    model = load_model('braintumor_model.h5')
    img = load_img(image, target_size=IMAGE_SIZE)
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, 0)

    prediction = model.predict(img_array)[0][0]
    if prediction >= 0.5:
        return {'probability': round(prediction * 100, 2), 'label': 'Yes'}
    else:
        return {'probability': round((1 - prediction) * 100, 2), 'label': 'No'}