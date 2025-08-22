from fastapi import FastAPI, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from . import models, schemas, utils, database, auth
import os
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from dotenv import load_dotenv
from .deps import get_current_user
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",                   # local dev
        "https://auth-five-smoky.vercel.app"       # deployed frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


load_dotenv()
GOOGLE_CLIENT_ID = os.getenv('ClientID') or os.getenv('GOOGLE_CLIENT_ID')

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post('/signup', response_model=schemas.UserRead)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail='Email already registered')
    hashed_pw = utils.hash_password(user.password)
    new_user = models.User(
        email=user.email,
        hashed_password=hashed_pw,
        first_name=user.first_name,
        last_name=user.last_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post('/signin')
def signin(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not utils.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail='Invalid credentials')
    token = auth.create_access_token(data={'sub': db_user.email})
    return {'access_token': token, 'token_type': 'bearer'}

@app.post('/google-login')
async def google_login(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    token = data.get('id_token')
    if not token:
        raise HTTPException(status_code=400, detail='Missing id_token')
    try:
        idinfo = id_token.verify_oauth2_token(token, grequests.Request(), GOOGLE_CLIENT_ID)
        email = idinfo['email']
        first_name = idinfo.get('given_name')
        last_name = idinfo.get('family_name')
    except Exception:
        raise HTTPException(status_code=400, detail='Invalid Google token')
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if not db_user:
        db_user = models.User(
            email=email,
            hashed_password=utils.hash_password(os.urandom(16).hex()),  # random pw
            first_name=first_name,
            last_name=last_name
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    access_token = auth.create_access_token(data={'sub': db_user.email})
    return {'access_token': access_token, 'token_type': 'bearer'}

@app.get('/me', response_model=schemas.UserRead)
def read_me(current_user: models.User = Depends(get_current_user)):
    return current_user
