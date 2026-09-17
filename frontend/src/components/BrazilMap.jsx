import React, { useState } from 'react';
import { BRAZIL_MAP_PATHS } from '../data/brazilMapPaths';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Flame, 
  AlertTriangle,
  TreePine,
  Sparkles
} from 'lucide-react';

export default function BrazilMap({
  statesData = {},
  selectedState,
  onSelectState,
  hoveredState,
  onHoverState,
  viewMode = 'biome', // 'biome' | 'deforestation' | 'desertification' | 'reforestation'
  onChangeViewMode
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Funções de zoom e pan
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.8));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Apenas botão esquerdo
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Determinar cor do estado com base nos dados do backend e modo de visualização ativo
  const getStateFill = (stateId) => {
    const data = statesData[stateId];
    if (!data) return '#1e293b';

    if (viewMode === 'biome') {
      const primary = data.primaryBiome || data.biomes?.[0]?.name;
      switch (primary) {
        case 'Amazônia': return '#10b981'; // Verde Esmeralda
        case 'Cerrado': return '#eab308'; // Amarelo Dourado
        case 'Caatinga': return '#f97316'; // Laranja Quente
        case 'Mata Atlântica': return '#059669'; // Verde Floresta
        case 'Pampa': return '#84cc16'; // Verde Lima Claro
        case 'Pantanal': return '#06b6d4'; // Azul Turquesa
        default: return '#10b981';
      }
    }

    if (viewMode === 'desertification') {
      const score = data.desertification?.score || 0;
      if (score >= 80) return '#dc2626'; // Vermelho Crítico
      if (score >= 60) return '#ea580c'; // Laranja Forte
      if (score >= 40) return '#f59e0b'; // Âmbar Médio
      if (score >= 20) return '#84cc16'; // Verde Claro
      return '#10b981'; // Verde Baixo Risco
    }

    if (viewMode === 'deforestation') {
      const score = data.deforestation?.rateScore || 0;
      if (score >= 85) return '#b91c1c'; // Vermelho Escuro
      if (score >= 65) return '#ef4444'; // Vermelho Alerta
      if (score >= 45) return '#f59e0b'; // Amarelo/Laranja
      return '#10b981'; // Verde Estável/Baixo
    }

    if (viewMode === 'reforestation') {
      const priority = data.reforestation?.priorityLevel;
      if (priority === 'Urgente') return '#047857'; // Verde Escuro Forte
      if (priority === 'Alta') return '#10b981';
      return '#34d399';
    }

    return '#10b981';
  };

  return (
    <div className="brazil-map-container">
      {/* Controles de Modo de Visualização do Mapa */}
      <div className="map-viewmode-bar">
        <span className="viewmode-title">
          <Layers size={15} /> Modo do Mapa:
        </span>
        <div className="viewmode-buttons">
          <button 
            className={`viewmode-btn ${viewMode === 'biome' ? 'active' : ''}`}
            onClick={() => onChangeViewMode('biome')}
          >
            <TreePine size={15} /> Biomas Predominantes
          </button>
          <button 
            className={`viewmode-btn ${viewMode === 'desertification' ? 'active' : ''}`}
            onClick={() => onChangeViewMode('desertification')}
          >
            <Flame size={15} /> Grau de Desertificação
          </button>
          <button 
            className={`viewmode-btn ${viewMode === 'deforestation' ? 'active' : ''}`}
            onClick={() => onChangeViewMode('deforestation')}
          >
            <AlertTriangle size={15} /> Alerta de Desmatamento
          </button>
          <button 
            className={`viewmode-btn ${viewMode === 'reforestation' ? 'active' : ''}`}
            onClick={() => onChangeViewMode('reforestation')}
          >
            <Sparkles size={15} /> Reflorestamento
          </button>
        </div>
      </div>

      {/* SVG Interativo do Mapa do Brasil */}
      <div 
        className={`map-viewport ${isDragging ? 'grabbing' : 'grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg 
          viewBox="0 0 600 600" 
          className="brazil-svg"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out'
          }}
        >
          {/* Definições de Efeitos / Gradientes */}
          <defs>
            <filter id="glow-selected" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="shadow-state" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Renderização de todos os estados */}
          <g className="states-group">
            {BRAZIL_MAP_PATHS.map((state) => {
              const isSelected = selectedState?.id === state.id;
              const isHovered = hoveredState?.id === state.id;
              const stateData = statesData[state.id];
              const fillColor = getStateFill(state.id);

              return (
                <path
                  key={state.id}
                  id={`state-${state.id}`}
                  d={state.d}
                  fill={fillColor}
                  className={`state-path ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
                  onMouseEnter={(e) => {
                    if (!stateData) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    onHoverState(stateData, {
                      x: rect.left + rect.width / 2,
                      y: rect.top - 10
                    });
                  }}
                  onMouseMove={(e) => {
                    if (!stateData) return;
                    onHoverState(stateData, {
                      x: e.clientX,
                      y: e.clientY - 15
                    });
                  }}
                  onMouseLeave={() => onHoverState(null, null)}
                  onClick={() => stateData && onSelectState(stateData)}
                />
              );
            })}
          </g>

          {/* Rótulos dos Estados (Siglas) */}
          <g className="state-labels-group" pointerEvents="none">
            {BRAZIL_MAP_PATHS.map((state) => {
              if (!state.centroid) return null;
              const isSelected = selectedState?.id === state.id;
              const isHovered = hoveredState?.id === state.id;

              return (
                <text
                  key={`label-${state.id}`}
                  x={state.centroid[0]}
                  y={state.centroid[1]}
                  className={`state-label ${isSelected ? 'label-selected' : ''} ${isHovered ? 'label-hovered' : ''}`}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {state.id}
                </text>
              );
            })}
          </g>
        </svg>

        {/* Controles de Zoom Flutuantes */}
        <div className="map-zoom-controls">
          <button onClick={handleZoomIn} title="Aumentar Zoom" className="zoom-btn">
            <ZoomIn size={18} />
          </button>
          <button onClick={handleZoomOut} title="Diminuir Zoom" className="zoom-btn">
            <ZoomOut size={18} />
          </button>
          <button onClick={handleResetZoom} title="Resetar Visualização" className="zoom-btn">
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Legenda Dinâmica no Canto Inferior Esquerdo */}
        <div className="map-legend-card">
          <h5 className="legend-title">
            {viewMode === 'biome' && 'Legenda de Biomas'}
            {viewMode === 'desertification' && 'Risco de Desertificação'}
            {viewMode === 'deforestation' && 'Taxa de Desmatamento'}
            {viewMode === 'reforestation' && 'Urgência de Reflorestamento'}
          </h5>

          <div className="legend-items">
            {viewMode === 'biome' && (
              <>
                <div className="legend-item"><span className="legend-box" style={{ background: '#10b981' }}></span> Amazônia</div>
                <div className="legend-item"><span className="legend-box" style={{ background: '#eab308' }}></span> Cerrado</div>
                <div className="legend-item"><span className="legend-box" style={{ background: '#059669' }}></span> Mata Atlântica</div>
                <div className="legend-item"><span className="legend-box" style={{ background: '#f97316' }}></span> Caatinga</div>
                <div className="legend-item"><span className="legend-box" style={{ background: '#84cc16' }}></span> Pampa</div>
                <div className="legend-item"><span className="legend-box" style={{ background: '#06b6d4' }}></span> Pantanal</div>
              </>
            )}

            {viewMode === 'desertification' && (
              <>
                <div className="legend-item"><span className="legend-box" style={{ background: '#dc2626' }}></span> Crítico (&gt;80%)</div>
                <div className="legend-item"><span className="legend-box" style={{ background: '#ea580c' }}></span> Alto (60-79%)</div>
                <div className="legend-item"><span className="legend-box" style={{ background: '#f59e0b' }}></span> Moderado (40-59%)</div>
                <div className="legend-item"><span className="legend-box" style={{ background: '#10b981' }}></span> Baixo (&lt;40%)</div>
              </>
            )}

            {viewMode === 'deforestation' && (
              <>
                <div className="legend-item"><span className="legend-box" style={{ background: '#b91c1c' }}></span> Crítico (&gt;85%)</div>
                <div className="legend-item"><span className="legend-box" style={{ background: '#ef4444' }}></span> Alto (65-84%)</div>
                <div className="legend-item"><span className="legend-box" style={{ background: '#f59e0b' }}></span> Moderado (45-64%)</div>
                <div className="legend-item"><span className="legend-box" style={{ background: '#10b981' }}></span> Baixo (&lt;45%)</div>
              </>
            )}

            {viewMode === 'reforestation' && (
              <>
                <div className="legend-item"><span className="legend-box" style={{ background: '#047857' }}></span> Urgente</div>
                <div className="legend-item"><span className="legend-box" style={{ background: '#10b981' }}></span> Alta</div>
                <div className="legend-item"><span className="legend-box" style={{ background: '#34d399' }}></span> Média</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
