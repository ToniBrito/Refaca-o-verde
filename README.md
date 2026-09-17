# 🌿 Refaça o Verde

Plataforma interativa para monitoramento ambiental, diagnóstico ecológico de biomas, riscos de desertificação, focos de calor/desmatamento e recomendação de espécies nativas para restauração florestal em todos os estados do Brasil.

---

## 🏗️ Arquitetura do Projeto

O projeto é organizado no formato monorepo modular, separando totalmente as responsabilidades de cliente (**Frontend**) e servidor (**Backend**):

```
Refaça-o-verde/
├── backend/                  # Servidor de API REST (FastAPI / Python)
│   ├── app/
│   │   ├── core/             # Configurações globais e sistema de cache em memória
│   │   ├── routers/          # Endpoints da API (Estados, Indicadores Ambientais)
│   │   ├── services/         # Integração com APIs externas e agregação de dados
│   │   ├── static_data/      # Bases de dados locais de biomas, espécies e estados
│   │   └── main.py           # Instância principal do FastAPI, middlewares e CORS
│   └── run.py                # Script de inicialização do servidor Uvicorn
│
├── frontend/                 # Interface do Usuário (React + Vite)
│   ├── public/               # Recursos estáticos (imagens, ícones)
│   ├── src/
│   │   ├── assets/           # Imagens e mídias da aplicação
│   │   ├── components/       # Componentes React (Mapa interativo SVG, Modais, Tooltips, Detalhes)
│   │   ├── data/             # Dados e fallbacks locais estruturados
│   │   ├── services/         # Camada de comunicação com a API backend
│   │   ├── App.jsx           # Componente raiz da aplicação e controle de estado
│   │   ├── App.css           # Estilos específicos do layout
│   │   ├── index.css         # Design system, temas e animações CSS
│   │   └── main.jsx          # Ponto de entrada do React
│   ├── index.html            # Estrutura HTML principal
│   ├── package.json          # Dependências e scripts do Frontend
│   └── vite.config.js        # Configurações do Vite
│
├── .gitignore                # Regras de exclusão do Git para front e back
└── README.md                 # Documentação do projeto
```

---

### 🎨 Arquitetura do Frontend
- **Tecnologias:** React 19, Vite, Lucide Icons, CSS3 Moderno (Vanilla com Design Tokens).
- **Mapa Interativo do Brasil:** Renderização SVG vetorial estado a estado com interatividade de hover, tooltip dinâmico em tempo real e seleção de unidade federativa.
- **Camada de Serviços (`src/services/api.js`):** Gerenciador de requisições HTTP para a API FastAPI com estratégia de fallback transparente caso a API esteja offline.
- **Painéis e Modais:**
  - `StateDetails.jsx`: Exibição de biomas, espécies indicadas para reflorestamento, histórico climático e alertas de risco.
  - `InfoModal.jsx`: Modal explicativo com dados metodológicos, fontes e histórico do projeto.
  - `StateTooltip.jsx`: Tooltip posicionado sobre o cursor com resumo rápido do estado.

---

### ⚙️ Arquitetura do Backend
- **Tecnologias:** Python 3.10+, FastAPI, Uvicorn, Requests / HTTPX.
- **Camadas de Serviços (`app/services/`):**
  - `inpe_service.py`: Focos de queimadas e dados de alertas de desmatamento (INPE BDQueimadas / DETER).
  - `ibge_service.py`: Dados geográficos e divisões regionais (IBGE Localidades).
  - `climate_service.py`: Dados meteorológicos e projeções climáticas.
  - `aggregator_service.py`: Consolidação dos dados externos e bases locais com cache em memória (`app/core/cache.py`).
- **Endpoints Principais:**
  - `GET /api/health` — Status de integridade e serviços integrados.
  - `GET /api/states` — Lista resumida de todos os estados e indicadores agregados.
  - `GET /api/states/{code}` — Detalhes completos, biomas, riscos e espécies para restauração.
  - `GET /api/environment/indicators` — Indicadores ambientais consolidados.
- **Documentação Interativa:** Swagger UI (`/docs`) e ReDoc (`/redoc`) integrados nativamente.

---

## 🚀 Como Iniciar a Aplicação

### Pré-requisitos
- **Node.js** (v18 ou superior) e **npm**
- **Python** (v3.10 ou superior) e **pip**

---

### 1. Iniciar o Backend

Abra um terminal na raiz do projeto:

```bash
# Entre na pasta backend
cd backend

# (Opcional) Crie e ative um ambiente virtual
python -m venv .venv
# No Windows:
.venv\Scripts\activate
# No Linux/macOS:
# source .venv/bin/activate

# Instale as dependências
pip install fastapi uvicorn requests

# Inicie o servidor
python run.py
```

O backend estará rodando em:
- 🌐 **API Base:** `http://127.0.0.1:8000`
- 📑 **Documentação Swagger:** `http://127.0.0.1:8000/docs`

---

### 2. Iniciar o Frontend

Abra outro terminal na raiz do projeto:

```bash
# Entre na pasta frontend
cd frontend

# Instale as dependências (se for a primeira vez)
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em:
- 🌐 **Aplicação Web:** `http://localhost:5173` (ou porta indicada no terminal)

---

## 🛠️ Scripts Disponíveis

### Frontend (`frontend/`)
- `npm run dev`: Inicia o servidor de desenvolvimento do Vite com HMR.
- `npm run build`: Compila o frontend para produção (`dist/`).
- `npm run preview`: Visualiza o build de produção localmente.
- `npm run lint`: Executa a verificação com Oxlint.

### Backend (`backend/`)
- `python run.py`: Inicia o servidor FastAPI com hot-reload ativo na porta 8000.
