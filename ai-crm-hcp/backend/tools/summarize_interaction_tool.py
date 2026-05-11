from langchain_core.tools import tool
from langchain_groq import ChatGroq
import os

@tool("summarize_interaction_tool")
def summarize_interaction_tool(transcript: str):
    """Generate a concise CRM-style summary from a long user note or transcript."""
    llm = ChatGroq(model="gemma2-9b-it", groq_api_key=os.getenv("GROQ_API_KEY"))
    prompt = f"Summarize the following HCP interaction transcript into a professional CRM summary: {transcript}"
    response = llm.invoke(prompt)
    return response.content
