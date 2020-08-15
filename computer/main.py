from typing import Optional
from fastapi import FastAPI
from KNN.KNN_Engine import KNN_Engine
from models.ComputingRequest import ComputingRequest
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB = os.getenv("POSTGRES_DB")


app = FastAPI()


@app.post("/compute")
def read_item(body: ComputingRequest):
    # Get actor and provider IDs from body
    actor_id = body.actor
    provider_id = body.provider

    # Fetch provider's items, actors
    # First check if cached in redis then SQL
    items = []
    actors = []

    # Then build events list from provider
    events = []

    # Load model
    knn = KNN_Engine.KNN_Engine().calculate_neighbours()
    recommendations = knn.get_recommendations(actor_id)

    # Store recommendations in SQL
    # Delete actor's recommendations from redis
    return {"item_id": item_id, "q": q}