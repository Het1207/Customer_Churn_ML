"""
schemas.py — Pydantic v2 request/response models
"""
from pydantic import BaseModel, Field
from typing import Any


# ── Request ───────────────────────────────────────────────────────────────────
class CustomerInput(BaseModel):
    gender: str = Field(..., examples=["Male"])
    SeniorCitizen: int = Field(..., examples=[0])
    Partner: str = Field(..., examples=["Yes"])
    Dependents: str = Field(..., examples=["No"])
    tenure: float = Field(..., examples=[12])
    PhoneService: str = Field(..., examples=["Yes"])
    MultipleLines: str = Field(..., examples=["No"])
    InternetService: str = Field(..., examples=["Fiber optic"])
    OnlineSecurity: str = Field(..., examples=["No"])
    OnlineBackup: str = Field(..., examples=["Yes"])
    DeviceProtection: str = Field(..., examples=["No"])
    TechSupport: str = Field(..., examples=["No"])
    StreamingTV: str = Field(..., examples=["No"])
    StreamingMovies: str = Field(..., examples=["No"])
    Contract: str = Field(..., examples=["Month-to-month"])
    PaperlessBilling: str = Field(..., examples=["Yes"])
    PaymentMethod: str = Field(..., examples=["Electronic check"])
    MonthlyCharges: float = Field(..., examples=[70.35])
    TotalCharges: float = Field(..., examples=[844.2])
    model_name: str = Field("LogisticRegression", description="Name of the model to use for prediction")


# ── Responses ─────────────────────────────────────────────────────────────────
class PredictionResponse(BaseModel):
    churn_label: str
    churn_probability: float
    model_used: str


class ModelInfoResponse(BaseModel):
    algorithm: str
    params: dict[str, Any]
    label_encoded_cols: list[str]
    onehot_cols: list[str]
    scaled_cols: list[str]
    description: str
