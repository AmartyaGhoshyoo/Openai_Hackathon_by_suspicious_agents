import warnings
warnings.filterwarnings('ignore',category=DeprecationWarning)
import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
import redis.asyncio as redis
from fastapi import Header, Body, FastAPI
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from AI_Backend_Modified import openai_agent_declaration,set_db_name
from agents import Runner
app = FastAPI()
# -------------------------------
# CORS Starts
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://openai-hackathon-by-suspicious-agen-omega.vercel.app",
        "https://aai-chatbot-that-moves-with-you.vercel.app",
        
    ],
    allow_origin_regex=r"^https?:\/\/([a-z0-9-]+\.)*parentune\.com$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -------------------------------
# CORS Ends
# -------------------------------




# ---------------------------------------
# Redis Connection Modified ASync Starts
# ----------------------------------------
redis_client = redis.Redis(host="localhost", port=6379, db=0)
DAILY_MESSAGE_LIMIT = 50  # Restricting user from misuing
MIN_LIMIT = 10   # per minute
DAY_LIMIT = 500  # per day

async def check_rate_limit_modified(session_key: str):
    if not session_key:
        return 
    
    # Keys
    minute_key = f"rate:{session_key}:minute"
    day_key = f"rate:{session_key}:day"   # old daily request limit
    msg_day_key = f"msg:{session_key}:day"  # NEW: message count key

    # Increment counters
    minute_count = await redis_client.incr(minute_key)
    day_count = await redis_client.incr(day_key)
    msg_day_count = await redis_client.incr(msg_day_key)  # NEW

    # Expirations
    if minute_count == 1:
        await redis_client.expire(minute_key, 60)

    if day_count == 1:
        await redis_client.expire(day_key, 86400)

    if msg_day_count == 1:
        await redis_client.expire(msg_day_key, 86400)  # resets every 24 hours

    # Return all 3 values
    return minute_count, day_count, msg_day_count
# -------------------------------
# Redis Connection Modified ASync Ends
# -------------------------------


# -------------------------------
# Webpilot Connection Modified Starts
# -------------------------------
class WebpilotRequest(BaseModel):
    message: str
    current_url: str | None = None
@app.post("/chat/agentic_webpilot_modified/")
async def chat_agentic_webpilot(
    data: WebpilotRequest = Body(...),
    session_key: str = Header(None)
):
    print(f'session_key {session_key}')
    message = data.message
    current_url = data.current_url
    minute_count, day_count, msg_day_count = await check_rate_limit_modified(session_key)
    if minute_count > MIN_LIMIT:
        return JSONResponse(
            status_code=429,
            content={"response": "Too many requests — please wait a minute."}
        )
    # NEW: Only 30 messages per day allowed
    if msg_day_count > DAILY_MESSAGE_LIMIT:
        return JSONResponse(
            status_code=429,
            content={"response": "Daily message limit reached — try again tomorrow."}
        )    
    if day_count > DAY_LIMIT:
        return JSONResponse(
            status_code=429,
            content={"response": "Daily limit reached — please try again tomorrow."}
        )
    if len(message)>250:
        return JSONResponse(
            status_code=400,
            content={
                'response':'The query is too long. Please shorten it to 250 characters or less.'
            }
        )
    try:
        session_obj = await set_db_name(session_key)
        user_facing_agent = await openai_agent_declaration(current_url)
        result = await Runner.run(user_facing_agent, message, session=session_obj)
        final_output = result.final_output if hasattr(result, 'final_output') else str(result)
        return JSONResponse(content={
            "best_url": final_output.best_url,
            "response": final_output.response
            })
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "response": "Our servers are currently handling a high volume of requests. Please wait a moment and try again shortly."
            }
        )

# -----------------------------------
# Webpilot Connection Modified Ends
# ------------------------------------
