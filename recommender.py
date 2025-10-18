import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib


data = pd.read_csv('synthetic_club_dataset.csv')

label_encoders = {}
for col in ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col])
    label_encoders[col] = le  # save encoder for each question

# Encode target club
club_encoder = LabelEncoder()
data['Club'] = club_encoder.fit_transform(data['Recommended_Club'])

X = data[['Q1', 'Q2', 'Q3', 'Q4', 'Q5']]
y = data['Club']


X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)


param_grid = {
    'max_depth': [5, 7, 9, 11],
    'criterion': ['gini', 'entropy'],
    'min_samples_split': [2, 5, 10]
}

grid = GridSearchCV(DecisionTreeClassifier(random_state=42),
                    param_grid,
                    cv=5,
                    scoring='accuracy')

grid.fit(X_train, y_train)

clf = grid.best_estimator_
print(f" Best Parameters: {grid.best_params_}")


y_pred = clf.predict(X_test)
print("\n📊 Model Evaluation:")
print("Accuracy:", round(accuracy_score(y_test, y_pred), 2))
print(classification_report(y_test, y_pred, target_names=club_encoder.classes_))


example = ['A', 'B', 'C', 'D', 'B']
encoded_example = [
    label_encoders[f'Q{i+1}'].transform([example[i]])[0] for i in range(5)
]

new_player = pd.DataFrame([encoded_example], columns=['Q1', 'Q2', 'Q3', 'Q4', 'Q5'])
predicted = clf.predict(new_player)
recommended_club = club_encoder.inverse_transform(predicted)[0]

print(f"\n Recommended Club: {recommended_club}")

joblib.dump(clf, 'club_recommender.pkl')
joblib.dump(label_encoders, 'label_encoders.pkl')
joblib.dump(club_encoder, 'club_encoder.pkl')
print("\nModel and encoders saved!")

new_player = pd.DataFrame([[0,1,2,3,1]], columns=['Q1','Q2','Q3','Q4','Q5']) 
predicted_club = club_encoder.inverse_transform(clf.predict(new_player)) 
print("Recommended Club:", predicted_club[0])