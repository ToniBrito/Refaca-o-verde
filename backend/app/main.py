from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import states, environment

app = FastAPI(
    title="Refaça o Verde API",
    description="API REST de monitoramento ecológico, biomas, desertificação, desmatamento (INPE) e espécies para reflorestamento em todos os estados do Brasil.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Habilitar CORS para permitir chamadas do frontend React (Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar roteadores
app.include_router(states.router)
app.include_router(environment.router)

@app.get("/api/health", tags=["Status"])
async def health_check():
    return {
        "status": "healthy",
        "service": "Refaça o Verde API",
        "version": "1.0.0",
        "integratedApis": ["IBGE Localidades", "INPE BDQueimadas / DETER", "Open-Meteo Weather", "Embrapa Florestas"]
    }
