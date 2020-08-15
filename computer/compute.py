import psycopg2
import psycopg2.extras
from KNN.KNN_Engine import KNN_Engine
from util import convert_to_dict
import json

def compute (body, pool, redis):
    # Get actor and provider IDs from body
    print("Initiate computation.")
    actor_id = body["actor"]
    provider_id = body["provider"]

    conn = pool.getconn()
    cursor = conn.cursor()
    
    # Fetch provider's items, actors
    cursor.execute('SELECT id FROM items WHERE provider = %s', (provider_id,))
    items = [r[0] for r in cursor.fetchall()]

    cursor.execute('SELECT id FROM actors WHERE provider = %s', (provider_id,))
    actors = [r[0] for r in cursor.fetchall()]

    # Then build events list from provider
    cursor.execute("SELECT * FROM events WHERE provider = %s", (provider_id,))
    events = cursor.fetchall()
    events = convert_to_dict(cursor.description, events)

    # Load model
    knn = KNN_Engine.from_events(
        actors, items, events,
        event_key_actor="actor", event_key_item="item"
    )
    knn.calculate_neighbours()

    recommendations = knn.get_recommendations(actor_id).tolist()
    recommendation_string = json.dumps(recommendations)

    # Store recommendations in SQL
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
    """, (actor_id, provider_id, recommendation_string, actor_id, provider_id, provider_id, actor_id, recommendation_string))
    
    # Delete actor's old recommendations from redis
    redis.delete('recs_{}_{}'.format(provider_id, actor_id))