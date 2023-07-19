from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import uvicorn
from pydantic import BaseModel


app = FastAPI()

security = HTTPBearer()

class UserCredentials(BaseModel):
    username: str
    password: str

@app.post("/auth/login")
async def login(user_credentials: UserCredentials):
    # Add your login logic here
    # Example: check if the username and password are valid
    if user_credentials.username == "admin" and user_credentials.password == "password":
        # Generate and return a token upon successful login
        return {"token": "33zzkh1em7PMHXOaXRdDvIouuvuzIDdCig8kyVvLTh7ioGub2ZSr229Cw4zZXASV"}
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")


@app.get("/auth/authorize")
async def authorize_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    # Add your authorization logic here
    # Example: check if the user has the required permissions
    print(f"token: authorize:{token}, is valid:{token == '33zzkh1em7PMHXOaXRdDvIouuvuzIDdCig8kyVvLTh7ioGub2ZSr229Cw4zZXASV'}")
    return {"message": "User authorized"}
    if token == "33zzkh1em7PMHXOaXRdDvIouuvuzIDdCig8kyVvLTh7ioGub2ZSr229Cw4zZXASV":
        return {"message": "User authorized"}
    else:
        raise HTTPException(status_code=403, detail="User unauthorized")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
