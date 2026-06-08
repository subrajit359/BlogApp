# Blog Post Manager

A mini post management app built for the MyPustak Full Stack Developer hiring challenge.

- **Backend:** FastAPI (Python) — in-memory storage, REST API
- **Frontend:** React.js + Vite — displays, creates, and deletes posts

---

## Project Structure

```
blogapp/
├── backend/          FastAPI server
│   ├── main.py       API routes and logic
│   └── requirements.txt
└── frontend/         React app
    ├── src/
    │   ├── App.jsx
    │   └── App.css
    └── package.json
```

---

## Setup & Run

### Backend

```bash
cd blogapp/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 4000
```

Backend runs on **http://localhost:4000**

> Bonus: FastAPI auto-generates interactive API docs at **http://localhost:4000/docs**

---

### Frontend

Open a new terminal:

```bash
cd blogapp/frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /posts | Get all posts |
| POST | /posts | Create a new post |
| DELETE | /posts/{id} | Delete a post by ID |

### Example — Create Post

```
POST /posts
Content-Type: application/json

{
  "title": "New Post",
  "body": "This is a new post"
}
```

### Example — Response

```json
{
  "id": 1,
  "title": "New Post",
  "body": "This is a new post",
  "createdAt": "2026-06-08T10:00:00+00:00"
}
```

---

## Notes

- No database — posts live in memory and reset on server restart
- Validation is handled on both frontend and backend
- CORS is enabled so the React app can talk to the FastAPI server freely
