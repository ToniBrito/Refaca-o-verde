import httpx
import json
import logging
import os
from typing import Dict, Any, Optional
from app.core.cache import api_cache
from app.services.ibge_service import get_state_geo_info

logger = logging.getLogger(__name__)

# Open-Meteo API pública de alta precisão para meteorologia global
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

# Carregar dados climáticos normais consolidados
STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "static_data")
CLIMATE_NORMALS_PATH = os.path.join(STATIC_DIR, "climate_normals.json")

CLIMATE_NORMALS: Dict[str, Any] = {}
if os.path.exists(CLIMATE_NORMALS_PATH):
    with open(CLIMATE_NORMALS_PATH, "r", encoding="utf-8") as f:
        CLIMATE_NORMALS = json.load(f)

def get_baseline_climate(state_code: str) -> Dict[str, Any]:
    """Retorna o perfil climático consolidado (INMET) sem fazer chamadas HTTP."""
    code = state_code.upper()
    normal = CLIMATE_NORMALS.get(code, {
        "type": "Tropical",
        "description": "Clima com estações alternadas de chuva e estiagem.",
        "avgTemp": "22°C a 27°C",
        "annualRainfall": "1.200 a 1.800 mm",
        "drySeason": "Maio a Setembro"
    })
    return {
        "type": normal["type"],
        "description": normal["description"],
        "avgTemp": normal["avgTemp"],
        "annualRainfall": normal["annualRainfall"],
        "drySeason": normal["drySeason"],
        "liveConditions": None,
        "source": "INMET Normais Climatológicas"
    }

async def fetch_realtime_climate(state_code: str) -> Dict[str, Any]:
    """
    Retorna tanto o perfil climático consolidado (INMET) quanto condições meteorológicas ao vivo (Open-Meteo).
    """
    code = state_code.upper()
    cache_key = f"climate_realtime_{code}"
    cached = api_cache.get(cache_key)
    if cached:
        return cached

    normal = CLIMATE_NORMALS.get(code, {
        "type": "Tropical",
        "description": "Clima com estações alternadas de chuva e estiagem.",
        "avgTemp": "22°C a 27°C",
        "annualRainfall": "1.200 a 1.800 mm",
        "drySeason": "Maio a Setembro"
    })

    geo_info = get_state_geo_info(code)
    current_weather: Dict[str, Any] = {}

    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            params = {
                "latitude": geo_info["lat"],
                "longitude": geo_info["lon"],
                "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m"
            }
            res = await client.get(OPEN_METEO_URL, params=params)
            if res.status_code == 200:
                cw = res.json().get("current", {})
                current_weather = {
                    "currentTemp": f"{cw.get('temperature_2m', '--')}°C",
                    "currentHumidity": f"{cw.get('relative_humidity_2m', '--')}%",
                    "currentPrecipitation": f"{cw.get('precipitation', 0)} mm",
                    "currentWindSpeed": f"{cw.get('wind_speed_10m', '--')} km/h",
                    "updatedAt": cw.get("time", "")
                }
    except Exception as e:
        logger.debug(f"Falha ao obter clima ao vivo para {code}: {e}")

    result = {
        "type": normal["type"],
        "description": normal["description"],
        "avgTemp": normal["avgTemp"],
        "annualRainfall": normal["annualRainfall"],
        "drySeason": normal["drySeason"],
        "liveConditions": current_weather if current_weather else None,
        "source": "INMET Normais Climatológicas & Open-Meteo Live API"
    }

    api_cache.set(cache_key, result, ttl_seconds=900) # 15 min
    return result
