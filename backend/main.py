from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timezone

app = FastAPI(title="Blog Post API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# in-memory storage — no database needed for this
posts = [
    {
        "id": 1,
        "title": "Hello World",
        "body": "My first post ever. Pretty exciting!",
        "createdAt": datetime(2026, 6, 7, 10, 0, 0, tzinfo=timezone.utc).isoformat()
    },
    {
        "id": 2,
        "title": "Getting Started with Blogging",
        "body": "Writing consistently is hard but rewarding. Start small.",
        "createdAt": datetime(2026, 6, 8, 9, 0, 0, tzinfo=timezone.utc).isoformat()
    }
]

current_id = 3


class PostInput(BaseModel):
    title: str
    body: str


@app.get("/posts")
def get_posts():
    return posts


@app.post("/posts", status_code=201)
def create_post(data: PostInput):
    global current_id

    if not data.title.strip():
        raise HTTPException(status_code=400, detail="Title is required")
    if not data.body.strip():
        raise HTTPException(status_code=400, detail="Body cannot be empty")

    post = {
        "id": current_id,
        "title": data.title.strip(),
        "body": data.body.strip(),
        "createdAt": datetime.now(timezone.utc).isoformat()
    }

    current_id += 1
    posts.append(post)
    return post


@app.delete("/posts/{post_id}", status_code=204)
def delete_post(post_id: int):
    global posts

    idx = next((i for i, p in enumerate(posts) if p["id"] == post_id), None)

    if idx is None:
        raise HTTPException(status_code=404, detail="Post not found")

    posts.pop(idx)
