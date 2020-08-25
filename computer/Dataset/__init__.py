import numpy as np
import pandas as pd
from surprise import Dataset, Reader

def dataset_from_events(actors, list_of_events, event_key_actor,
                        event_key_item, event_key_data, MAX_RATING, MIN_RATING):
    df_dic = {
            "actor": np.zeros(len(list_of_events), dtype='U64'),
            "item": np.zeros(len(list_of_events), dtype='U64'),
            "rating": np.zeros(len(list_of_events))
        }
    for index, item in enumerate(list_of_events):
        try:
            df_dic["actor"][index] = item[event_key_actor]
            df_dic["item"][index] = item[event_key_item]
            df_dic["rating"][index] = item[event_key_data]
        except: continue
    df = pd.DataFrame(df_dic)

    reader = Reader(rating_scale=(MIN_RATING, MAX_RATING))
    data = Dataset.load_from_df(df, reader)
    return data