import pandas as pd
import numpy as np
from  sklearn import neighbors

items = ["video1", "video2", "video3", "video4", "video5", "video6", "video7","video8", "video9"]
actors = ["Jon", "Sam", "Tim", "Lorraine"]







# mtrx = np.zeros((len(actors.keys()), len(items)), dtype=int)
e1 = {
    "actor": "Jon",
    "item": "video1"
}

e2 = {
    "actor": "Jon",
    "item": "video2"
}

e3 = {
    "actor": "Jon",
    "item": "video3"
}

e4 = {
    "actor": "Jon",
    "item": "video5"
}

e5 = {
    "actor": "Sam",
    "item": "video5"
}

e6 = {
    "actor": "Tim",
    "item": "video5"
}

e7 = {
    "actor": "Tim",
    "item": "video1"
}

e8 = {
    "actor": "Lorraine",
    "item": "video1"
}

e9 = {
    "actor": "Lorraine",
    "item": "video2"
}

e10 = {
    "actor": "Lorraine",
    "item": "video6"
}
l = [e1, e2, e3, e4, e5, e6, e7, e8, e9, e10]

mtrx = KNN_Engine.from_events(actors, items, l, "actor", "item")
print(mtrx.mdata)
mtrx.calculate_neighbours()
print(mtrx.get_recommendations("Jon"))
# for i in l:
#     actor_i = actors[i["actor"]]
#     item_i = items.index(i["item"])
#     mtrx[actor_i, item_i] = 1

# model_knn = neighbors.NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=3, n_jobs=-1).fit(mtrx)
# distances, indices = model_knn.kneighbors(mtrx)

# actor = actors["Jon"]
# nn = indices[actor, 1:]
# print(mtrx)
# print(indices)

# print(nn)
# def get_neighbour_items(table, neighbors):
#     recommends = []
#     for ni in range(len(neighbors)):
#         for ii in range(len(table[ni])):
#             if table[ni, ii] == 1:
#                 recommends.append(items[ii])
#     return np.unique(recommends)

# def get_novels(old_items, new_items):
#     print(old_items)
#     print(new_items)

# recs = get_neighbour_items(mtrx, nn)
# existing = []
# for i in range(len(mtrx[actor])):
#     if mtrx[actor, i] == 1:
#         existing.append(items[i])

# recs = get_novels(existing, recs)
# print(recs)


# print(mtrx)
# print(nn)
# print(set1)

# df = pd.DataFrame(ratings_dict)
# reader = Reader(rating_scale=(0, 1))

# # Loads Pandas dataframe
# data = Dataset.load_from_df(df[["user", "item", "rating"]], reader)

# # To use item-based cosine similarity
# sim_options = {
#     "name": "pearson",
#     "min_support": 1
#     }
# algo = KNNBasic(sim_options=sim_options)

# trainingSet = data.build_full_trainset()
# algo.fit(trainingSet)
# print(algo.predict('Sam', 'video1'))