import json

def generate_quest_mock(topic: str) -> dict:
    # A mock function to simulate LLM generation for now.
    # We will replace this with actual Ollama/Gemma calls.
    return {
        "river_name": f"The Sea of {topic}",
        "topic": topic,
        "total_nodes": 4,
        "waypoints": [
            {
                "id": 1,
                "type": "learning_island",
                "title": f"Intro to {topic}",
                "brief": f"Learn the basics of {topic}."
            },
            {
                "id": 2,
                "type": "challenge_blockade",
                "title": "First Assessment",
                "brief": "A quick quiz to check your understanding."
            },
            {
                "id": 3,
                "type": "learning_island",
                "title": f"Advanced {topic}",
                "brief": "Diving deeper into the concepts."
            },
            {
                "id": 4,
                "type": "boss_blockade",
                "title": "Final Trial",
                "brief": "Defeat the Kraken by proving your mastery."
            }
        ]
    }
