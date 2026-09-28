"""
PocketSmart AI - Gemini Utilities Service
Handles prompt orchestration, budget formatting, domain segmentation,
and image analysis for multimodal tasks.
"""
import os
import json
import re
import urllib.parse
from typing import Optional, Dict, Any, List
from PIL import Image

def extract_json_from_response(response_text: str) -> dict:
    """Extract and parse JSON object from Gemini response text."""
    if not response_text:
        return {}
    clean_text = response_text.strip()
    try:
        return json.loads(clean_text)
    except json.JSONDecodeError:
        pass

    match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', clean_text)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            pass

    first_brace = clean_text.find('{')
    last_brace = clean_text.rfind('}')
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        try:
            return json.loads(clean_text[first_brace:last_brace + 1])
        except json.JSONDecodeError:
            pass

    return {
        "total_budget": 0.0,
        "raw_response": clean_text
    }

def usd_to_inr(amount_usd: float, exchange_rate: float = 83.0) -> float:
    """Convert USD amount to INR using the specified exchange rate"""
    return amount_usd * exchange_rate
