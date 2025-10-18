# SASTRA Campus Game 🎮🏫

A full-stack pixel-art style campus navigation and interaction game built using **React**, **TypeScript**, **Tailwind CSS**, **Vite**, and a **Python ML recommender system**. This app replicates the SASTRA University campus and allows users to interact with buildings, access information, and get club recommendations.

---

## 🧠 Features

- 🔓 **Authentication System** (Login/Signup)
- 🧑‍💻 **Role-based panels**: Profile, Materials, Notifications
- 🧭 **Game-style Navigation UI** with character animations
- 📍 **Interactive Campus Map** (with clickable locations)
- 💬 **Chatbot Integration**
- 📊 **Club Recommender System** (Python backend with `.pkl` models)

---

## 🚀 Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- PostCSS

### Backend
- Node.js + Express
- MongoDB (via Mongoose)

### Machine Learning
- Python
- Scikit-learn models (`club_encoder.pkl`, `club_recommender.pkl`)

---

## 🖥️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/sastra-campus-game.git
cd sastra-campus-game
2. Install Node dependencies
npm install

3. Start the frontend
npm run dev

4. Set up backend
cd server
npm install
node server.js
5. Run Python ML script (optional)
python recommender.py


✅ Ensure your .env file is properly configured and MongoDB is running.