# KinMind AI - Implementation Plan

This document outlines the detailed roadmap for building out KinMind AI, transitioning from the architectural foundation of SobaHealth Edge to a gamified, nautical-themed educational app.

## Phase 1: The AI Cartographer (Backend Core) - *Mostly Complete*
**Goal:** Edge server dynamically generates a map/river based on prompts.
*   [x] Initialize FastAPI project and define Pydantic schemas.
*   [x] Create `/quest/generate` endpoint.
*   [x] Integrate local Ollama (Llama 3 / Gemma 4) to output strict JSON waypoints using a "Grand Navigator" prompt.
*   [ ] **Pending:** Integrate Vision (e.g., LLaVA) so `image_base64` payloads (photos of a syllabus) are parsed into waypoints.

## Phase 2: The Winding River UI (Frontend Core) - *Next Step*
**Goal:** Build the Clash Royale-style dynamic map layout.
*   [ ] Setup React Native UI components with a "Nautical/Steampunk Fantasy" aesthetic (dark woods, brass, parchment).
*   [ ] **Tile System:** Create seamless SVG tiles (`Straight`, `Curve_Left`, `Curve_Right`) that construct an infinite scrolling river using `FlatList`.
*   [ ] **The Ship:** Implement the player's avatar (a boat) that sits on the river.
*   [ ] **Animation:** Use `react-native-reanimated` to interpolate the ship's movement from one node to the next based on successful task completion.
*   [ ] **Visual Polish:** Integrate `lottie-react-native` for map reveals, node unlocks, and UI feedback.

## Phase 3: The Content Engine & Gameplay Loop
**Goal:** Populate the nodes with actual playable educational material.
*   [ ] **Backend Endpoint:** Create `/quest/node/{node_id}/generate` to dynamically generate 5-question quizzes or micro-lessons for specific nodes.
*   [ ] **Frontend Challenge UI:** Create the interactive modal where students solve problems.
*   [ ] **The Ship's Wheel (PTT):** Implement the Push-to-Talk Whisper interface for speech-based answers or questions.
*   [ ] **The Logbook (Explanation):** Implement the `<think>` block parser so the student can see the AI's step-by-step reasoning if they get stuck.

## Phase 4: Local RAG, State, and Offline Fallback
**Goal:** Persist progress and allow offline play.
*   [ ] **The Cargo/Inventory (SQLite):** Save student performance locally.
*   [ ] **Dynamic Adjustment:** Feed "Inventory" stats back to the edge server so it spawns "Salvage Dives" (review nodes) if they struggle.
*   [ ] **The Compass (Offline Fallback):** Re-integrate `react-native-litert-lm`. If the Edge Lighthouse server goes offline, the app switches to the on-device LiteRT model to continue generation without internet.
