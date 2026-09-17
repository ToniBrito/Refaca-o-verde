// Serviço cliente para consumir a API Python/FastAPI
const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Busca todos os estados e indicadores agregados via backend FastAPI
 */
export async function fetchAllStatesFromBackend() {
  try {
    const res = await fetch(`${API_BASE_URL}/states`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('Backend indisponível no momento, utilizando fallback local seguro:', error);
    return null;
  }
}

/**
 * Busca os dados detalhados de um estado específico
 */
export async function fetchStateDetails(stateCode) {
  try {
    const res = await fetch(`${API_BASE_URL}/states/${stateCode.toUpperCase()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn(`Erro ao buscar dados do estado ${stateCode} via API:`, error);
    return null;
  }
}

/**
 * Verifica o status de saúde da API
 */
export async function checkApiHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}
