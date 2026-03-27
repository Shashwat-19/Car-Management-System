<div align="center">
  <img src="frontend/public/hero-dashboard.png" alt="Car Management System Dashboard" width="600" />
  <h1>Car Management System</h1>
  <p><strong>A Modern, Full-Stack Vehicle & Service Management Platform</strong></p>
</div>

<br />

The **Car Management System** is a professional, elegantly-designed web application built to streamline vehicle tracking, fleet management, and service scheduling. Originally a Python CLI tool, the project has been completely overhauled into a modern SPA (Single Page Application) with a robust Python backend and a SaaS-grade frontend.

## ✨ Key Features

- **Dashboard Operations**: View fleet metrics, total registered vehicles, recent service history, and quick-action shortcuts from a single comprehensive view.
- **Vehicle Directory**: Register new cars, track ownership details, and delete inactive vehicles with a polished UI.
- **Service Booking**: Schedule maintenance, oil changes, detailing, and paint jobs with interactive cards and custom notes.
- **Maintenance History**: Access detailed, tabular service logs with associated costs and service badge indicators.
- **Split-Screen Authentication**: Secure login flow with Firebase Auth, featuring a beautiful UI and a fallback "Dev Mode" for instant local access.

## 🛠️ Technology Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | Vanilla JS (ES Modules), Vite, CSS (Custom Design System styling), Plus Jakarta Sans font |
| **Backend** | Python 3, FastAPI, Uvicorn |
| **Database** | SQLite, SQLAlchemy ORM |
| **Auth** | Firebase Admin SDK (with local dev toggle) |
| **Infrastructure**| Docker, Docker Compose |

## 🚀 Quick Start (Docker)

The fastest and easiest way to run the entire stack (Frontend + Backend + DB) is using Docker.

```bash
# 1. Clone the repository
git clone https://github.com/Shashwat-19/Car-Management-System.git
cd Car-Management-System

# 2. Build and start the container
docker compose up --build -d
```
Open **http://localhost:8000** in your browser. 
*(If you haven't configured Firebase yet, click the **"Enter Demo Mode"** button to jump straight into the app).*

## 💻 Local Development Setup

If you want to run the frontend and backend separately for development:

### 1. Backend Setup (Port 8000)
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
python3 -m uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup (Port 5173)
```bash
# Open a new terminal tab
cd frontend

# Install dependencies
npm install

# Run Vite dev server
npm run dev
```
Open **http://localhost:5173** in your browser.

## 🔐 Authentication Config (Production)

To enable real authentication via Firebase:
1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable Email/Password authentication.
3. Update `frontend/src/firebase.js` with your Web App configuration.
4. Download your Firebase Admin SDK JSON key, place it securely on your server, and set the environment variable:
   ```bash
   export FIREBASE_SERVICE_ACCOUNT="/path/to/firebase-adminsdk.json"
   ```

## 📂 Project Structure

```text
Car-Management-System/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── database.py          # SQLAlchemy SQLite connection
│   ├── models/              # DB schemas (Cars, Services)
│   ├── routes/              # API endpoints
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── index.html           # Main SPA HTML
│   ├── public/              # Static images (heroes)
│   ├── src/
│   │   ├── api.js           # Fetch wrappers
│   │   ├── main.js          # Routing & Auth Logic
│   │   ├── styles/          # Vanilla CSS Design System
│   │   └── pages/           # Dashboard, Cars, Services modules
│   └── package.json         # Node scripts & Vite dep
├── docker-compose.yml       # One-click deployment
└── Dockerfile               # Multi-stage build process
```

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

Github Template

## 📚 Documentation

Comprehensive documentation for this project is available on [Hashnode](https://hashnode.com/@Shashwat56).

> At present, this README serves as the primary source of documentation.

## 📜 License

This project is distributed under the MIT License.  
For detailed licensing information, please refer to the [LICENSE](./LICENSE) file included in this repository.

## 📩 Contact  
## Shashwat

**Machine Learning Engineer | Scalable AI Systems**

🔹 **ML systems:** (CV, NLP) + data pipelines<br>
🔹 **End-to-end:** training → deployment<br>
🔹 **Backend & Cloud:** Python, Flask, Node.js, Docker, AWS<br>
🔹 **Projects:** Traffic AI, Video Summarizer, AI Assistants<br>

---

## 🚀 Open Source | Tech Innovation  
Building robust applications and leveraging cloud technologies for high-performance solutions.

---

### 📌 Find me here:  
[<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />](https://github.com/Shashwat-19)  [<img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />](https://www.linkedin.com/in/shashwatk1956/)  [<img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" />](mailto:shashwat1956@gmail.com)  [<img src="https://img.shields.io/badge/Hashnode-2962FF?style=for-the-badge&logo=hashnode&logoColor=white" />](https://hashnode.com/@Shashwat56)
[<img src="https://img.shields.io/badge/HackerRank-15%2B-2EC866?style=for-the-badge&logo=HackerRank&logoColor=white" />](https://www.hackerrank.com/profile/shashwat1956)

> Feel free to connect for tech collaborations, open-source contributions, or brainstorming innovative solutions!
