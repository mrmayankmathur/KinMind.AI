# KinMind AI - Setup & Developer Guide

Welcome to KinMind AI, the offline-capable gamified educational app! It is split into two halves: The **Lighthouse** (FastAPI edge server) and the **Ship** (React Native mobile app).

---

## 1. Starting the Lighthouse (Backend Edge Server)

The backend handles the heavy lifting, running local LLMs like Llama 3 or Gemma to generate custom maps and quests.

### Prerequisites:
1. Ensure you have [Ollama](https://ollama.com/) installed and running on your machine.
2. Pull the required models:
   ```bash
   ollama pull llama3
   ```
3. Have Python 3.10+ installed.

### Execution:
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd KinMind_AI/backend
   ```
2. Activate your virtual environment:
   * **Mac/Linux:** `source venv/bin/activate`
   * *(If you haven't created one, run: `python3 -m venv venv` first)*
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server using Uvicorn:
   ```bash
   uvicorn app.main:app --reload
   ```
   **The Lighthouse is now illuminated!** 
   You can verify it works by opening [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) in your browser.

---

## 2. Setting Sail (React Native Mobile App)

The frontend is an Expo-managed workflow, focused on rich UI running on local physics.

### Prerequisites:
1. Have Node.js installed.
2. Have the Expo CLI available via `npx expo`.
3. An iOS Simulator, Android Emulator, or the Expo Go app on your physical device.

### Execution:
1. Open a new terminal tab and navigate to the mobile folder:
   ```bash
   cd KinMind_AI/mobile
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Boot the Expo development server:
   ```bash
   npx expo start
   ```
4. Press `i` to open in the iOS simulator, or `a` to open in the Android emulator.

---

## Troubleshooting

* **My backend is returning a default mock instead of AI generated nodes:**
  Ensure the Ollama application is actively running in the background of your computer and that `ollama pull llama3` finished successfully. The backend is coded to gracefully fallback to a mock dictionary if it cannot reach Ollama locally.
* **Network Errors from Mobile:**
  If testing on a physical device, ensure the React Native API base URL is pointing to your computer's local IP address (e.g., `http://192.168.x.x:8000`), not `localhost`, as `localhost` would point to the phone itself.
