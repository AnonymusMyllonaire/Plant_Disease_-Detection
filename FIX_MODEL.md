# Fix for Corrupted Model File

The model file `plant_model.h5` appears to be corrupted (file signature not found error).

## Solution: Retrain the Model

Run the classifier script to regenerate a fresh model file:

```bash
python classifier.py
```

This will:
1. Load the training data from `beans/train`
2. Train a new CNN model
3. Save a fresh `plant_model.h5` file

## Alternative: Quick Test Model

If you want to test the GUI/API without retraining, I can create a dummy model for testing purposes.

## What Caused This?

The file size (255MB) is larger than expected (should be ~150MB), suggesting:
- Incomplete save operation
- File corruption during write
- Version mismatch between save/load Keras versions
