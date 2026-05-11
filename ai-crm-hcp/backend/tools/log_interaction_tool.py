from langchain_core.tools import tool
from sqlalchemy.orm import Session
from database.config import SessionLocal
from models.interaction import Interaction
from pydantic import BaseModel, Field
from typing import Optional

class LogInteractionInput(BaseModel):
    hcp_name: str = Field(description="Name of the Healthcare Professional")
    interaction_type: str = Field(description="Type of interaction (e.g., Meeting, Virtual Call)")
    topics_discussed: str = Field(description="Summary of topics discussed")
    sentiment: str = Field(description="Sentiment of the HCP (Positive, Neutral, Negative)")
    follow_up: Optional[str] = Field(None, description="Planned follow-up actions")
    summary: Optional[str] = Field(None, description="Brief summary of the interaction")
    date: Optional[str] = Field(None, description="Date of the interaction (YYYY-MM-DD)")
    time: Optional[str] = Field(None, description="Time of the interaction (HH:MM)")
    attendees: Optional[str] = Field(None, description="Names of attendees")
    materials_shared: Optional[str] = Field(None, description="Materials shared during the meeting")
    samples_distributed: Optional[str] = Field(None, description="Samples distributed to the HCP")
    outcomes: Optional[str] = Field(None, description="Key outcomes and next steps")

@tool("log_interaction_tool", args_schema=LogInteractionInput)
def log_interaction_tool(
    hcp_name: str, 
    interaction_type: str, 
    topics_discussed: str, 
    sentiment: str, 
    follow_up: Optional[str] = None, 
    summary: Optional[str] = None,
    date: Optional[str] = None,
    time: Optional[str] = None,
    attendees: Optional[str] = None,
    materials_shared: Optional[str] = None,
    samples_distributed: Optional[str] = None,
    outcomes: Optional[str] = None
):
    """Log a new interaction with an HCP into the database."""
    db: Session = SessionLocal()
    try:
        new_interaction = Interaction(
            hcp_name=hcp_name,
            interaction_type=interaction_type,
            topics_discussed=topics_discussed,
            sentiment=sentiment,
            follow_up=follow_up,
            summary=summary,
            date=date,
            time=time,
            attendees=attendees,
            materials_shared=materials_shared,
            samples_distributed=samples_distributed,
            outcomes=outcomes
        )
        db.add(new_interaction)
        db.commit()
        db.refresh(new_interaction)
        return {
            "status": "success",
            "message": f"Interaction for {hcp_name} logged successfully",
            "data": {"id": new_interaction.id}
        }
    except Exception as e:
        print(f"[TOOL ERROR] log_interaction_tool: {str(e)}")
        return {"status": "error", "message": str(e)}
    finally:
        db.close()
