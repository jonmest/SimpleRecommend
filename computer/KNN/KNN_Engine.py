from KNN import KNN
import numpy as np

class KNN_Engine(KNN):
    def __init__(self, items, actors, mdata):
        super().__init__(items, actors, mdata)
    
    @staticmethod
    def from_events(actors:list, items:list,
    list_of_events, event_key_actor, event_key_item):
        mdata = np.zeros((len(actors), len(items)))
        for i in list_of_events:
            actor_i = actors.index(i[event_key_actor])
            item_i = items.index(i[event_key_item])
            mdata[actor_i, item_i] = 1
        return KNN_Engine(items, actors, mdata)

