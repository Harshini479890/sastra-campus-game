from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pandas as pd
import joblib

app = Flask(__name__)
CORS(app)  # <--- Apply CORS to the app

# Load saved model and label encoder
try:
    model = joblib.load("club_recommender.pkl")
    label_encoder = joblib.load("club_encoder.pkl")
    print("Model and encoder loaded successfully.")
except FileNotFoundError:
    print("ERROR: Model or encoder files not found. Ensure 'club_recommender.pkl' and 'club_encoder.pkl' are present.")
    model = None
    label_encoder = None
except Exception as e:
    print(f"ERROR: Failed to load model/encoder: {e}")
    model = None
    label_encoder = None

@app.route('/predict', methods=['POST'])
def predict():
    # ... (rest of your predict function remains the same)
    if model is None or label_encoder is None:
        return jsonify({"error": "Service unavailable: Model files could not be loaded."}), 503

    print("Request received for prediction....")
    data = request.get_json()
    #print(data)
    encoded_choices = data.get('choices')

    if not isinstance(encoded_choices, list) or len(encoded_choices) != 5:
        print(f"Invalid input: {encoded_choices}")
        return jsonify({"error": "Invalid input. Expected an array of 5 encoded choice integers."}), 400

    try:
        df = pd.DataFrame([encoded_choices], columns=['Q1','Q2','Q3','Q4','Q5'])
        pred = model.predict(df)
        recommended_club = label_encoder.inverse_transform(pred)[0]
        
        print(f"Recommended club: {recommended_club}")
        return jsonify({"recommended_club": recommended_club})

    except Exception as e:
        print(f"Prediction failed: {e}")
        return jsonify({"error": f"Prediction failed due to model error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)