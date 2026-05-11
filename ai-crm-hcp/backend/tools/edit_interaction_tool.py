from langchain_core.tools import tool
from sqlalchemy.orm import Session
from database.config import SessionLocal
from models.interaction import Interaction
from pydantic import BaseModel, Field
from typing import Optional

class EditInteractionInput(BaseModel):
    interaction_id: int = Field(description="The ID of the interaction to edit")
    sentiment: Optional[str] = Field(None, description="New sentiment value")
    follow_up: Optional[str] = Field(None, description="Updated follow-up actions")
    summary: Optional[str] = Field(None, description="Updated summary")

@tool("edit_interaction_tool", args_schema=EditInteractionInput)
def edit_interaction_tool(interaction_id: int, sentiment: Optional[str] = None, follow_up: Optional[str] = None, summary: Optional[str] = None):
    """Update an existing HCP interaction in the database."""
    db: Session = SessionLocal()
    try:
        interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
        if not interaction:
            return {"status": "error", "message": "Interaction not found"}
        
        if sentiment: interaction.sentiment = sentiment
        if follow_up: interaction.follow_up = follow_up
        if summary: interaction.summary = summary
        
        db.commit()
        return {"status": "success", "message": f"Interaction {interaction_id} updated successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        db.close()
