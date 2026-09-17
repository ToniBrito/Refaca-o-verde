import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import BrazilMap from './components/BrazilMap';
import StateDetails from './components/StateDetails';
import StateTooltip from './components/StateTooltip';
import InfoModal from './components/InfoModal';
import { fetchAllStatesFromBackend, fetchStateDetails, checkApiHealth } from './services/api';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  Leaf, 
  Trees, 
  Layers, 
  Flame, 
  Info, 
  Droplets,
  AlertTriangle,
  Radio,
  Server,
  Loader2
} from 'lucide-react';

export default function App() {
  // Estado dos dados (carregados dinamicamente via FastAPI)
  const [statesData, setStatesData] = useState({});
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoadingBackend, setIsLoadingBackend] = useState(true);

  // Estado selecionado para visualização no painel
  const [selectedState, setSelectedState] = useState(null);
  
  // Estado sob hover para o tooltip rápido
  const [hoveredState, setHoveredState] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);

  // Modo de visualização do mapa
  const [viewMode, setViewMode] = useState('biome'); // 'biome' | 'desertification' | 'deforestation' | 'reforestation'
  
  // Filtro de região
  const [currentRegion, setCurrentRegion] = useState('Todos');

  // Modal ativo ('about' | 'orgs' | 'faq' | null)
  const [activeModal, setActiveModal] = useState(null);

  // Busca textual de estado
  const [searchQuery, setSearchQuery] = useState('');

  // Carregar dados dinâmicos do backend FastAPI ao montar o componente
  useEffect(() => {
    async function loadData() {
      setIsLoadingBackend(true);
      const isHealthy = await checkApiHealth();
      if (isHealthy) {
        setIsBackendConnected(true);
        const data = await fetchAllStatesFromBackend();
        if (data && Object.keys(data).length > 0) {
          setStatesData(data);
          const initialCode = data['CE'] ? 'CE' : data['SP'] ? 'SP' : Object.keys(data)[0];
          setSelectedState(data[initialCode]);
          // Carregar enriquecimento ao vivo para o estado inicial
          fetchStateDetails(initialCode).then((liveData) => {
            if (liveData) {
              setStatesData((prev) => ({ ...prev, [initialCode]: liveData }));
              setSelectedState((prev) => (prev?.code === initialCode ? liveData : prev));
            }
          });
        }
      } else {
        setIsBackendConnected(false);
      }
      setIsLoadingBackend(false);
    }
    loadData();
  }, []);

  // Filtragem de lista de estados para busca rápida
  const filteredStatesList = useMemo(() => {
    return Object.values(statesData).filter((s) => {
      const matchRegion = currentRegion === 'Todos' || s.region === currentRegion;
      const matchQuery = (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (s.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (s.primaryBiome || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchQuery;
    });
  }, [statesData, currentRegion, searchQuery]);

  const handleHoverState = (stateData, pos) => {
    const currentData = stateData ? statesData[stateData.code] || stateData : null;
    setHoveredState(currentData);
    setTooltipPos(pos);
  };

  const handleSelectState = useCallback(async (stateData) => {
    if (!stateData) {
      setSelectedState(null);
      return;
    }
    const code = stateData.code;
    const currentData = statesData[code] || stateData;
    setSelectedState(currentData);

    // Se ainda não tiver os dados meteorológicos ao vivo gravados, busca sob demanda
    if (!currentData.climate?.liveConditions) {
      const liveData = await fetchStateDetails(code);
      if (liveData) {
        setStatesData((prev) => ({ ...prev, [code]: liveData }));
        setSelectedState((prev) => (prev?.code === code ? liveData : prev));
      }
    }
  }, [statesData]);

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Header 
        onOpenModal={setActiveModal}
        activeModal={activeModal}
      />

      {/* Main Grid Container */}
      <main className="main-content-grid">
        {/* Coluna Esquerda / Centro: Mapa e Controles */}
        <section className="map-section-wrapper">
          {/* Status da Conexão com o Backend FastAPI */}
          <div className="api-status-banner">
            <div className="status-indicator">
              <span className={`status-dot ${isBackendConnected ? 'online' : 'offline'}`}></span>
              <Server size={15} />
              <span className="status-text">
                {isLoadingBackend ? (
                  <>Carregando dados das APIs ambientais...</>
                ) : isBackendConnected ? (
                  <>FastAPI Conectado: Consumindo dados ao vivo do INPE, IBGE e Open-Meteo</>
                ) : (
                  <>Aguardando conexão com o servidor backend FastAPI (http://127.0.0.1:8000)...</>
                )}
              </span>
            </div>
            {isBackendConnected && (
              <span className="live-tag">
                <Radio size={12} className="pulse-icon" /> AO VIVO
              </span>
            )}
          </div>

          {/* Filtro Rápido por Região (Reposicionado abaixo do FastAPI Status) */}
          <div className="region-filter-bar">
            <span className="region-label">Filtrar por Região:</span>
            <div className="region-pills">
              {['Todos', 'Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'].map((region) => (
                <button
                  key={region}
                  className={`region-pill ${currentRegion === region ? 'active' : ''}`}
                  onClick={() => setCurrentRegion(region)}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Barra de Busca e Atalhos de Seleção */}
          <div className="search-and-selector-bar">
            <div className="search-input-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar estado, bioma ou sigla (ex: Bahia, Amazônia, SP)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn" 
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </button>
              )}
            </div>

            {/* Chips de estados filtrados */}
            <div className="quick-state-chips">
              {filteredStatesList.slice(0, 10).map((st) => (
                <button
                  key={st.code}
                  className={`state-chip ${selectedState?.code === st.code ? 'active' : ''}`}
                  onClick={() => setSelectedState(st)}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleHoverState(st, { x: rect.left + rect.width / 2, y: rect.top - 10 });
                  }}
                  onMouseLeave={() => handleHoverState(null, null)}
                >
                  <span className="chip-code">{st.code}</span>
                  <span className="chip-name">{st.name}</span>
                </button>
              ))}
              {filteredStatesList.length > 10 && (
                <span className="more-states-tag">+{filteredStatesList.length - 10} estados</span>
              )}
            </div>
          </div>

          {/* Interactive Brazil Map */}
          <div className="map-frame-card">
            <div className="map-card-header">
              <div className="map-badge-status">
                <MapPin size={16} className="text-emerald" />
                <span>
                  {selectedState ? `Estado em Foco: ${selectedState.name} (${selectedState.code})` : 'Passe o mouse sobre o mapa'}
                </span>
              </div>
              <div className="map-instruction">
                <span>💡 Dica: Passe o mouse para ver o resumo e clique para fixar os dados detalhados</span>
              </div>
            </div>

            <BrazilMap
              statesData={statesData}
              selectedState={selectedState}
              onSelectState={handleSelectState}
              hoveredState={hoveredState}
              onHoverState={handleHoverState}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
            />
          </div>

          {/* Cards Rápidos de Visão Geral no Rodapé do Mapa */}
          <div className="bottom-metrics-overview">
            <div className="overview-card" onClick={() => setViewMode('biome')}>
              <div className="overview-icon bg-emerald-soft">
                <Trees size={22} className="text-emerald" />
              </div>
              <div>
                <h4>6 Biomas Continentais</h4>
                <p>Amazônia, Cerrado, Mata Atlântica, Caatinga, Pampa e Pantanal</p>
              </div>
            </div>

            <div className="overview-card" onClick={() => setViewMode('desertification')}>
              <div className="overview-icon bg-orange-soft">
                <Flame size={22} className="text-orange" />
              </div>
              <div>
                <h4>Núcleos de Desertificação</h4>
                <p>Semiárido nordestino (Irauçuba, Seridó, Gilbués e Cabrobó)</p>
              </div>
            </div>

            <div className="overview-card" onClick={() => setViewMode('deforestation')}>
              <div className="overview-icon bg-red-soft">
                <AlertTriangle size={22} className="text-red" />
              </div>
              <div>
                <h4>Monitoramento INPE</h4>
                <p>Taxas relativas de corte, queimadas e alertas ao vivo</p>
              </div>
            </div>
          </div>
        </section>

        {/* Coluna Direita: Painel de Informações Detalhadas do Estado */}
        <section className="details-section-wrapper">
          <StateDetails 
            stateData={selectedState} 
            onClose={() => setSelectedState(null)}
            activeViewMode={viewMode}
            onChangeViewMode={setViewMode}
          />
        </section>
      </main>

      {/* Floating State Tooltip on Hover */}
      <StateTooltip 
        stateData={hoveredState} 
        position={tooltipPos} 
      />

      {/* Info Modals (Quem Somos, Órgãos & Entidades, FAQ) */}
      <InfoModal 
        activeModal={activeModal} 
        onClose={() => setActiveModal(null)} 
      />
    </div>
  );
}
