# Traffic Signal Detection Backend

This is the FastAPI backend for the Traffic Signal Detection System.

## Setup

1.  Ensure you have Python 3.10+ installed.
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Server

Run the development server:

```bash
uvicorn app.main:app --reload --port 8000
```
or simply double click `run_backend.bat`.

The API will be available at `http://localhost:8000`.
Documentation is available at `http://localhost:8000/docs`.

## API Structure

-   `/api/dashboard`: Dashboard statistics and trends.
-   `/api/detection`: Vehicle detection configuration and stats.
-   `/api/incidents`: Incident management (CRUD).
-   `/api/analytics`: Historical data and reports.
-   `/api/chat`: AI Chatbot endpoint (streaming).
-   `/api/sos-recordings`: SOS video upload and retrieval.
-   `/api/reports`: Report generation.
-   `/api/ws`: WebSocket for real-time updates (detections, etc.).
