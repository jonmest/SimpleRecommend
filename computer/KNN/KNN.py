import numpy as np
from  sklearn import neighbors

class KNN:
    def __init__(self, items, actors, df):
        if len(items) == 0:
            raise Exception("No items provided. At least one is required.")
        self.items = items
        self.actors = actors
        self.mdata = df
        self.distances = None
        self.indices = None
    
    def calculate_neighbours(self, k=3):
        model_knn = neighbors.NearestNeighbors(metric='cosine', algorithm='auto', n_neighbors=k).fit(self.mdata)
        self.distances, self.indices = model_knn.kneighbors(self.mdata)
    
    def get_neighbours(self, actor):
        # Index 0 is always the actor itself
        # Since they're 100% similar to themselves
        actor_i = self.actors.index(actor)
        neighbours_i = self.indices[actor_i, 1:]
        return neighbours_i

    def get_neighbour_items(self, mdata, neighbors):
        recommends = []
        for ni in neighbors:
            for ii in range(len(mdata[ni])):
                if mdata[ni, ii] == 1:
                    recommends.append(self.items[ii])
        return np.unique(recommends)

    def get_recommendations(self, actor):
        neighbours = self.get_neighbours(actor)
        recommended_items = self.get_neighbour_items(self.mdata, neighbours)
        return recommended_items