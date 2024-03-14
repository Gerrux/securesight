import uvicorn
from fastapi import FastAPI
import pycuda.driver as cuda
from app.routes import router
import torch
torch.cuda.empty_cache()

app = FastAPI()

ctx = None


async def startup():
    global ctx
    ctx = cuda.Context.attach()
    torch.cuda.empty_cache()


async def shutdown():
    global ctx
    if ctx is not None:
        ctx.detach()

@app.get("/")
async def root():
    return {"message": "Welcome to SecureSight Assistant API"}

# Добавляем контекст жизненного цикла к приложению
app.add_event_handler("startup", startup)
app.add_event_handler("shutdown", shutdown)
app.include_router(router)
