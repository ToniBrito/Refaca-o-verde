from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.services.aggregator_service import get_all_aggregated_states, get_aggregated_state_data

router = APIRouter(prefix="/api/states", tags=["Estados & Indicadores"])

@router.get("", response_model=Dict[str, Any], summary="Listar todos os 27 estados com indicadores ambientais")
async def list_states():
    """Retorna todos os 27 estados do Brasil com dados de biomas, clima, desmatamento, desertificação e reflorestamento."""
    return await get_all_aggregated_states()

@router.get("/{state_code}", response_model=Dict[str, Any], summary="Obter dados ambientais detalhados de um estado")
async def get_state_by_code(state_code: str):
    """Retorna dados de um estado específico através da sigla (ex: SP, BA, AM, RS)."""
    data = await get_aggregated_state_data(state_code)
    if not data:
        raise HTTPException(status_code=404, detail=f"Estado com a sigla '{state_code}' não encontrado.")
    return data
