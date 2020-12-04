# SimpleRecommend
SimpleRecommend is a system aimed at providing Recommendations-as-a-service through a simple to use, OpenAPI3-compliant API. As of now, it's mainly a proof of concept in progress, built using ReactJS for the front-end dashboard, Python for generating recommendations using an Item-to-item-based collaborative filtering algorithm, and Golang for the API server itself.

To generate item recommendations based on a user's historical preferences, we make use of collaborative filtering.