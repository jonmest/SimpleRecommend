import psycopg2
import psycopg2.extras
import heapq
from util import convert_to_dict
import json
from Dataset import dataset_from_events
from surprise import Dataset, Reader
from surprise import KNNBasic
from surprise.model_selection import train_test_split
from collections import defaultdict
from operator import itemgetter
from KNN import KNN_ItemBased

class LoadData:
    def __init__(self, provider_id, cursor):
        print("Loading data from database...")

        cursor.execute('SELECT id FROM actors WHERE provider = %s', (provider_id,))
        actors = [r[0] for r in cursor.fetchall()]

        # Then build events list from provider
        cursor.execute("SELECT * FROM events WHERE provider = %s", (provider_id,))
        events = cursor.fetchall()
        events = convert_to_dict(cursor.description, events)

        self.actors = actors
        self.events = events

def compute (body, pool, redis):
    print("Initiate computation.")

    actor_id = body["actor"]
    provider_username = body["provider"]

    conn = pool.getconn()
    cursor = conn.cursor()

    cursor.execute('SELECT max_rating, min_rating FROM providers WHERE username = %s', (provider_username,))
    (MAX_RATING, MIN_RATING) = cursor.fetchone()
    
    d = LoadData(provider_username, cursor)

    # Load dataframe
    ds = dataset_from_events(
        d.actors, d.events,
        event_key_actor="actor", event_key_item="item",
        event_key_data="data", MIN_RATING=MIN_RATING, MAX_RATING=MAX_RATING
    )
    
    trainset = ds.build_full_trainset()

    knn = KNN_ItemBased(trainset, d.actors)
    knn.compute_similarities()
    recs = knn.get_recommendations()

    for actor_id in recs.keys():
        recommendations = [r[0] for r in recs[actor_id]]
        jsonarr = json.dumps(recommendations)
        # Store somewhere
        cursor.execute("""
        DO
        $do$
        BEGIN
            IF EXISTS (SELECT * FROM recommendations WHERE actor = %s AND provider = %s) THEN
                UPDATE recommendations
                SET items = %s
                WHERE actor = %s AND provider = %s;
            ELSE
                INSERT INTO recommendations (provider, actor, items)
                VALUES (%s, %s, %s);
            END IF;
        END
        $do$
    """, (actor_id, provider_username, jsonarr, actor_id, provider_username, provider_username, actor_id, jsonarr))

    conn.commit()
    cursor.close()
    # Delete actor's old recommendations from redis
    redis.delete('recs_{}_{}'.format(provider_username, actor_id))