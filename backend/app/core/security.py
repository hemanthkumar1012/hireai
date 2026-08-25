from datetime import datetime, timedelta, timezone
from collections import defaultdict, deque
from threading import Lock
import time
from typing import Any, Union
import jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

_rate_limit_events = defaultdict(deque)
_rate_limit_lock = Lock()


def enforce_rate_limit(client_key: str, action: str, limit: int = 30, window_seconds: int = 60) -> None:
    """Limit repeated authentication requests in this process."""
    now = time.monotonic()
    bucket_key = f"{action}:{client_key}"
    with _rate_limit_lock:
        events = _rate_limit_events[bucket_key]
        while events and now - events[0] >= window_seconds:
            events.popleft()
        if len(events) >= limit:
            raise ValueError("Too many requests. Please try again later.")
        events.append(now)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def create_refresh_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm="HS256")
    return encoded_jwt
