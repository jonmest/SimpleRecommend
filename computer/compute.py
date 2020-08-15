import psycopg2
from KNN import KNN_Engine

def compute (body, pool, redis):
    # Get actor and provider IDs from body
    actor_id = body.actor
    provider_id = body.provider

    pool.getconn()
    cursor = pool.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Fetch provider's items, actors
    items = cursor.execute("SELECT id FROM items WHERE provider = %s", provider_id).fetchall()
    actors = cursor.execute("SELECT id FROM actors WHERE provider = %s", provider_id).fetchall()

    # Then build events list from provider
    events = cursor.execute("SELECT * FROM events WHERE provider = %s", provider_id).fetchall()

    # Load model
    knn = KNN_Engine.from_events(
        actors, items, events,
        event_key_actor="actor", event_key_item="item"
    ).calculate_neighbours()

    recommendations = knn.get_recommendations(actor_id)

    # Store recommendations in SQL
    cursor.execute("""
        DO
        $do$
        BEGIN
            IF EXISTS (SELECT * FROM recommendations WHERE actor = %s AND provider = %s) THEN
                UPDATE recommendations
                SET recommendations = %s
                WHERE actor = %s AND provider = %s;
            ELSE
                INSERT INTO recommendations (provider, actor, recommendations)
                VALUES (%s, %s, %s)
            END IF;
        END
        $do$
    """, actor_id, provider_id, recommendations, actor_id, provider_id, provider_id, actor_id, recommendations)
    
    # Delete actor's old recommendations from redis
    redis.delete('recs_{}_{}'.format(provider_id, actor_id))