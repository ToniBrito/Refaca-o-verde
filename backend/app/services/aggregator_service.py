import json
import os
import asyncio
from typing import Dict, Any, List, Optional
from app.services.ibge_service import get_state_geo_info, fetch_ibge_states
from app.services.inpe_service import fetch_inpe_active_fires, get_baseline_deforestation
from app.services.climate_service import fetch_realtime_climate, get_baseline_climate
from app.core.cache import api_cache

STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "static_data")

# Carregar bases estáticas
def load_json(filename: str) -> Dict[str, Any]:
    path = os.path.join(STATIC_DIR, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

REFORESTATION_DATA = load_json("reforestation_plants.json")
DESERTIFICATION_DATA = load_json("desertification_zones.json")
BIOMES_DATA = load_json("biomes_reference.json")

def get_base_state_data(code: str) -> Optional[Dict[str, Any]]:
    """Gera instantaneamente a estrutura de dados base do estado a partir do banco local."""
    code = code.upper()
    geo_info = get_state_geo_info(code)
    biomes_info = BIOMES_DATA.get(code)
    if not biomes_info:
        return None

    desert_info = DESERTIFICATION_DATA.get(code, {})
    reforest_info = REFORESTATION_DATA.get(code, {})
    climate_info = get_baseline_climate(code)
    deforest_info = get_baseline_deforestation(code)

    return {
        "id": code,
        "name": biomes_info["name"],
        "code": code,
        "region": geo_info["region"],
        "capital": geo_info["capital"],
        "areaKm2": geo_info["areaKm2"],
        "coordinates": {"lat": geo_info["lat"], "lon": geo_info["lon"]},
        "primaryBiome": biomes_info["primaryBiome"],
        "biomes": biomes_info["biomes"],
        "climate": climate_info,
        "desertification": {
            "level": desert_info.get("level", "Baixo"),
            "score": desert_info.get("score", 20),
            "affectedArea": desert_info.get("affectedArea", "< 5%"),
            "causes": desert_info.get("causes", []),
            "riskSummary": desert_info.get("riskSummary", "Sem vulnerabilidade crítica."),
            "source": "PAN-Brasil (MMA) / Lapis-UFAL"
        },
        "deforestation": deforest_info,
        "reforestation": {
            "priorityLevel": reforest_info.get("priorityLevel", "Média"),
            "recommendedPlants": reforest_info.get("recommendedPlants", []),
            "ecologicalGuidelines": reforest_info.get("ecologicalGuidelines", []),
            "source": "Embrapa Florestas / Flora e Funga do Brasil"
        }
    }

async def get_aggregated_state_data(state_code: str) -> Optional[Dict[str, Any]]:
    """
    Agrega de forma assíncrona dados ao vivo (INPE Queimadas + Open-Meteo Clima) para o estado selecionado.
    """
    code = state_code.upper()
    base = get_base_state_data(code)
    if not base:
        return None

    # Chamadas concorrentes apenas para o estado em foco
    try:
        inpe_task = fetch_inpe_active_fires(code)
        climate_task = fetch_realtime_climate(code)
        inpe_data, climate_data = await asyncio.gather(inpe_task, climate_task)
        if inpe_data:
            base["deforestation"] = inpe_data
        if climate_data:
            base["climate"] = climate_data
    except Exception:
        pass

    return base

async def get_all_aggregated_states() -> Dict[str, Any]:
    """
    Retorna o dicionário completo de todos os 27 estados instantaneamente (< 10ms).
    """
    all_data = {}
    for code in BIOMES_DATA.keys():
        st = get_base_state_data(code)
        if st:
            all_data[st["code"]] = st
    return all_data

