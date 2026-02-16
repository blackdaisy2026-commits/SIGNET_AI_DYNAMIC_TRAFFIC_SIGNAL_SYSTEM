from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import dashboard, detection, incidents, analytics, chat, sos, reports, websocket

app = FastAPI(title="Traffic Signal Detection System API", version="1.0.0")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Includes
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(detection.router, prefix="/api/detection", tags=["detection"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["incidents"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(sos.router, prefix="/api/sos-recordings", tags=["sos"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(websocket.router, prefix="/api", tags=["websocket"]) # Mounts /api/ws

@app.get("/")
def read_root():
    return {"message": "Traffic Signal Detection System API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
