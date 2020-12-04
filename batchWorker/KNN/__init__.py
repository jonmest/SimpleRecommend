import numpy as np
from  sklearn import neighbors
from surprise import Dataset, Reader
from surprise import KNNBasic
import statistics
from surprise.model_selection import cross_validate
import heapq
from collections import defaultdict
from operator import itemgetter

class KNN_ItemBased:
    def __init__(self, dataset, actors):
        if len(actors) == 0:
            raise Exception("No actors provided. At least one is required.")
        
        self.trainset = dataset.build_full_trainset()
        self.actors = actors
        self.dataset = dataset
        self.recommendations = {}
        self.sims_matrix = None
        self.model = None
    
    def compute_similarities(self, sim_options= {'name': 'cosine', 'user_based': False }):
        self.model = KNNBasic(sim_options=sim_options)
        self.model.fit(self.trainset)
        self.sims_matrix = self.model.compute_similarities()

    def get_error(self):
        result = {}
        e = cross_validate(self.model, self.dataset, measures=['RMSE', 'MAE', 'FCP'], cv=3, verbose=False)
        result["mean_rmse"] = np.mean(e["test_rmse"])
        result["mean_mae"] = np.mean(e["test_mae"])
        result["mean_fcp"] = np.mean(e["test_fcp"])

        result["std_rmse"] = np.std(e["test_rmse"])
        result["std_mae"] = np.std(e["test_mae"])
        result["std_fcp"] = np.std(e["test_fcp"])
        return result

    def get_recommendations(self, top_k=30):
        for actor in self.actors:
            try:
                self.recommendations[actor] = []
                actor_inner_id = self.trainset.to_inner_uid(actor)
                actor_ratings = self.trainset.ur[actor_inner_id]
                ratings_data =  [r[1] for r in actor_ratings]
            except:
                continue

            try:
                mean_rating = statistics.mean(ratings_data)
                max_rating = max(ratings_data)
                criteria = mean_rating 
                k_neighbours = []
                for rating in actor_ratings:
                    print(rating)
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
                for itemID, rating in self.trainset.ur[actor_inner_id]:
                    old[itemID] = 1

                # Get top-rated items from similar users:
                pos = 0
                for itemID, ratingSum in sorted(candidates.items(), key=itemgetter(1), reverse=True):
                    if not itemID in old:
                        real_item_id = self.trainset.to_raw_iid(itemID)
                        self.recommendations[actor].append((real_item_id, ratingSum))
                        pos += 1
                        if (pos > top_k):
                            break
                print("Actor: ", actor, " - ", self.recommendations[actor])
            except:
                continue
        return self.recommendations