import httpx
import os
import json
from datetime import date

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"


def calculate_age(dob_str: str) -> int:
    """Calculate age from date of birth string."""
    try:
        dob = date.fromisoformat(dob_str)
        today = date.today()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        return age
    except Exception:
        return 0


def rule_based_prediction(glucose: float, haemoglobin: float, cholesterol: float, age: int) -> str:
    """
    Fallback rule-based prediction when AI API is unavailable.
    Based on standard medical reference ranges.
    """
    risks = []
    recommendations = []

    # Glucose analysis (mg/dL)
    if glucose < 70:
        risks.append("Hypoglycemia (Low Blood Sugar)")
        recommendations.append("Consult a doctor immediately for low blood sugar management")
    elif 100 <= glucose < 126:
        risks.append("Pre-diabetes risk (Impaired Fasting Glucose)")
        recommendations.append("Adopt a low-sugar diet and increase physical activity")
    elif glucose >= 126:
        risks.append("Possible Diabetes Mellitus (High Blood Sugar)")
        recommendations.append("Urgent medical consultation required; monitor blood sugar regularly")

    # Haemoglobin analysis (g/dL)
    # Normal: Men 13.5–17.5, Women 12.0–15.5
    if haemoglobin < 12.0:
        risks.append("Anaemia (Low Haemoglobin)")
        recommendations.append("Increase iron-rich foods; consider iron supplementation under medical supervision")
    elif haemoglobin > 17.5:
        risks.append("Polycythaemia risk (High Haemoglobin)")
        recommendations.append("Further evaluation recommended for elevated haemoglobin levels")

    # Cholesterol analysis (mg/dL)
    if cholesterol >= 240:
        risks.append("High Cholesterol (Hypercholesterolaemia)")
        recommendations.append("Follow a heart-healthy diet; consider statin therapy consultation")
    elif 200 <= cholesterol < 240:
        risks.append("Borderline High Cholesterol")
        recommendations.append("Reduce saturated fat intake and increase aerobic exercise")

    # Age-based risk additions
    if age >= 60 and cholesterol >= 200:
        recommendations.append("Cardiovascular screening recommended due to age and cholesterol levels")

    if not risks:
        status = "✅ All blood test values appear within normal reference ranges."
        summary = (
            f"{status} Glucose: {glucose} mg/dL (Normal: 70–99), "
            f"Haemoglobin: {haemoglobin} g/dL (Normal: 12–17.5), "
            f"Cholesterol: {cholesterol} mg/dL (Normal: <200). "
            "Maintain a healthy lifestyle with regular check-ups."
        )
    else:
        risk_str = ", ".join(risks)
        rec_str = " | ".join(recommendations)
        summary = (
            f"⚠️ Potential health risks identified: {risk_str}. "
            f"Recommendations: {rec_str}. "
            "Please consult a qualified healthcare professional for proper diagnosis and treatment."
        )

    return summary


async def get_health_prediction(
    full_name: str,
    date_of_birth: str,
    glucose: float,
    haemoglobin: float,
    cholesterol: float,
) -> str:
    """
    Get AI-powered health prediction using Anthropic Claude API.
    Falls back to rule-based prediction if API is unavailable.
    """
    age = calculate_age(date_of_birth)

    if not ANTHROPIC_API_KEY:
        return rule_based_prediction(glucose, haemoglobin, cholesterol, age)

    prompt = f"""You are a clinical health analyst assistant. Analyze the following patient blood test results and provide a concise, professional health assessment.

Patient Information:
- Name: {full_name}
- Age: {age} years
- Glucose: {glucose} mg/dL (Normal fasting: 70-99 mg/dL)
- Haemoglobin: {haemoglobin} g/dL (Normal: Men 13.5-17.5, Women 12.0-15.5 g/dL)
- Cholesterol: {cholesterol} mg/dL (Desirable: <200, Borderline: 200-239, High: ≥240 mg/dL)

Please provide:
1. A brief assessment of each blood marker (normal/abnormal)
2. Any potential health risks or conditions suggested by these values
3. Key lifestyle or medical recommendations
4. An overall health status summary

Keep the response concise (3-5 sentences), professional, and clear. Start with the overall status (✅ Normal or ⚠️ Attention Required), then list findings. Always remind the patient to consult a healthcare professional."""

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                ANTHROPIC_API_URL,
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 300,
                    "messages": [{"role": "user", "content": prompt}],
                },
            )

            if response.status_code == 200:
                data = response.json()
                content = data.get("content", [])
                if content and content[0].get("type") == "text":
                    return content[0]["text"].strip()

            # If API call fails, use rule-based fallback
            return rule_based_prediction(glucose, haemoglobin, cholesterol, age)

    except Exception as e:
        # Graceful fallback
        return rule_based_prediction(glucose, haemoglobin, cholesterol, age)
