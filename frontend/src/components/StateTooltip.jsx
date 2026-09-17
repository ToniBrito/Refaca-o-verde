import React from 'react';
import { TreePine, Flame, AlertTriangle, Droplets } from 'lucide-react';

export default function StateTooltip({ stateData, position }) {
  if (!stateData || !position) return null;

  return (
    <div 
      className="floating-state-tooltip"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="tooltip-header">
        <div className="tooltip-badge">{stateData.code}</div>
        <div>
          <h4>{stateData.name}</h4>
          <span className="tooltip-sub">{stateData.capital} • {stateData.primaryBiome}</span>
        </div>
      </div>

      <div className="tooltip-body">
        <div className="tooltip-row">
          <div className="row-label">
            <TreePine size={14} className="text-emerald" />
            <span>Bioma Predominante:</span>
          </div>
          <span className="row-value font-bold">{stateData.primaryBiome}</span>
        </div>

        <div className="tooltip-row">
          <div className="row-label">
            <Droplets size={14} className="text-blue" />
            <span>Clima:</span>
          </div>
          <span className="row-value">{stateData.climate.type}</span>
        </div>

        <div className="tooltip-row">
          <div className="row-label">
            <Flame size={14} className="text-orange" />
            <span>Desertificação:</span>
          </div>
          <span className={`row-tag desert-${stateData.desertification.score > 60 ? 'high' : 'normal'}`}>
            {stateData.desertification.level}
          </span>
        </div>

        <div className="tooltip-row">
          <div className="row-label">
            <AlertTriangle size={14} className="text-red" />
            <span>Desmatamento:</span>
          </div>
          <span className={`row-tag deforest-${stateData.deforestation.rateScore > 60 ? 'high' : 'normal'}`}>
            {stateData.deforestation.level}
          </span>
        </div>

        <div className="tooltip-plant-preview">
          <span className="plant-label">Árvore recomendada:</span>
          <span className="plant-name">🌱 {stateData.reforestation.recommendedPlants[0]?.name}</span>
        </div>
      </div>
      <div className="tooltip-hint">Clique para ver todos os dados e espécies</div>
    </div>
  );
}
