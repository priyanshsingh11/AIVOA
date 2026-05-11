from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from database.config import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String(255), index=True)
    interaction_type = Column(String(100))
    date = Column(String(50))
    time = Column(String(50))
    attendees = Column(Text)
    topics_discussed = Column(Text)
    materials_shared = Column(Text)
    samples_distributed = Column(Text)
    sentiment = Column(String(50))
    outcomes = Column(Text)
    follow_up = Column(Text)
    summary = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
