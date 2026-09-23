"""
model.py — Loads all PKLs at startup; exposes predict helpers
"""
import os
import joblib
import numpy as np

_BASE = os.path.join(os.path.dirname(__file__), "..", "artifacts")


def _load(name: str):
    return joblib.load(os.path.join(_BASE, name))


# Models dictionary — all 7 models trained in the notebook, keyed to match
# metrics.json / dataset_info.json so the frontend can pass the same name
# to /predict, /model-info, and /metrics/{model_name} without translation.
models = {
    "LogisticRegression": _load("model.pkl"),
    "RandomForest":       _load("model_randomforest.pkl"),
    "DecisionTree":       _load("model_decisiontree.pkl"),
    "KNN":                _load("model_knn.pkl"),
    "AdaBoost":           _load("model_adaboost.pkl"),
    "GradientBoosting":   _load("model_gradientboosting.pkl"),
    "XGBoost":            _load("model_xgboost.pkl"),
}

scaler      = _load("scaler.pkl")
train_cols  = _load("train_columns.pkl")   # list[str], 30 features

NUMERICAL_COLS = ["tenure", "MonthlyCharges", "TotalCharges"]

MODEL_NAME = "LogisticRegression"  # the production/default model (is_active in metrics.json)


def predict(X: np.ndarray, model_name: str = "LogisticRegression"):
    """Returns (label_str, probability_float, actual_model_name)."""
    if model_name not in models:
        model_name = "LogisticRegression"
    clf = models[model_name]

    prob = float(clf.predict_proba(X)[0][1])
    label = "Yes" if prob >= 0.5 else "No"
    return label, prob, model_name