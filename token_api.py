from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import jwt
import datetime
from fastapi.middleware.cors import CORSMiddleware

TTK_TOKEN_SECRET = "BmThdDKu4lPOFiiqwHG1GQVm7iGeVIqALcqwJDM6VySzVdOwZ1UMoylzwhIDgXl6"

app = FastAPI()

# Allow CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TokenRequest(BaseModel):
    userId: str
    accessType: str = "client"
    fullName: str = "Debasish Client"
    orderId: str = "RVIS-03072025-001"


@app.post("/generate-token")
def generate_token(data: TokenRequest):
    if not data.userId:
        raise HTTPException(status_code=400, detail="userId is required")

    now = datetime.datetime.now()
    loginTime = now.strftime("%Y-%m-%d %H:%M:%S")
    expiryTimestamp = "1781934720"  # or calculate dynamically if needed

    payload = {
        "userId": data.userId,
        "accessType": data.accessType,
        "fullName": data.fullName,
        "loginTime": loginTime,
        "expiryTimestamp": expiryTimestamp,
        "Order ID": data.orderId,
    }

    token = jwt.encode(payload, TTK_TOKEN_SECRET, algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return {"token": token}
