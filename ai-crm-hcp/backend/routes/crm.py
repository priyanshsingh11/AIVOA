from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database.config import get_db
from models.interaction import Interaction as InteractionModel
from schemas.interaction import InteractionCreate, InteractionUpdate, Interaction as InteractionSchema

router = APIRouter()

@router.post("/save-interaction", response_model=InteractionSchema)
def save_interaction(interaction: InteractionCreate, db: Session = Depends(get_db)):
    db_interaction = InteractionModel(**interaction.model_dump())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@router.put("/edit-interaction/{interaction_id}", response_model=InteractionSchema)
def edit_interaction(interaction_id: int, interaction: InteractionUpdate, db: Session = Depends(get_db)):
    db_interaction = db.query(InteractionModel).filter(InteractionModel.id == interaction_id).first()
    if not db_interaction:
        raise HTTPException(status_code=44, detail="Interaction not found")
    
    update_data = interaction.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_interaction, key, value)
    
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@router.get("/interaction-history", response_model=List[InteractionSchema])
def get_interaction_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    interactions = db.query(InteractionModel).offset(skip).limit(limit).all()
    return interactions
