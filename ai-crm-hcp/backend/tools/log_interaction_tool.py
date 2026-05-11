from langchain_core.tools import tool
from sqlalchemy.orm import Session
from database.config import SessionLocal
from models.interaction import Interaction
from pydantic import BaseModel, Field

class LogInteractionInput(BaseModel):
    hcp_name: str = Field(description="Name of the Healthcare Professional")
    interaction_type: str = Field(description="Type of interaction (e.g., Meeting, Virtual Call)")
    topics_discussed: str = Field(description="Summary of topics discussed")
    sentiment: str = Field(description="Sentiment of the HCP (Positive, Neutral, Negative)")
    follow_up: str = Field(description="Planned follow-up actions")
    summary: str = Field(description="Brief summary of the interaction")

@tool("log_interaction_tool", args_schema=LogInteractionInput)
def log_interaction_tool(hcp_name: str, interaction_type: str, topics_discussed: str, sentiment: str, follow_up: str, summary: str):
    """Log a new interaction with an HCP into the database."""
    db: Session = SessionLocal()
    try:
        new_interaction = Interaction(
            hcp_name=hcp_name,
            interaction_type=interaction_type,
            topics_discussed=topics_discussed,
            sentiment=sentiment,
            follow_up=follow_up,
            summary=summary
        )
        db.add(new_interaction)
        db.commit()
        db.refresh(new_interaction)
        return {
            "status": "success",
            "message": f"Interaction for {hcp_name} logged successfully",
            "data": {
                "id": new_interaction.id,
                "hcp_name": new_interaction.hcp_name
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        db.close()
