// api.js — Centralized API calls for the Churn Prediction app
const BASE_URL = 'https://customer-churn-ml-fgfh.onrender.com';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const predict = (customerData) =>
  apiFetch('/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerData),
  });

export const getDatasetInfo = () => apiFetch('/dataset-info');

export const getModelInfo = (modelName = 'LogisticRegression') => 
  apiFetch(`/model-info?model_name=${modelName}`);

export const getMetrics = () => apiFetch('/metrics');

export const getModelMetrics = (modelName) => apiFetch(`/metrics/${modelName}`);
