from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend import PlantDiseaseClassifier
import shutil
import os
import time

app = FastAPI(title="BioScan API", description="Plant Disease Diagnostics API", version="1.0")

# Add CORS middleware to allow web GUI to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Initialize Backend
classifier = PlantDiseaseClassifier()

@app.get("/")
def home():
    return {"message": "BioScan API is running. Use POST /predict to analyze images."}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Upload an image file to get a disease prediction.
    """
    if not classifier.model:
        raise HTTPException(status_code=503, detail="Model is not loaded on server.")

    # Save temp file
    temp_filename = f"temp_{int(time.time())}_{file.filename}"
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Predict
        print(f"Processing prediction request for: {file.filename}")
        result = classifier.predict(temp_filename)
        
        # Cleanup
        os.remove(temp_filename)
        
        if 'error' in result:
            raise HTTPException(status_code=500, detail=result['error'])
            
        return result

    except Exception as e:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
