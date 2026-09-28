import os
import json
import re
import shutil
import urllib.parse
from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, Form, Request, status
from fastapi.responses import JSONResponse, RedirectResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv
import asyncio
import uuid

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
    except Exception:
        model = None
else:
    model = None

app = FastAPI(title="PocketSmart: AI Budget Planner")

SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

class RegisterUser(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserInDB(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    hashed_password: str

class UserSession(BaseModel):
    username: str
    login_time: datetime
    last_activity: datetime
    token: str
    user_data: Dict[str, Any] = {}

class HomeBudgetInput(BaseModel):
    total_budget: float
    num_lights: int = 0
    num_fans: int = 0
    num_furniture: int = 0
    num_dining_tables: int = 0
    has_living_room: bool = False
    has_kitchen: bool = False
    has_bedroom: bool = False
    additional_requirements: Optional[str] = None

class PartyBudgetInput(BaseModel):
    total_budget: float
    num_guests: int
    party_type: str
    venue_type: Optional[str] = None
    needs_catering: bool = False
    needs_decoration: bool = False
    needs_entertainment: bool = False
    additional_requirements: Optional[str] = None

class JewelryBudgetInput(BaseModel):
    total_budget: float
    occasion: str
    preferences: Optional[str] = None

class RecommendationHistoryItem:
    def __init__(self, id: str, timestamp: datetime, recommendation_type: str, input_summary: str, result_summary: str, full_result: dict):
        self.id = id
        self.timestamp = timestamp
        self.recommendation_type = recommendation_type
        self.input_summary = input_summary
        self.result_summary = result_summary
        self.full_result = full_result

users_db: Dict[str, UserInDB] = {}
active_sessions: Dict[str, UserSession] = {}
blacklisted_tokens = set()
user_recommendations: Dict[str, List[RecommendationHistoryItem]] = {}

users_db["sai"] = UserInDB(
    username="sai",
    email="sai@example.com",
    full_name="Sai",
    hashed_password=pwd_context.hash("password123")
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="templates")
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_token(request: Request) -> Optional[str]:
    token = request.cookies.get("access_token")
    if token:
        return token
    auth = request.headers.get("Authorization")
    if auth and auth.startswith("Bearer "):
        return auth.split(" ")[1]
    return None

async def get_current_user(request: Request, token: Optional[str] = Depends(oauth2_scheme)) -> Optional[UserInDB]:
    if not token:
        token = await get_token(request)
    if not token or token in blacklisted_tokens:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            return None
    except JWTError:
        return None
    return users_db.get(username)

async def get_current_active_user(request: Request, current_user: Optional[UserInDB] = Depends(get_current_user)) -> UserInDB:
    if current_user is None:
        token = await get_token(request)
        if token:
            current_user = await get_current_user(request, token)
    if current_user is None:
        accept = request.headers.get("Accept", "")
        if "text/html" in accept:
            raise HTTPException(status_code=status.HTTP_307_TEMPORARY_REDIRECT, headers={"Location": "/login"})
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    return current_user

def extract_json_from_response(text: str) -> dict:
    if not text:
        return {}
    clean = text.strip()
    try:
        return json.loads(clean)
    except Exception:
        pass
    m = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', clean)
    if m:
        try:
            return json.loads(m.group(1).strip())
        except Exception:
            pass
    return {"total_budget": 0.0, "raw": clean}

def save_upload_file(image: UploadFile) -> str:
    path = os.path.join("static/uploads", f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{image.filename}")
    with open(path, "wb") as buf:
        shutil.copyfileobj(image.file, buf)
    return path

def save_to_history(username: str, recommendation_type: str, input_data: dict, result: dict):
    if username not in user_recommendations:
        user_recommendations[username] = []
    item = RecommendationHistoryItem(
        id=str(uuid.uuid4()),
        timestamp=datetime.utcnow(),
        recommendation_type=recommendation_type,
        input_summary=f"₹{input_data.get('total_budget', 0):,.0f} • {recommendation_type.title()} Budget",
        result_summary=f"Budget: ₹{result.get('total_budget', 0):,.0f} - Remaining: ₹{result.get('remaining_budget', 0):,.0f}",
        full_result=result
    )
    user_recommendations[username].insert(0, item)

@app.get("/", response_class=HTMLResponse)
async def home_page(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request, current_user: UserInDB = Depends(get_current_active_user)):
    return templates.TemplateResponse("dashboard.html", {"request": request, "user": current_user})

@app.get("/home-planner", response_class=HTMLResponse)
async def home_planner(request: Request, current_user: UserInDB = Depends(get_current_active_user)):
    return templates.TemplateResponse("home_planner.html", {"request": request, "user": current_user})

@app.get("/party-planner", response_class=HTMLResponse)
async def party_planner(request: Request, current_user: UserInDB = Depends(get_current_active_user)):
    return templates.TemplateResponse("party_planner.html", {"request": request, "user": current_user})

@app.get("/jewelry-planner", response_class=HTMLResponse)
async def jewelry_planner(request: Request, current_user: UserInDB = Depends(get_current_active_user)):
    return templates.TemplateResponse("jewelry_planner.html", {"request": request, "user": current_user})

@app.get("/history", response_class=HTMLResponse)
async def history(request: Request, current_user: UserInDB = Depends(get_current_active_user)):
    return templates.TemplateResponse("history.html", {"request": request, "user": current_user})

@app.get("/login", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.post("/register")
async def register(user_data: RegisterUser):
    if user_data.username in users_db:
        raise HTTPException(400, "Username already registered")
    users_db[user_data.username] = UserInDB(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=pwd_context.hash(user_data.password)
    )
    return {"message": "User registered successfully"}

@app.post("/token", response_model=Token)
async def login_for_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(401, "Incorrect username or password")
    token = create_access_token({"sub": user.username})
    active_sessions[user.username] = UserSession(
        username=user.username,
        login_time=datetime.utcnow(),
        last_activity=datetime.utcnow(),
        token=token
    )
    resp = JSONResponse({"access_token": token, "token_type": "bearer"})
    resp.set_cookie("access_token", token, httponly=True)
    return resp

@app.post("/logout")
async def logout(request: Request):
    token = await get_token(request)
    if token:
        blacklisted_tokens.add(token)
    resp = RedirectResponse("/login", status_code=302)
    resp.delete_cookie("access_token")
    return resp

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
