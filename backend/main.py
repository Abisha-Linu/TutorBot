from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv

# Load .env
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

# Initialize Groq client
client = Groq(api_key=groq_api_key)

# Create FastAPI app
app = FastAPI()

# Allow frontend (React) to connect
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class ChatRequest(BaseModel):
    user_id: str
    message: str

# In-memory chat history
chat_history = {}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        if request.user_id not in chat_history:
            chat_history[request.user_id] = []

        # Add user message
        chat_history[request.user_id].append(
            {"role": "user", "content": request.message}
        )

        # Call Groq API
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful tutor bot."}
            ] + chat_history[request.user_id],
        )

        # Log whole response
        print("Groq response:", response)

        # Extract reply safely
        reply = (
            response.choices[0].message.content
            if hasattr(response.choices[0], "message")
            else response.choices[0].text
        )

        # Add assistant reply
        chat_history[request.user_id].append(
            {"role": "assistant", "content": reply}
        )

        return {"reply": reply, "history": chat_history[request.user_id]}

    except Exception as e:
        print("Backend error:", e)  # log in terminal
        return {
            "reply": f"⚠️ Error: {str(e)}",
            "history": chat_history.get(request.user_id, []),
            "error": str(e),
        }
