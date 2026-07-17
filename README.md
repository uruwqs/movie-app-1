# ATNU
Atrium Comfort is a web application that analyzes the comfort level of a university atrium using real environmental data collected from a Telegram channel. The system automatically gathers sensor measurements, stores historical data, performs environmental analysis, and provides users with recommendations for a more comfortable study environment.

## Features
- Automatic Telegram data parsing every 30 seconds
- Historical data storage for the last 60 days
- Automatic removal of outdated records
- Temperature, lighting, and noise analysis
- Overall comfort level evaluation
- Health risk detection
- Personalized drink recommendations
- Best study time prediction
- Analytical insights based on collected data
- User feedback system

## Architecture

```
Telegram Channel
        │
        ▼
Telegram Parser
        │
        ▼
SQLite Database
        │
        ▼
FastAPI Backend
        │
        ├── Business Logic
        └── REST API (JSON)
                │
                ▼
React Frontend
                │
                ▼
              User
```

---

## System Workflow

1. The FastAPI server starts and automatically launches the Telegram parser.
2. The parser downloads approximately two months of historical sensor data from the Telegram channel.
3. The collected data is stored in an SQLite database.
4. After synchronization, the parser continuously monitors the Telegram channel every 30 seconds.
5. Newly published measurements are automatically added to the database.
6. Records older than 60 days are automatically removed to keep the database lightweight and relevant.
7. When a user opens the application, the React frontend sends a request to the FastAPI backend.
8. FastAPI retrieves the required data from SQLite.
9. The Business Logic module analyzes the collected measurements.
10. The backend returns the processed results as JSON through REST API.
11. React displays the information to the user.

---

## Backend

The backend is implemented using **FastAPI** and is responsible for:

- Running the Telegram parser
- Synchronizing sensor data
- Managing the SQLite database
- Performing environmental analysis
- Generating recommendations
- Providing REST API endpoints for the frontend

### Business Logic

The backend performs the following analyses:

- Latest measurements retrieval
- Temperature analysis
- Lighting analysis
- Noise analysis
- Overall comfort evaluation
- Health risk assessment
- Drink recommendation generation
- Best study time prediction
- Analytical insight generation
- User feedback processing

---

## Frontend

The frontend is built with **React** and communicates with the backend through REST API. It visualizes sensor measurements, analytical insights, recommendations, and user feedback in an interactive interface.

---

## TECNOLOGIES

### Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- BeautifulSoup4
- Requests

### Frontend

- React
- TypeScript
- Vite

---

## REST API

The backend exposes REST API endpoints that return data in JSON format.

Main endpoints include:

- `/api/summary`
- `/api/readings`
- `/api/reports`

---

## Project Structure

```
backend/
├── parser.py
├── main.py
├── database.py
├── models.py
├── schemas.py
├── services/
└── db.sqlite

frontend/
├── src/
├── components/
├── pages/
└── assets/
```

---

## Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Authors
sigma iris, sigma dana, sigma amina
