import psycopg2
import os
from psycopg2 import pool
from dotenv import load_dotenv
import redis
import json
import logging
from compute import compute
from datetime import datetime

logging.basicConfig(filename='app.log', filemode='w', format='%(name)s - %(levelname)s - %(message)s')
logging.warning('This will get logged to a file')

load_dotenv()

POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
PASSWORD_PORT = os.getenv("POSTGRES_PORT")
POSTGRES_DB = os.getenv("POSTGRES_DB")

REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = os.getenv("REDIS_PORT")

postgreSQL_pool = psycopg2.pool.SimpleConnectionPool(1, 20,
                            user=POSTGRES_USER,
                            password = POSTGRES_PASSWORD,
                            host=POSTGRES_HOST,
                            port=PASSWORD_PORT,
                            database=POSTGRES_DB)

TASK_LIST_KEY = "compute_task_queue"
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)

run = True

while run:
    task = r.blpop(TASK_LIST_KEY)
    if not task: continue
    
    try:
        compute(json.loads(task), postgreSQL_pool, r)
        logging.info("Successfully computed task: {}".format(datetime.now().strftime("%H:%M:%S")))
    except Exception as e:
        logging.error(e)
