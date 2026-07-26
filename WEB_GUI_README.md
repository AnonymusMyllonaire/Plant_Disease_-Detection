# BioScan Web GUI - Integration Complete

## Overview
The Lovable React web GUI has been successfully integrated with your Python backend API.

## What Was Done

### 1. API Client (`src/lib/api.ts`)
- Created TypeScript API client for backend communication
- Handles image upload and prediction requests
- Type-safe interfaces for API responses

### 2. React Hook (`src/hooks/usePredictDisease.ts`)
- Created custom React Query hook for predictions
- Handles loading states and error handling
- Shows toast notifications for user feedback

### 3. Dashboard Integration (`src/components/BioScan/BioScanDashboard.tsx`)
- Replaced mock data with real API calls
- Added file upload functionality
- Implemented camera capture feature
- Real-time disease prediction display

### 4. Environment Configuration (`.env`)
- API URL configuration: `http://localhost:8000`
- Can be changed for production deployment

## How to Run

### 1. Start the Backend API
```bash
# In one terminal
python api.py
```
The API will run on `http://localhost:8000`

### 2. Start the Web GUI
```bash
# In another terminal
npm run dev
```
The web app will run on `http://localhost:5173` (or similar)

### 3. Use the Application
1. Open browser to the web app URL
2. Click "Upload File" or "Open Camera"
3. Select/capture a plant leaf image
4. View real-time AI diagnosis results

## Features
- ✅ Real-time disease detection
- ✅ Confidence scores for all classes
- ✅ Symptoms and treatment recommendations
- ✅ File upload support (JPG, PNG, WEBP)
- ✅ Camera capture functionality
- ✅ Beautiful dark mode UI with neon accents
- ✅ Responsive design (mobile + desktop)

## API Endpoints
- `GET /` - Health check
- `POST /predict` - Upload image for prediction

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind + Shadcn UI
- **Backend**: FastAPI + TensorFlow/Keras
- **Model**: CNN trained on bean leaf dataset (81% accuracy)
