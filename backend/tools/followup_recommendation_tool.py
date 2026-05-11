from langchain_core.tools import tool
from langchain_groq import ChatGroq
import os

@tool("followup_recommendation_tool")
def followup_recommendation_tool(summary: str):
    """Suggest intelligent next actions (e.g., schedule meeting, send brochure) based on interaction summary."""
    llm = ChatGroq(model="llama-3.1-8b-instant", groq_api_key=os.getenv("GROQ_API_KEY"))
    prompt = f"Based on this interaction summary, suggest 3 intelligent follow-up actions for the sales representative: {summary}"
    response = llm.invoke(prompt)
    return response.content
