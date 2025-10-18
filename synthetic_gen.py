import pandas as pd
import numpy as np
import random

# -----------------------------
# 1. Define options and their club weights
# -----------------------------
# Format: {question: {option: {club: weight}}}
weights = {
    "Q1": {
        "A": {"Art Club": 2, "Music Club": 1, "Sports Club": 0, "Tech Club": 0},
        "B": {"Art Club": 0, "Music Club": 0, "Sports Club": 2, "Tech Club": 1},
        "C": {"Art Club": 0, "Music Club": 0, "Sports Club": 0, "Tech Club": 2},
        "D": {"Art Club": 0, "Music Club": 0, "Sports Club": 0, "Tech Club": 0},
    },
    "Q2": {
        "A": {"Art Club": 1, "Music Club": 1, "Sports Club": 0, "Tech Club": 0},
        "B": {"Art Club": 0, "Music Club": 0, "Sports Club": 2, "Tech Club": 1},
        "C": {"Art Club": 0, "Music Club": 0, "Sports Club": 0, "Tech Club": 2},
        "D": {"Art Club": 0, "Music Club": 0, "Sports Club": 0, "Tech Club": 0},
    },
    "Q3": {
        "A": {"Art Club": 2, "Music Club": 1, "Sports Club": 0, "Tech Club": 0},
        "B": {"Art Club": 0, "Music Club": 0, "Sports Club": 2, "Tech Club": 0},
        "C": {"Art Club": 0, "Music Club": 0, "Sports Club": 0, "Tech Club": 2},
        "D": {"Art Club": 0, "Music Club": 0, "Sports Club": 0, "Tech Club": 0},
    },
    "Q4": {
        "A": {"Art Club": 2, "Music Club": 1, "Sports Club": 0, "Tech Club": 0},
        "B": {"Art Club": 0, "Music Club": 0, "Sports Club": 2, "Tech Club": 0},
        "C": {"Art Club": 0, "Music Club": 0, "Sports Club": 0, "Tech Club": 2},
        "D": {"Art Club": 0, "Music Club": 0, "Sports Club": 0, "Tech Club": 0},
    },
    "Q5": {
        "A": {"Art Club": 2, "Music Club": 1, "Sports Club": 0, "Tech Club": 0},
        "B": {"Art Club": 0, "Music Club": 0, "Sports Club": 2, "Tech Club": 0},
        "C": {"Art Club": 0, "Music Club": 0, "Sports Club": 0, "Tech Club": 2},
        "D": {"Art Club": 0, "Music Club": 0, "Sports Club": 0, "Tech Club": 0},
    },
}

questions = ["Q1", "Q2", "Q3", "Q4", "Q5"]
clubs = ["Art Club", "Sports Club", "Tech Club", "Music Club"]

# -----------------------------
# 2. Generate synthetic players
# -----------------------------
data = []
num_players = 200

for _ in range(num_players):
    player = {}
    club_scores = {club: 0 for club in clubs}

    for q in questions:
        choice = random.choice(["A", "B", "C", "D"])
        player[q] = choice
        # add weights to club_scores
        for club, w in weights[q][choice].items():
            club_scores[club] += w

    # choose top club(s) as label
    top_club = max(club_scores, key=club_scores.get)
    player["Recommended_Club"] = top_club
    data.append(player)

# -----------------------------
# 3. Convert to DataFrame
# -----------------------------
df = pd.DataFrame(data)
print(df.head())

# Save to CSV if needed
df.to_csv("synthetic_club_dataset.csv", index=False)
