import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import matplotlib.pyplot as plt
import argparse
import os
import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk
import time
import cv2  # New import for camera functionality

# --- 1. CONFIGURATION & DATA ---

# Dictionary storing Symptoms and Cures for each class
DISEASE_INFO = {
    'angular_leaf_spot': {
        'symptoms': "• Small, angular water-soaked spots on leaves.\n• Lesions may have yellow halos.\n• Premature defoliation.",
        'cure': "• Remove infected crop debris.\n• Use copper-based fungicides.\n• Practice crop rotation (2-3 years).\n• Use disease-free seeds."
    },
    'bean_rust': {
        'symptoms': "• Small, reddish-brown pustules on leaves.\n• Leaves may turn yellow and dry up.\n• Reduced yield.",
        'cure': "• Apply sulfur or appropriate fungicides early.\n• Remove infected plants immediately.\n• Ensure good air circulation between plants.\n• Water at the base, not the foliage."
    },
    'healthy': {
        'symptoms': "• Plant appears vibrant and green.\n• No visible spots, lesions, or wilting.",
        'cure': "• Continue regular care (watering, weeding).\n• Monitor regularly for early signs of pests."
    }
}

# --- 2. INPUT FUNCTIONS ---

def select_input_method():
    """Dialog to choose between File Upload or Camera"""
    root = tk.Tk()
    root.title("Select Input Method")
    root.geometry("300x150")
    
    # Variable to store choice
    choice = tk.StringVar(value="none")
    
    def set_file():
        choice.set("file")
        root.destroy()
        
    def set_camera():
        choice.set("camera")
        root.destroy()

    tk.Label(root, text="How would you like to analyze?", font=("Arial", 12)).pack(pady=20)
    
    btn_frame = tk.Frame(root)
    btn_frame.pack(pady=10)
    
    tk.Button(btn_frame, text="📁 Upload File", command=set_file, width=12).pack(side=tk.LEFT, padx=10)
    tk.Button(btn_frame, text="📷 Use Camera", command=set_camera, width=12).pack(side=tk.LEFT, padx=10)
    
    # Center window
    root.eval('tk::PlaceWindow . center')
    root.mainloop()
    
    return choice.get()

def select_image_file():
    """Open a file dialog to select an image file"""
    root = tk.Tk()
    root.withdraw()  # Hide the main window
    
    file_types = [
        ("Image files", "*.jpg *.jpeg *.png *.bmp *.tiff *.tif"),
        ("All files", "*.*")
    ]
    
    file_path = filedialog.askopenfilename(
        title="Select an image file to analyze",
        filetypes=file_types
    )
    
    root.destroy()
    return file_path

def capture_image_from_camera():
    """Capture an image using the webcam"""
    print("📷 Opening camera... (Press SPACE to capture, Q to quit)")
    
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("❌ Could not open webcam.")
        return None

    img_name = None
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Failed to grab frame.")
            break
            
        # Display the resulting frame
        cv2.imshow('Camera - Press SPACE to Capture', frame)
        
        # Wait for key press
        k = cv2.waitKey(1)
        
        if k % 256 == 32:  # SPACE pressed
            # Create captures directory if not exists
            os.makedirs("captures", exist_ok=True)
            timestamp = int(time.time())
            img_name = f"captures/capture_{timestamp}.jpg"
            cv2.imwrite(img_name, frame)
            print(f"✅ Image saved: {img_name}")
            break
        elif k & 0xFF == ord('q'): # Q pressed
            break

    cap.release()
    cv2.destroyAllWindows()
    return img_name

def ask_continue():
    """Ask user if they want to continue"""
    root = tk.Tk()
    root.withdraw()
    response = messagebox.askyesno("Continue?", "Do you want to analyze another image?", icon='question')
    root.destroy()
    return response

# --- 3. CORE PROCESSING ---

def load_and_preprocess_image(img_path, target_size=(128, 128)):
    """Load and preprocess a single image for prediction"""
    if not os.path.exists(img_path):
        raise FileNotFoundError(f"Image file not found: {img_path}")
    
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0  # Normalize
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def predict_image(model, img_path):
    """Predict class and show results including symptoms/cure"""
    class_names = ['angular_leaf_spot', 'bean_rust', 'healthy']

    try:
        processed_image = load_and_preprocess_image(img_path)
    except Exception as e:
        print(f"✗ Error loading image: {e}")
        return None, None

    print("🔍 Analyzing image...")
    start_time = time.time()
    predictions = model.predict(processed_image, verbose=0)
    prediction_time = time.time() - start_time
    
    predicted_class_idx = np.argmax(predictions[0])
    confidence = np.max(predictions[0])
    predicted_class_name = class_names[predicted_class_idx]

    # Retrieve info from dictionary
    info = DISEASE_INFO.get(predicted_class_name, {})
    symptoms = info.get('symptoms', 'N/A')
    cure = info.get('cure', 'N/A')

    # Console Output
    print(f"\n{'='*60}")
    print(f"📊 PREDICTION RESULTS")
    print(f"{'='*60}")
    print(f"📁 Source: {os.path.basename(img_path)}")
    print(f"🎯 Diagnosis: {predicted_class_name.replace('_', ' ').upper()}")
    print(f"✅ Confidence: {confidence:.2%}")
    print(f"⏱️  Time: {prediction_time:.2f}s")
    print(f"\n⚠️ SYMPTOMS:\n{symptoms}")
    print(f"\n💊 CURE/ADVICE:\n{cure}")
    print(f"{'='*60}")

    # Visual Output
    display_prediction_with_info(img_path, predicted_class_name, confidence, predictions[0], symptoms, cure)
    
    return predicted_class_name, confidence

def display_prediction_with_info(img_path, prediction, confidence, probabilities, symptoms, cure):
    """Display image with prediction stats AND medical info"""
    try:
        # Create a larger figure to accommodate text
        fig = plt.figure(figsize=(14, 9))
        
        # Grid layout: 
        # Row 1: Image | Probabilities
        # Row 2: Text Info Box
        gs = plt.GridSpec(2, 2, height_ratios=[1.5, 1])

        # 1. Original Image
        ax_img = fig.add_subplot(gs[0, 0])
        img = image.load_img(img_path)
        ax_img.imshow(img)
        ax_img.set_title(f'Diagnosis: {prediction.replace("_", " ").title()}', fontsize=14, fontweight='bold', color='darkblue')
        ax_img.axis('off')

        # 2. Probability Chart
        ax_bar = fig.add_subplot(gs[0, 1])
        classes = ['Angular Spot', 'Bean Rust', 'Healthy']
        colors = ['#ff6b6b', '#feca57', '#1dd1a1'] # Red, Orange, Green
        bars = ax_bar.bar(classes, probabilities, color=colors, alpha=0.8)
        ax_bar.set_ylim(0, 1)
        ax_bar.set_title('Confidence Levels', fontsize=12, fontweight='bold')
        
        # Add labels to bars
        for bar, prob in zip(bars, probabilities):
            height = bar.get_height()
            ax_bar.text(bar.get_x() + bar.get_width()/2., height + 0.01,
                        f'{prob:.1%}', ha='center', va='bottom', fontweight='bold')

        # 3. Information Box (Symptoms & Cure)
        ax_info = fig.add_subplot(gs[1, :])
        ax_info.axis('off')
        
        # Create detailed text
        info_text = (
            f"DIAGNOSIS REPORT\n"
            f"--------------------------------------------------\n"
            f"Disease:  {prediction.replace('_', ' ').upper()}\n"
            f"Severity: {confidence:.1%} Confidence\n\n"
            f"SYMPTOMS:\n{symptoms}\n\n"
            f"RECOMMENDED TREATMENT:\n{cure}"
        )
        
        # Add text box
        props = dict(boxstyle='round', facecolor='#f0f0f0', alpha=0.9, edgecolor='gray')
        ax_info.text(0.05, 0.95, info_text, transform=ax_info.transAxes, fontsize=11,
                    verticalalignment='top', bbox=props, fontfamily='monospace')

        plt.tight_layout()
        plt.show()
        
    except Exception as e:
        print(f"Could not display plot: {e}")

# --- 4. MAIN PROGRAM ---

def main():
    print("🌱 Bean Leaf Disease System (v2.0)")
    print("=" * 50)
    
    # Check model
    model_path = 'plant_model.h5'
    if not os.path.exists(model_path):
        print("❌ Model not found! Please train the model first.")
        return
    
    try:
        model = load_model(model_path)
        print(f"✓ Model loaded from {model_path}")
    except Exception as e:
        print(f"✗ Error loading model: {e}")
        return
    
    while True:
        # Ask for input method
        method = select_input_method()
        
        img_path = None
        if method == "file":
            img_path = select_image_file()
        elif method == "camera":
            img_path = capture_image_from_camera()
        else:
            print("Exiting...")
            break
            
        if not img_path:
            print("No image selected/captured.")
            if not ask_continue(): break
            continue
            
        # Predict
        try:
            predict_image(model, img_path)
        except Exception as e:
            print(f"❌ Prediction error: {e}")
        
        # Clean up camera capture if it's a temp file
        # Optional: uncomment if you want to delete camera captures after viewing
        # if method == "camera" and os.path.exists(img_path):
        #     os.remove(img_path)
            
        if not ask_continue():
            print("\n👋 Exiting system. Stay green!")
            break

if __name__ == "__main__":
    main()