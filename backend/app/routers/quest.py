from fastapi import APIRouter, HTTPException
from app.models import QuestRequest, VoyageResponse

# Import our new live generator!
from app.services.llm import generate_quest_live

router = APIRouter(prefix="/quest", tags=["quest"])

@router.post("/generate", response_model=VoyageResponse)
def generate_quest(request: QuestRequest):
    if not request.topic and not request.image_base64:
        raise HTTPException(status_code=400, detail="Must provide either a topic or an image.")
    
    # In the future, we will route to vision model if image_base64 is present
    topic_to_use = request.topic if request.topic else "Image-based Topic"
    
    try:
        # Pass the parameters to the LLM
        quest_data = generate_quest_live(
            topic=topic_to_use, 
            age_group=request.age_group, 
            difficulty=request.difficulty
        )
        return VoyageResponse(**quest_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
