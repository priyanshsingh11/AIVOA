from langchain_core.tools import tool
from sqlalchemy.orm import Session
from database.config import SessionLocal
from models.interaction import Interaction
from pydantic import BaseModel, Field
from typing import Optional

class EditInteractionInput(BaseModel):
    interaction_id: int = Field(description="The ID of the interaction to edit")
    hcp_name: Optional[str] = Field(None)
    interaction_type: Optional[str] = Field(None)
    topics_discussed: Optional[str] = Field(None)
    sentiment: Optional[str] = Field(None)
    follow_up: Optional[str] = Field(None)
    summary: Optional[str] = Field(None)
    date: Optional[str] = Field(None)
    time: Optional[str] = Field(None)
    attendees: Optional[str] = Field(None)
    materials_shared: Optional[str] = Field(None)
    samples_distributed: Optional[str] = Field(None)
    outcomes: Optional[str] = Field(None)

@tool("edit_interaction_tool", args_schema=EditInteractionInput)
def edit_interaction_tool(interaction_id: int, **kwargs):
    """Update an existing HCP interaction in the database."""
    db: Session = SessionLocal()
    try:
        interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
        if not interaction:
            return {"status": "error", "message": "Interaction not found"}
        
        for key, value in kwargs.items():
            if value is not None:
                setattr(interaction, key, value)
        
        db.commit()
        return {"status": "success", "message": f"Interaction {interaction_id} updated successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        db.close()
