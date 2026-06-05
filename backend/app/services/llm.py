import json
import ollama

def get_system_prompt(age_group: int, difficulty: str) -> str:
    return f"""You are the Grand Navigator for 'KinMind', an educational sailing adventure. 
Your job is to chart a 'River of Knowledge' based on a study topic.

Target Audience: {age_group}-year-old student
Difficulty Level: {difficulty}

You must create a sequence of waypoints for their journey. 
Waypoint Rules:
1. type: Must be EXACTLY one of: 'learning_island' (for teaching concepts), 'challenge_blockade' (a test or quiz), or 'boss_blockade' (the final exam).
2. brief: A short, pirate/nautical themed description of what happens at this node.

Return ONLY a valid JSON object matching this schema, completely unmarkdown'd:
{{
  "river_name": "A cool nautical name for this topic",
  "topic": "The input topic",
  "total_nodes": Integer between 3 and 6,
  "waypoints": [
    {{
      "id": 1,
      "type": "learning_island",
      "title": "String",
      "brief": "String",
      "content": null
    }}
  ]
}}
"""

def generate_quest_live(topic: str, age_group: int = 16, difficulty: str = "medium") -> dict:
    """Hits the local Ollama instance to generate the nodes."""
    print(f"Asking Ollama to chart a course for: {topic}...")
    
    # We use llama3 or gemma depending on what is pulled locally
    model_name = 'llama3' 
    
    try:
        response = ollama.chat(model=model_name, messages=[
            {
                'role': 'system',
                'content': get_system_prompt(age_group, difficulty)
            },
            {
                'role': 'user',
                'content': f"Chart a course for the topic: {topic}"
            }
        ], format='json') # Enforce JSON format native feature
        
        result_json = response['message']['content']
        return json.loads(result_json)
        
    except Exception as e:
        print(f"LLM Generation failed (Is Ollama running?): {e}")
        # Automatically fallback to a safe mock if the LLM fails or is off
        from app.services.llm_mock import generate_quest_mock
        return generate_quest_mock(topic)
