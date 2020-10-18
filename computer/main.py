import psycopg2
import os
from psycopg2 import pool
from dotenv import load_dotenv
import json
import logging
from compute import compute
from datetime import datetime
import multiprocessing as mp
import traceback

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s [in %(pathname)s:%(lineno)d]')
logging.warning('This will get logged to a file')

load_dotenv()

POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
PASSWORD_PORT = os.getenv("POSTGRES_PORT")
POSTGRES_DB = os.getenv("POSTGRES_DB")


def start_compute(task):
    try:
        fork_pool = psycopg2.pool.SimpleConnectionPool(1, 5,
                                                       user=POSTGRES_USER,
                                                       password=POSTGRES_PASSWORD,
                                                       host=POSTGRES_HOST,
                                                       port=PASSWORD_PORT,
                                                       database=POSTGRES_DB)
        compute(json.loads(task), fork_pool, fork_r)
        logging.info("Successfully computed task: {}".format(
            datetime.now().strftime("%H:%M:%S")))
    except Exception as e:
        logging.error(task)
        logging.error(e)
        track = traceback.format_exc()
        print(track)


def main():
    pool = mp.Pool()

    while True:
        print("Working...")
        task = r.blpop(TASK_LIST_KEY)[1]
        task = task.decode("utf-8")
        if not task:
            continue
        pool.map(start_compute, (task,))


if __name__ == '__main__':
    main()
