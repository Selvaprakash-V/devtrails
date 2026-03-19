import numpy as np

def detect_fraud_ml(features):
    """
    ML-based fraud detection (placeholder for future enhancement)
    Features: [claim_frequency, location_variance, speed_anomaly, time_pattern]
    """
    fraud_score = 0
    
    if features.get('claim_frequency', 0) > 5:
        fraud_score += 30
    
    if features.get('location_variance', 0) > 100:
        fraud_score += 25
    
    if features.get('speed_anomaly', 0) > 120:
        fraud_score += 35
    
    if features.get('time_pattern_score', 0) > 0.7:
        fraud_score += 10
    
    return {
        'fraud_score': min(fraud_score, 100),
        'is_fraudulent': fraud_score > 60
    }
