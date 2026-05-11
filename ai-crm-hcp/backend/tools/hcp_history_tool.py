from langchain_core.tools import tool
from sqlalchemy.orm import Session
from database.config import SessionLocal
from models.interaction import Interaction

@tool("hcp_history_tool")
def hcp_history_tool(hcp_name: str):
    """Fetch previous interactions for a given HCP from the database."""
    db: Session = SessionLocal()
    try:
        history = db.query(Interaction).filter(Interaction.hcp_name.ilike(f"%{hcp_name}%")).all()
        if not history:
            return f"No previous interactions found for {hcp_name}."
        
        result = []
        for item in history:
            result.append({
                "date": str(item.created_at),
                "type": item.interaction_type,
                "summary": item.summary,
                "sentiment": item.sentiment
            })
        return result
    except Exception as e:
        return f"Error fetching history: {str(e)}"
    finally:
        db.close()
