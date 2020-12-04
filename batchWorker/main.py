import os
import json
import redis
import logging
import psycopg2
import traceback
from psycopg2 import pool
from compute import compute
import multiprocessing as mp
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s [in %(pathname)s:%(lineno)d]')
logging.warning('This will get logged to a file')

POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
PASSWORD_PORT = os.getenv("POSTGRES_PORT")
POSTGRES_DB = os.getenv("POSTGRES_DB")
REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = os.getenv("REDIS_PORT")
TASK_LIST_KEY = "task"


def start_job(task):
    try:
        fork_pool = psycopg2.pool.SimpleConnectionPool(1, 5,
                                                       user=POSTGRES_USER,
                                                       password=POSTGRES_PASSWORD,
                                                       host=POSTGRES_HOST,
                                                       port=PASSWORD_PORT,
                                                       database=POSTGRES_DB)
        compute(json.loads(task), fork_pool)
        logging.info("Successfully computed task: {}".format(
            datetime.now().strftime("%H:%M:%S")))

    except Exception as e:
        logging.error(task)
        logging.error(e)
        track = traceback.format_exc()
        print(track)


def main():
    pool = mp.Pool()

    try:
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)
    except:
        logging.error("Failed to connect with Redis.")

    while True:
        task = r.blpop(TASK_LIST_KEY)[1]
        task = task.decode("utf-8")
        if not task:
            continue
        pool.map(start_job, (task,))


if __name__ == '__main__':
    main()
