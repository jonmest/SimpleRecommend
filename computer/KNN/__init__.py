import numpy as np
from  sklearn import neighbors
from surprise import Dataset, Reader
from surprise import KNNBasic
import statistics

import heapq
from collections import defaultdict
from operator import itemgetter

class KNN_ItemBased:
    def __init__(self, dataset, actors):
        if len(actors) == 0:
            raise Exception("No actors provided. At least one is required.")

        self.actors = actors
        self.dataset = dataset
        self.recommendations = {}
        self.sims_matrix = None
    
    def compute_similarities(self, sim_options= {'name': 'cosine', 'user_based': False }):
        model = KNNBasic(sim_options=sim_options)
        model.fit(self.dataset)
        self.sims_matrix = model.compute_similarities()

    def get_recommendations(self, top_k=30):
        for actor in self.actors:
            self.recommendations[actor] = []
            actor_inner_id = self.dataset.to_inner_uid(actor)
            actor_ratings = self.dataset.ur[actor_inner_id]
            ratings_data =  [r[1] for r in actor_ratings]

            try:
                mean_rating = statistics.mean(ratings_data)
                max_rating = max(ratings_data)
                std = statistics.stdev(ratings_data)
                criteria = mean_rating + 1 * std #Has be be at least 1 std above mean
                k_neighbours = []

                for rating in actor_ratings:
                    if rating[1] > criteria:
                        k_neighbours.append(rating)
                
                # Get similar items to stuff we liked (weighted by rating)
                candidates = defaultdict(float)
                for itemID, rating in k_neighbours:
                    similarity_row = self.sims_matrix[itemID]
                    for innerID, score in enumerate(similarity_row):
                        candidates[innerID] += score * (rating / max_rating)

                # Build a dictionary of stuff the user has already seen
                old = {}
                for itemID, rating in self.dataset.ur[actor_inner_id]:
                    old[itemID] = 1

                # Get top-rated items from similar users:
                pos = 0
                for itemID, ratingSum in sorted(candidates.items(), key=itemgetter(1), reverse=True):
                    if not itemID in old:
                        real_item_id = self.dataset.to_raw_iid(itemID)
                        self.recommendations[actor].append((real_item_id, ratingSum))
                        pos += 1
                        if (pos > top_k):
                            break
            except:
                continue
        return self.recommendations