import httpx
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from app.core.cache import api_cache

logger = logging.getLogger(__name__)

# Base INPE BDQueimadas - Focos de calor por satélite em tempo real
INPE_FOCOS_URL = "https://queimadas.dgi.inpe.br/queimadas/dados-abertos/api/focos"

# Referência anual PRODES/DETER consolidada por estado (km² e nível de alerta)
DEFORESTATION_BASELINE = {
    "PA": {"rateScore": 98, "level": "Crítico", "trend": "Em Queda", "alertArea": "~3.200 km²/ano", "drivers": ["Pecuária em terras públicas", "Garimpo ilegal (Tapajós/Xingu)", "Madeireiras"]},
    "RO": {"rateScore": 94, "level": "Crítico", "trend": "Em Queda", "alertArea": "~1.100 km²/ano", "drivers": ["Grilagem em TIs e UCs", "Pecuária ao longo da BR-364"]},
    "MA": {"rateScore": 92, "level": "Crítico", "trend": "Aumentando", "alertArea": "~2.200 km²/ano", "drivers": ["Agronegócio do MATOPIBA", "Exploração no oeste amazônico"]},
    "MT": {"rateScore": 90, "level": "Crítico", "trend": "Em Queda", "alertArea": "~2.000 km²/ano", "drivers": ["Agronegócio de grãos", "Incêndios no Pantanal e Cerrado"]},
    "AM": {"rateScore": 88, "level": "Crítico", "trend": "Em Queda", "alertArea": "~1.500 km²/ano", "drivers": ["Arco sul AMACRO", "Grilagem de florestas públicas"]},
    "TO": {"rateScore": 86, "level": "Crítico", "trend": "Aumentando", "alertArea": "~1.300 km²/ano", "drivers": ["Monoculturas no MATOPIBA", "Pecuária extensiva"]},
    "PI": {"rateScore": 85, "level": "Crítico", "trend": "Aumentando", "alertArea": "~1.400 km²/ano", "drivers": ["Expansão de soja nos platôs do Cerrado", "Carvoarias"]},
    "BA": {"rateScore": 84, "level": "Crítico", "trend": "Aumentando", "alertArea": "~1.800 km²/ano", "drivers": ["Fronteira agrícola no oeste baiano", "Supressão de Caatinga"]},
    "MG": {"rateScore": 78, "level": "Alto", "trend": "Estável", "alertArea": "~1.100 km²/ano", "drivers": ["Carvão vegetal siderúrgico", "Mineração", "Pecuária"]},
    "GO": {"rateScore": 76, "level": "Alto", "trend": "Estável", "alertArea": "~850 km²/ano", "drivers": ["Conversão para grãos e cana", "Pecuária"]},
    "RR": {"rateScore": 72, "level": "Alto", "trend": "Aumentando", "alertArea": "~320 km²/ano", "drivers": ["Lavouras no Lavrado", "Garimpo ilegal na Terra Yanomami"]},
    "MS": {"rateScore": 70, "level": "Alto", "trend": "Aumentando", "alertArea": "~650 km²/ano", "drivers": ["Substituição de campos pantaneiros", "Monocultura de eucalipto"]},
    "AC": {"rateScore": 68, "level": "Alto", "trend": "Em Queda", "alertArea": "~250 km²/ano", "drivers": ["Avanço pecuário na BR-364", "Madeira predatória"]},
    "PE": {"rateScore": 68, "level": "Alto", "trend": "Estável", "alertArea": "~190 km²/ano", "drivers": ["Lenha para o Polo Gesseiro", "Cana-de-açúcar"]},
    "PB": {"rateScore": 66, "level": "Alto", "trend": "Estável", "alertArea": "~110 km²/ano", "drivers": ["Consumo de lenha nativa", "Sobrepastejo caprino"]},
    "CE": {"rateScore": 65, "level": "Alto", "trend": "Estável", "alertArea": "~280 km²/ano", "drivers": ["Lenha para fornos e cerâmicas", "Pecuária extensiva"]},
    "RN": {"rateScore": 62, "level": "Alto", "trend": "Estável", "alertArea": "~90 km²/ano", "drivers": ["Lenha nativa para cerâmicas", "Parques eólicos sem reflorestamento"]},
    "RS": {"rateScore": 60, "level": "Alto", "trend": "Aumentando", "alertArea": "~350 km²/ano", "drivers": ["Soja sobre campos nativos do Pampa", "Silvicultura de exóticas"]},
    "DF": {"rateScore": 50, "level": "Moderado", "trend": "Estável", "alertArea": "~15 km²/ano", "drivers": ["Expansão urbana e loteamentos", "Chacareamento"]},
    "PR": {"rateScore": 48, "level": "Moderado", "trend": "Em Queda", "alertArea": "~120 km²/ano", "drivers": ["Pressão sobre remanescentes de Araucária", "Lavouras intensivas"]},
    "SE": {"rateScore": 46, "level": "Moderado", "trend": "Estável", "alertArea": "~35 km²/ano", "drivers": ["Pecuária leiteira no sertão", "Cana no litoral"]},
    "AL": {"rateScore": 45, "level": "Moderado", "trend": "Estável", "alertArea": "~40 km²/ano", "drivers": ["Cana histórica", "Lenha para olarias", "Pecuária"]},
    "SC": {"rateScore": 32, "level": "Baixo", "trend": "Em Queda", "alertArea": "~45 km²/ano", "drivers": ["Expansão no litoral", "Pinus invasor nos campos de altitude"]},
    "ES": {"rateScore": 28, "level": "Baixo", "trend": "Em Queda", "alertArea": "~25 km²/ano", "drivers": ["Cafeicultura em encostas", "Mineração de rochas"]},
    "RJ": {"rateScore": 24, "level": "Baixo", "trend": "Em Queda", "alertArea": "~20 km²/ano", "drivers": ["Pressão urbana em encostas", "Loteamentos costeiros"]},
    "SP": {"rateScore": 22, "level": "Baixo", "trend": "Em Queda (Ganho Líquido)", "alertArea": "~30 km²/ano", "drivers": ["Pressão urbana", "Expansão canavieira"]},
    "AP": {"rateScore": 18, "level": "Baixo", "trend": "Estável", "alertArea": "~20 km²/ano", "drivers": ["Monoculturas nos campos", "Garimpo pontual"]}
}

def get_baseline_deforestation(state_code: str) -> Dict[str, Any]:
    """Retorna dados consolidados de desmatamento sem chamadas HTTP."""
    base_info = DEFORESTATION_BASELINE.get(state_code.upper(), {
        "rateScore": 50,
        "level": "Moderado",
        "trend": "Estável",
        "alertArea": "Sob monitoramento",
        "drivers": ["Uso agropecuário"]
    })
    return {
        "level": base_info["level"],
        "rateScore": base_info["rateScore"],
        "recentTrend": base_info["trend"],
        "alertAreaKm2": base_info["alertArea"],
        "mainDrivers": base_info["drivers"],
        "activeFiresLast24h": 0,
        "source": "INPE / PRODES & DETER"
    }

async def fetch_inpe_active_fires(state_code: str) -> Dict[str, Any]:
    """
    Consulta a API de focos de queimada/satélite do INPE para o estado.
    Armazena em cache por 30 minutos.
    """
    cache_key = f"inpe_fires_{state_code.upper()}"
    cached = api_cache.get(cache_key)
    if cached:
        return cached

    base_info = DEFORESTATION_BASELINE.get(state_code.upper(), {
        "rateScore": 50,
        "level": "Moderado",
        "trend": "Estável",
        "alertArea": "Sob monitoramento",
        "drivers": ["Uso agropecuário"]
    })

    active_fires_count = 0
    try:
        # Consulta com timeout curto para não travar a aplicação
        async with httpx.AsyncClient(timeout=4.0) as client:
            params = {
                "pais_id": "33", # Brasil
                "estado_sigla": state_code.upper()
            }
            res = await client.get(INPE_FOCOS_URL, params=params)
            if res.status_code == 200:
                data = res.json()
                if isinstance(data, list):
                    active_fires_count = len(data)
                elif isinstance(data, dict) and "focos" in data:
                    active_fires_count = len(data["focos"])
    except Exception as e:
        logger.debug(f"API INPE Focos indisponível temporariamente para {state_code}: {e}")

    result = {
        "level": base_info["level"],
        "rateScore": base_info["rateScore"],
        "recentTrend": base_info["trend"],
        "alertAreaKm2": base_info["alertArea"],
        "mainDrivers": base_info["drivers"],
        "activeFiresLast24h": active_fires_count,
        "source": "INPE / DETER & BDQueimadas"
    }

    api_cache.set(cache_key, result, ttl_seconds=1800) # 30 min
    return result
