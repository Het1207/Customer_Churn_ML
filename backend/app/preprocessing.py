"""
preprocessing.py — Mirrors EDA.ipynb pipeline exactly.
Converts raw CustomerInput → scaled feature vector aligned to train_columns.pkl
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder

from app.schemas import CustomerInput
from app import model as mdl


# Label-encode mapping (binary Yes/No → 1/0, Male/Female → 1/0)
# LabelEncoder alphabetical order: Female=0 Male=1 / No=0 Yes=1
LABEL_MAP = {
    "gender":          {"Female": 0, "Male": 1},
    "Partner":         {"No": 0, "Yes": 1},
    "Dependents":      {"No": 0, "Yes": 1},
    "PhoneService":    {"No": 0, "Yes": 1},
    "PaperlessBilling":{"No": 0, "Yes": 1},
}

ONEHOT_COLS = [
    "MultipleLines", "InternetService", "OnlineSecurity", "OnlineBackup",
    "DeviceProtection", "TechSupport", "StreamingTV", "StreamingMovies",
    "PaymentMethod", "Contract",
]


def preprocess(inp: CustomerInput) -> np.ndarray:
    """
    Returns a (1, 30) numpy array ready for model.predict().
    Raises ValueError if an unknown category is passed.
    """
    # 1. Build raw row dict
    raw = {
        "gender":          inp.gender,
        "SeniorCitizen":   inp.SeniorCitizen,
        "Partner":         inp.Partner,
        "Dependents":      inp.Dependents,
        "tenure":          inp.tenure,
        "PhoneService":    inp.PhoneService,
        "PaperlessBilling": inp.PaperlessBilling,
        "MonthlyCharges":  inp.MonthlyCharges,
        "TotalCharges":    inp.TotalCharges,
        "MultipleLines":   inp.MultipleLines,
        "InternetService": inp.InternetService,
        "OnlineSecurity":  inp.OnlineSecurity,
        "OnlineBackup":    inp.OnlineBackup,
        "DeviceProtection": inp.DeviceProtection,
        "TechSupport":     inp.TechSupport,
        "StreamingTV":     inp.StreamingTV,
        "StreamingMovies": inp.StreamingMovies,
        "PaymentMethod":   inp.PaymentMethod,
        "Contract":        inp.Contract,
    }
    df = pd.DataFrame([raw])

    # 2. Label-encode binary columns
    for col, mapping in LABEL_MAP.items():
        val = df.at[0, col]
        if val not in mapping:
            raise ValueError(f"Unknown value '{val}' for '{col}'. Expected: {list(mapping.keys())}")
        df[col] = mapping[val]

    # 3. One-hot encode multi-category columns (drop_first=True)
    df = pd.get_dummies(df, columns=ONEHOT_COLS, drop_first=True)

    # 4. Align columns to training schema (fills missing OHE columns with 0)
    df = df.reindex(columns=mdl.train_cols, fill_value=0)

    # 5. Scale the three numeric columns using the fitted scaler
    df[mdl.NUMERICAL_COLS] = mdl.scaler.transform(df[mdl.NUMERICAL_COLS])

    return df.values.astype(np.float64)
