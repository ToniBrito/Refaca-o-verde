import React from 'react';
import { 
  Sprout, 
  Flame, 
  SunMedium, 
  TreePine, 
  Droplets, 
  Compass, 
  X, 
  Info, 
  Sparkles,
  AlertTriangle,
  Layers,
  Award,
  Radio,
  Wind,
  CloudRain
} from 'lucide-react';

export default function StateDetails({ stateData, onClose, activeViewMode, onChangeViewMode }) {
  if (!stateData) {
    return (
      <aside className="details-panel empty-state">
        <div className="empty-panel-content">
          <div className="empty-icon-pulse">
            <Compass size={48} className="text-emerald" />
          </div>
          <h3>Selecione um Estado</h3>
          <p>
            Passe o mouse ou clique sobre qualquer estado no mapa para explorar dados detalhados de clima, biomas, desertificação, desmatamento e espécies recomendadas para reflorestamento.
          </p>
          <div className="quick-guide-box">
            <span className="guide-title">
              <Sparkles size={16} /> Dica de Navegação
            </span>
            <p>Você pode alternar os modos de visualização no mapa no topo para comparar os indicadores nacionais.</p>
          </div>
        </div>
      </aside>
    );
  }

  const getDeforestationBadgeColor = (level) => {
    switch (level) {
      case 'Crítico': return 'badge-danger';
      case 'Alto': return 'badge-warning';
      case 'Moderado': return 'badge-caution';
      default: return 'badge-good';
    }
  };

  const getDesertificationBadgeColor = (score) => {
    if (score >= 80) return 'badge-danger';
    if (score >= 60) return 'badge-warning';
    if (score >= 30) return 'badge-caution';
    return 'badge-good';
  };

  return (
    <aside className="details-panel active">
      {/* Header do Painel */}
      <div className="panel-header">
        <div className="header-title-group">
          <div className="state-badge-circle">{stateData.code}</div>
          <div>
            <h2>{stateData.name}</h2>
            <span className="state-subtitle">
              {stateData.capital} • Região {stateData.region} • {(stateData.areaKm2).toLocaleString('pt-BR')} km²
            </span>
          </div>
        </div>
        {onClose && (
          <button className="close-btn" onClick={onClose} title="Fechar painel">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="panel-scrollable-content">
        {/* Biomas */}
        <section className="detail-section">
          <div className="section-title">
            <Layers size={18} className="text-emerald" />
            <h3>Biomas Presentes</h3>
          </div>
          <div className="biome-bars-container">
            {stateData.biomes.map((biome) => (
              <div key={biome.name} className="biome-item">
                <div className="biome-info">
                  <span className="biome-dot" style={{ backgroundColor: biome.color }}></span>
                  <span className="biome-name">{biome.name}</span>
                  <span className="biome-pct">{biome.percentage}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${biome.percentage}%`, backgroundColor: biome.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Clima & Precipitação (com telemetria ao vivo se disponível) */}
        <section className="detail-section">
          <div className="section-title space-between">
            <div className="title-with-icon">
              <SunMedium size={18} className="text-amber" />
              <h3>Clima & Meteorologia</h3>
            </div>
            {stateData.climate?.liveConditions && (
              <span className="live-weather-tag">
                <Radio size={12} className="pulse-icon" /> Open-Meteo Ao Vivo
              </span>
            )}
          </div>
          <div className="climate-card">
            <div className="climate-type-header">
              <span className="climate-badge">{stateData.climate.type}</span>
            </div>
            <p className="climate-desc">{stateData.climate.description}</p>
            
            {/* Bloco de Condições Meteorológicas ao Vivo */}
            {stateData.climate?.liveConditions && (
              <div className="live-weather-box">
                <span className="live-title">Condições Atuais na Capital ({stateData.capital}):</span>
                <div className="live-grid">
                  <div className="live-item">
                    <SunMedium size={15} className="text-amber" />
                    <span>Temp: <strong>{stateData.climate.liveConditions.currentTemp}</strong></span>
                  </div>
                  <div className="live-item">
                    <Droplets size={15} className="text-blue" />
                    <span>Umidade: <strong>{stateData.climate.liveConditions.currentHumidity}</strong></span>
                  </div>
                  <div className="live-item">
                    <CloudRain size={15} className="text-blue" />
                    <span>Chuva: <strong>{stateData.climate.liveConditions.currentPrecipitation}</strong></span>
                  </div>
                  <div className="live-item">
                    <Wind size={15} className="text-emerald" />
                    <span>Vento: <strong>{stateData.climate.liveConditions.currentWindSpeed}</strong></span>
                  </div>
                </div>
              </div>
            )}

            <div className="climate-metrics-grid">
              <div className="metric-box">
                <span className="metric-label">Temp. Média Histórica</span>
                <span className="metric-val">{stateData.climate.avgTemp}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Precipitação Anual</span>
                <span className="metric-val">{stateData.climate.annualRainfall}</span>
              </div>
              <div className="metric-box full-width">
                <span className="metric-label">Estação Seca / Estiagem</span>
                <span className="metric-val">{stateData.climate.drySeason}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Desertificação e Desmatamento em 2 Colunas */}
        <section className="detail-section dual-grid">
          {/* Desertificação */}
          <div className="metric-card desert-card">
            <div className="card-header-mini">
              <Flame size={18} className="text-orange" />
              <h4>Desertificação</h4>
            </div>
            <div className="status-row">
              <span className={`status-badge ${getDesertificationBadgeColor(stateData.desertification.score)}`}>
                {stateData.desertification.level}
              </span>
              <span className="score-num">{stateData.desertification.score}/100</span>
            </div>
            <div className="progress-bar-bg mini">
              <div 
                className="progress-bar-fill orange-grad" 
                style={{ width: `${stateData.desertification.score}%` }}
              ></div>
            </div>
            <p className="micro-summary">{stateData.desertification.riskSummary}</p>
            <div className="causes-list">
              <span className="sub-title">Principais fatores:</span>
              <ul>
                {stateData.desertification.causes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Desmatamento e Focos INPE */}
          <div className="metric-card deforest-card">
            <div className="card-header-mini">
              <AlertTriangle size={18} className="text-red" />
              <h4>Desmatamento (INPE)</h4>
            </div>
            <div className="status-row">
              <span className={`status-badge ${getDeforestationBadgeColor(stateData.deforestation.level)}`}>
                {stateData.deforestation.level}
              </span>
              <span className="score-num">{stateData.deforestation.rateScore}/100</span>
            </div>
            <div className="progress-bar-bg mini">
              <div 
                className="progress-bar-fill red-grad" 
                style={{ width: `${stateData.deforestation.rateScore}%` }}
              ></div>
            </div>
            
            {/* Informação de Focos de Calor se disponível */}
            {typeof stateData.deforestation.activeFiresLast24h === 'number' && (
              <div className="inpe-fires-tag">
                🔥 Focos Ativos (24h): <strong>{stateData.deforestation.activeFiresLast24h}</strong>
              </div>
            )}

            <div className="rate-info">
              <span className="trend-tag">Tendência: <strong>{stateData.deforestation.recentTrend}</strong></span>
              <span className="area-tag">Alerta: <strong>{stateData.deforestation.alertAreaKm2}</strong></span>
            </div>
          </div>
        </section>

        {/* Espécies para Reflorestamento */}
        <section className="detail-section reforestation-section">
          <div className="section-title space-between">
            <div className="title-with-icon">
              <Sprout size={20} className="text-emerald" />
              <h3>Plantas Recomendadas para Reflorestamento</h3>
            </div>
            <span className="priority-pill">
              Prioridade: <strong>{stateData.reforestation.priorityLevel}</strong>
            </span>
          </div>

          <p className="reforest-intro">
            Espécies nativas selecionadas para recuperação da biodiversidade, restauração de mananciais e conservação do solo:
          </p>

          <div className="plants-list">
            {stateData.reforestation.recommendedPlants.map((plant, index) => (
              <div key={index} className="plant-card">
                <div className="plant-header">
                  <div className="plant-icon-wrap">
                    <TreePine size={20} />
                  </div>
                  <div className="plant-names">
                    <h4 className="plant-common-name">{plant.name}</h4>
                    <span className="plant-sci-name">{plant.scientificName}</span>
                  </div>
                  <span className={`succession-badge ${plant.type.toLowerCase().replace('/', '-')}`}>
                    {plant.type}
                  </span>
                </div>

                <p className="plant-desc">{plant.description}</p>

                <div className="plant-details-grid">
                  <div className="plant-benefit">
                    <span className="label">Benefício Ecológico:</span>
                    <span className="value">{plant.benefits}</span>
                  </div>
                  <div className="plant-specs">
                    <div>
                      <span className="label">Crescimento:</span>
                      <span className="badge-growth">{plant.growthRate}</span>
                    </div>
                    <div>
                      <span className="label">Solo Ideal:</span>
                      <span className="soil-text">{plant.idealSoil}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Diretrizes Ecológicas */}
          <div className="guidelines-box">
            <div className="guidelines-title">
              <Award size={16} /> Diretrizes de Recuperação para o Estado
            </div>
            <ul>
              {stateData.reforestation.ecologicalGuidelines.map((guideline, i) => (
                <li key={i}>{guideline}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </aside>
  );
}
