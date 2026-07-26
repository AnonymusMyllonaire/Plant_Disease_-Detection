import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import os

# --- Medical Database ---
DISEASE_INFO = {
    'angular_leaf_spot': {
        'name': 'Angular Leaf Spot',
        'symptoms': "• Small, angular water-soaked spots.\n• Lesions with yellow halos.\n• Premature defoliation.",
        'cure': "• Remove infected debris.\n• Use copper fungicides.\n• Crop rotation (2-3 yrs).\n• Disease-free seeds."
    },
    'bean_rust': {
        'name': 'Bean Rust',
        'symptoms': "• Small, reddish-brown pustules.\n• Leaves turn yellow/dry.\n• Reduced yield.",
        'cure': "• Apply sulfur/fungicides.\n• Remove infected plants.\n• Ensure air circulation.\n• Water at base."
    },
    'healthy': {
        'name': 'Healthy',
        'symptoms': "• Vibrant green leaves.\n• No spots or wilting.",
        'cure': "• Regular watering/weeding.\n• Monitor for pests."
    }
}

class PlantDiseaseClassifier:
    def __init__(self, model_path='plant_model.h5'):
        self.model_path = model_path
        self.model = None
        self.class_names = ['angular_leaf_spot', 'bean_rust', 'healthy']
        self.load_model()

    def load_model(self):
        """Loads the model if it exists, with fallback for different formats."""
        if os.path.exists(self.model_path):
            try:
                # Try loading with compile=False to avoid metric issues
                self.model = load_model(self.model_path, compile=False)
                
                # Recompile the model
                self.model.compile(
                    optimizer='adam',
                    loss='categorical_crossentropy',
                    metrics=['accuracy']
                )
                print(f"[OK] Model loaded successfully from {self.model_path}")
            except Exception as e:
                print(f"[ERROR] Error loading model: {e}")
                print(f"  Trying alternative loading method...")
                try:
                    # Try with safe_mode for Keras 3
                    import tensorflow as tf
                    self.model = tf.keras.models.load_model(self.model_path, safe_mode=False)
                    print(f"[OK] Model loaded with safe_mode=False")
                except Exception as e2:
                    print(f"[ERROR] Alternative loading also failed: {e2}")
                    print(f"[INFO] The model file appears to be corrupted. Please retrain using: python classifier.py")
                self.model = None
        else:
            print(f"Model file not found: {self.model_path}")
            self.model = None

    def predict(self, img_path):
        """
        Predicts disease from an image path.
        Returns a dictionary with result details or None if error/no model.
        """
        if not self.model:
            return {'error': 'Model not loaded'}

        try:
            # Preprocess
            img = image.load_img(img_path, target_size=(128, 128))
            x = image.img_to_array(img) / 255.0
            x = np.expand_dims(x, axis=0)
            
            # Predict
            preds = self.model.predict(x, verbose=0)[0]
            idx = np.argmax(preds)
            confidence = float(preds[idx])
            class_key = self.class_names[idx]
            
            # Get Details
            info = DISEASE_INFO.get(class_key, {})
            
            return {
                'class_key': class_key,
                'class_name': info.get('name', class_key),
                'confidence': confidence,
                'probabilities': {name: float(prob) for name, prob in zip(self.class_names, preds)},
                'symptoms': info.get('symptoms', ''),
                'cure': info.get('cure', '')
            }
        except Exception as e:
            return {'error': str(e)}

if __name__ == "__main__":
    # Test run
    classifier = PlantDiseaseClassifier()
    if classifier.model:
        print("Backend initialized successfully.")
