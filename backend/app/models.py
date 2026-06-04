from pydantic import BaseModel
from typing import List, Optional

class QuestRequest(BaseModel):
    topic: Optional[str] = None
    age_group: Optional[int] = 16
    difficulty: Optional[str] = "medium"
    image_base64: Optional[str] = None  # Future proofing for Vision model integration

class Waypoint(BaseModel):
    id: int
    type: str  # e.g., 'learning_island', 'challenge_blockade', 'salvage_dive'
    title: str
    brief: str
    content: Optional[str] = None # Detailed text/questions for the node

class VoyageResponse(BaseModel):
    river_name: str
    topic: str
    total_nodes: int
    waypoints: List[Waypoint]
