from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model("outputs/best_model.keras")
IMG_SIZE = (224, 224)

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    img = img.resize(IMG_SIZE)
    arr = np.array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)
    pred = float(model.predict(arr)[0][0])
    label = "FAKE" if pred > 0.5 else "REAL"
    return {"label": label, "confidence": round(pred, 4)}
