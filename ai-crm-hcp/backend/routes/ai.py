from fastapi import APIRouter, HTTPException
from schemas.interaction import ChatRequest
from agents.crm_agent import run_crm_agent
import traceback

router = APIRouter()

@router.post("/chat")
async def chat_with_assistant(request: ChatRequest):
    try:
        # This calls our refined LangGraph CRM agent
        print(f"\n[ROUTE] Incoming chat request: {request.message[:50]}...")
        response = await run_crm_agent(request.message, request.history)
        print(f"[ROUTE] Agent response generated successfully.")
        return {"response": response}
    except Exception as e:
        print(f"[ROUTE ERROR] Exception in /chat: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
