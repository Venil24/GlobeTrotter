from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.models import CommunityPost, PostComment, User, post_likes
from app.schemas.schemas import PostCreate, PostResponse, CommentCreate, CommentResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/posts", tags=["Community Forum"])

def serialize_post(post: CommunityPost, current_user_id: int) -> dict:
    # Check if liked by current user
    liked_ids = [u.id for u in post.liked_by]
    is_liked = current_user_id in liked_ids

    comments_list = []
    for c in sorted(post.comments, key=lambda x: x.created_at):
        author_name = c.author.name
        author_avatar = c.author.profile.avatar if c.author.profile else ""
        comments_list.append({
            "id": c.id,
            "post_id": c.post_id,
            "author_id": c.author_id,
            "author_name": author_name,
            "author_avatar": author_avatar,
            "content": c.content,
            "created_at": c.created_at.isoformat()
        })

    author_name = post.author.name
    author_avatar = post.author.profile.avatar if post.author.profile else ""

    return {
        "id": post.id,
        "author_id": post.author_id,
        "author_name": author_name,
        "author_avatar": author_avatar,
        "title": post.title,
        "content": post.content,
        "destination": post.destination,
        "image": post.image or "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600",
        "likes_count": len(post.liked_by),
        "is_liked": is_liked,
        "created_at": post.created_at.isoformat(),
        "comments": comments_list
    }

@router.get("", response_model=List[dict])
def list_posts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    posts = db.query(CommunityPost).order_by(CommunityPost.created_at.desc()).all()
    return [serialize_post(p, current_user.id) for p in posts]

@router.post("", response_model=dict, status_code=201)
def create_post(
    post_in: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = CommunityPost(
        author_id=current_user.id,
        title=post_in.title,
        content=post_in.content,
        destination=post_in.destination,
        image=post_in.image
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return serialize_post(post, current_user.id)

@router.post("/{post_id}/like", response_model=dict)
def toggle_like_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Check if already liked
    liked_ids = [u.id for u in post.liked_by]
    if current_user.id in liked_ids:
        # unlike
        post.liked_by.remove(current_user)
    else:
        # like
        post.liked_by.append(current_user)

    db.commit()
    db.refresh(post)
    return serialize_post(post, current_user.id)

@router.post("/{post_id}/comments", response_model=dict)
def add_comment(
    post_id: int,
    comment_in: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = PostComment(
        post_id=post.id,
        author_id=current_user.id,
        content=comment_in.content
    )
    db.add(comment)
    db.commit()
    db.refresh(post)
    return serialize_post(post, current_user.id)
