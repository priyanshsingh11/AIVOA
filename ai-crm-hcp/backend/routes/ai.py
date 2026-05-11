from fastapi import APIRouter
from schemas.interaction import ChatRequest
from agents.crm_agent import run_crm_agent

router = APIRouter()

@router.post("/chat")
async def chat_with_assistant(request: ChatRequest):
    # This calls our refined LangGraph CRM agent
    response = await run_crm_agent(request.message, request.history)
    return {"response": response}
