# TutorBot

TutorBot is an AI-powered interactive learning assistant designed to help students get instant answers and explanations.  
Built for **StarHacks 2025**, this project combines a simple frontend UI with a powerful backend chatbot.


##  Features
-  Real-time chatbot for question answering  
-  Fast frontend built with React + Tailwind CSS  
-  AI backend powered by FastAPI  
-  Responsive design for smooth UX


##  Tech Stack
- **Frontend**: React, Vite, Tailwind CSS  
- **Backend**: Python, FastAPI  
- **AI**: Greq


## Running the Project
**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Project Structure:
atutorbot/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
├── README.md
