import asyncio

from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings

client: AsyncIOMotorClient | None = None


def get_db():
    assert client is not None
    return client[settings.mongo_db]


async def connect_db():
    global client
    last_error = None
    for attempt in range(3):
        try:
            client = AsyncIOMotorClient(settings.mongo_uri, serverSelectionTimeoutMS=2000)
            await client.admin.command("ping")
            return
        except Exception as exc:
            last_error = exc
            await asyncio.sleep(1)
    raise last_error


async def close_db():
    global client
    if client is not None:
        client.close()
        client = None
