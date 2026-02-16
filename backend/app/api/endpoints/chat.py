from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
import asyncio
import os

router = APIRouter()

# --- Models ---
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    language: str = "en"

# --- Endpoints ---

@router.post("/")
async def chat_endpoint(request: ChatRequest):
    """
    Chat endpoint for emergency support chatbot.
    """
    async def event_generator():
        # Simulate thinking delay
        await asyncio.sleep(0.5)
        
        response_text = "Hello, I am the emergency support assistant. How can I help you today?"
        if request.language == "es":
             response_text = "Hola, soy el asistente de soporte de emergencia. ¿Cómo puedo ayudarte hoy?"

        # Stream the response word by word
        words = response_text.split()
        for word in words:
            data = json.dumps({"type": "text-delta", "delta": word + " "})
            yield f"data: {data}\n\n"
            await asyncio.sleep(0.1)
        
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
