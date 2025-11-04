// URL base de tu API (asumida de tus otros archivos)
const API_BASE_URL = 'http://localhost:3333';
const LOGGED_USER = 'ReactAppUser'; // Puedes cambiar esto dinámicamente

/**
 * Función centralizada para llamadas a la API
 * @param {string} endpoint - El path de la API, ej: '/api/security/user-roles/crud'
 * @param {string} processType - El ProcessType para el query param
 * @param {object} [body=null] - El objeto 'data' para el body del POST
 * @param {object} [queryParams={}] - Otros query params
 * @param {string} dbServer - El servidor de DB del contexto
 * @returns {Promise<any>}
 */
export const apiCall = async (endpoint, processType, body = null, queryParams = {}, dbServer) => {
  // Construye la URL con los query params base
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  url.searchParams.append('ProcessType', processType);
  url.searchParams.append('LoggedUser', LOGGED_USER);
  
  if (dbServer) {
    url.searchParams.append('dbserver', dbServer);
  }

  for (const key in queryParams) {
    if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
      url.searchParams.append(key, queryParams[key]);
    }
  }

  const options = {
    method: 'POST', // Tus servicios CDS 'action' usan POST
    headers: {
      'Content-Type': 'application/json',
    },
  };

  options.body = JSON.stringify({ data: body || {} });

  try {
    const response = await fetch(url.toString(), options);
    const data = await response.json();

    if (!response.ok || data.bitacora?.tipo === 'FAIL') {
      console.error('Error de API:', data.bitacora);
      throw new Error(data.bitacora?.messageUSR || data.bitacora?.messageDEV || 'Error desconocido de la API');
    }

    return data.data?.dataRes || data.dataRes || data;
  } catch (error) {
    console.error(`Error en apiCall (${processType}):`, error);
    throw error;
  }
};