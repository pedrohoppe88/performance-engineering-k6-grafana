import asyncio
import random
import uuid
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Orders Checkout SUT API", version="1.0.0")


class CheckoutRequest(BaseModel):
    user_id: int
    items: list[str]
    total_amount: float


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/orders/checkout")
async def checkout(order: CheckoutRequest):
    await asyncio.sleep(random.uniform(0.02, 0.06))

    return {
        "status": "approved",
        "order_id": str(uuid.uuid4()),
        "user_id": order.user_id,
        "items_count": len(order.items),
        "total_amount": order.total_amount,
    }
