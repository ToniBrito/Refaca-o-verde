from fastapi import APIRouter
from typing import Dict, Any
from app.services.aggregator_service import REFORESTATION_DATA, DESERTIFICATION_DATA

router = APIRouter(prefix="/api/environment", tags=["Meio Ambiente & Reflorestamento"])

@router.get("/plants", summary="Catálogo botânico de plantas para reflorestamento por estado")
async def get_reforestation_catalog():
    """Retorna o catálogo completo de espécies nativas recomendadas para restauração florestal."""
    return REFORESTATION_DATA

@router.get("/desertification", summary="Zonas e núcleos de desertificação no Brasil")
async def get_desertification_zones():
    """Retorna o mapeamento dos polos e níveis de vulnerabilidade à desertificação."""
    return DESERTIFICATION_DATA
