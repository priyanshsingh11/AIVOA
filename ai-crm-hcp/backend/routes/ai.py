from fastapi import APIRouter
from schemas.interaction import ChatRequest
from agents.graph import run_agent

router = APIRouter()

@router.post("/chat")
async def chat_with_assistant(request: ChatRequest):
    # This calls our LangGraph agent
    response = await run_agent(request.message, request.history)
    return {"response": response}
