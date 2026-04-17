# Deepfake Detection UI

React + Vite frontend for the deepfake detection project.

## Features
- Live `Detect` tab to upload image and run backend prediction
- Dashboard sections for overview, detectors, datasets, and training config
- API health status indicator

## Run
1. Install dependencies:
   - `npm install`
2. Start dev server:
   - `npm run dev`

Frontend runs on `http://localhost:5173` by default.

## Backend requirement
The UI expects the backend API running at:
- `http://127.0.0.1:8000`

Start backend from sibling folder `../deepfakedetection`:
- `python -m uvicorn api_server:app --host 0.0.0.0 --port 8000 --reload`

Optional API override:
- Create `.env` in this folder and set `VITE_API_BASE_URL=http://127.0.0.1:8000`
