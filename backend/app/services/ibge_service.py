import httpx
import logging
from typing import Dict, Any, List, Optional
from app.core.cache import api_cache

logger = logging.getLogger(__name__)

IBGE_LOCALIDADES_URL = "https://servicodados.ibge.gov.br/api/v1/localidades/estados"

# Mapeamento de capitais e coordenadas geográficas de referência por estado
STATE_METADATA_FALLBACK = {
    "AC": {"capital": "Rio Branco", "lat": -9.97499, "lon": -67.8243, "areaKm2": 164123, "region": "Norte"},
    "AL": {"capital": "Maceió", "lat": -9.66599, "lon": -35.735, "areaKm2": 27843, "region": "Nordeste"},
    "AP": {"capital": "Macapá", "lat": 0.03889, "lon": -51.0664, "areaKm2": 142814, "region": "Norte"},
    "AM": {"capital": "Manaus", "lat": -3.11866, "lon": -60.0212, "areaKm2": 1559167, "region": "Norte"},
    "BA": {"capital": "Salvador", "lat": -12.9714, "lon": -38.5014, "areaKm2": 564760, "region": "Nordeste"},
    "CE": {"capital": "Fortaleza", "lat": -3.71839, "lon": -38.5434, "areaKm2": 148894, "region": "Nordeste"},
    "DF": {"capital": "Brasília", "lat": -15.7797, "lon": -47.9297, "areaKm2": 5761, "region": "Centro-Oeste"},
    "ES": {"capital": "Vitória", "lat": -20.3155, "lon": -40.3128, "areaKm2": 46074, "region": "Sudeste"},
    "GO": {"capital": "Goiânia", "lat": -16.6869, "lon": -49.2648, "areaKm2": 340126, "region": "Centro-Oeste"},
    "MA": {"capital": "São Luís", "lat": -2.53874, "lon": -44.2825, "areaKm2": 329642, "region": "Nordeste"},
    "MT": {"capital": "Cuiabá", "lat": -15.601, "lon": -56.0974, "areaKm2": 903207, "region": "Centro-Oeste"},
    "MS": {"capital": "Campo Grande", "lat": -20.4486, "lon": -54.6295, "areaKm2": 357146, "region": "Centro-Oeste"},
    "MG": {"capital": "Belo Horizonte", "lat": -19.9173, "lon": -43.9346, "areaKm2": 586528, "region": "Sudeste"},
    "PA": {"capital": "Belém", "lat": -1.4554, "lon": -48.4898, "areaKm2": 1247955, "region": "Norte"},
    "PB": {"capital": "João Pessoa", "lat": -7.11509, "lon": -34.8641, "areaKm2": 56469, "region": "Nordeste"},
    "PR": {"capital": "Curitiba", "lat": -25.4195, "lon": -49.2646, "areaKm2": 199307, "region": "Sul"},
    "PE": {"capital": "Recife", "lat": -8.05389, "lon": -34.8811, "areaKm2": 98148, "region": "Nordeste"},
    "PI": {"capital": "Teresina", "lat": -5.09194, "lon": -42.8034, "areaKm2": 251577, "region": "Nordeste"},
    "RJ": {"capital": "Rio de Janeiro", "lat": -22.9068, "lon": -43.1729, "areaKm2": 43780, "region": "Sudeste"},
    "RN": {"capital": "Natal", "lat": -5.79357, "lon": -35.1986, "areaKm2": 52811, "region": "Nordeste"},
    "RS": {"capital": "Porto Alegre", "lat": -30.0331, "lon": -51.23, "areaKm2": 281748, "region": "Sul"},
    "RO": {"capital": "Porto Velho", "lat": -8.76116, "lon": -63.9004, "areaKm2": 237591, "region": "Norte"},
    "RR": {"capital": "Boa Vista", "lat": 2.82384, "lon": -60.6753, "areaKm2": 224300, "region": "Norte"},
    "SC": {"capital": "Florianópolis", "lat": -27.5969, "lon": -48.5495, "areaKm2": 95738, "region": "Sul"},
    "SP": {"capital": "São Paulo", "lat": -23.5505, "lon": -46.6333, "areaKm2": 248219, "region": "Sudeste"},
    "SE": {"capital": "Aracaju", "lat": -10.9167, "lon": -37.05, "areaKm2": 21915, "region": "Nordeste"},
    "TO": {"capital": "Palmas", "lat": -10.1844, "lon": -48.3336, "areaKm2": 277720, "region": "Norte"}
}

async def fetch_ibge_states() -> List[Dict[str, Any]]:
    """Consulta a API oficial do IBGE para obter a lista de estados e regiões."""
    cache_key = "ibge_states_list"
    cached = api_cache.get(cache_key)
    if cached:
        return cached

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(IBGE_LOCALIDADES_URL)
            if response.status_code == 200:
                data = response.json()
                api_cache.set(cache_key, data, ttl_seconds=86400) # Cache por 24h
                return data
    except Exception as e:
        logger.warning(f"Erro ao consultar API do IBGE: {e}. Usando dados consolidados.")

    return []

def get_state_geo_info(sigla: str) -> Dict[str, Any]:
    """Retorna capital, coordenadas e área do estado."""
    return STATE_METADATA_FALLBACK.get(sigla.upper(), {
        "capital": "Capital",
        "lat": -15.0,
        "lon": -50.0,
        "areaKm2": 100000,
        "region": "Brasil"
    })
