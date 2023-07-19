from fastapi import FastAPI, HTTPException
import uvicorn

app = FastAPI()

@app.get("/demo/test")
async def test():
    return {"message": "Hello Everyone!!"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
