import { apiCall } from './apiHelper.js';

// Endpoint de la API que SÍ subiste
const ENDPOINT = '/api/security/app-privileges/crud'; 

/**
 * Obtiene todos los privilegios (usando GetByFilter sin filtro)
 */
export const getPrivileges = async (dbServer) => {
  return apiCall(ENDPOINT, 'GetByFilter', null, {}, dbServer); 
};

/**
 * Crea un nuevo privilegio
 */
export const createPrivilege = async (privilegeData, dbServer) => {
  return apiCall(ENDPOINT, 'GrantPrivilege', privilegeData, {}, dbServer);
};

/**
 * Edita un privilegio (API no tiene 'Update', simulamos con Revoke + Grant)
 */
export const updatePrivilege = async (oldData, newData, dbServer) => {
  console.warn("MOCK API: updatePrivilege() está simulado.");
  // TODO: Tu API no tiene un 'Update'.
  // La lógica correcta sería revocar el antiguo y garantizar el nuevo.
  await deletePrivilege(oldData, dbServer);
  const created = await createPrivilege(newData, dbServer);
  return created[0] || created; // insertMany devuelve un array
};

/**
 * Elimina (borrado lógico) un privilegio
 */
export const deletePrivilege = async (privilegeData, dbServer) => {
  // El API 'RevokePrivilege' requiere todos los keys en los query params
  const queryParams = {
    ROLEID: privilegeData.ROLEID,
    APPID: privilegeData.APPID,
    PRIVILEGEID: privilegeData.PRIVILEGEID,
    PROCESSID: privilegeData.PROCESSID,
    VIEWID: privilegeData.VIEWID
  };
  return apiCall(ENDPOINT, 'RevokePrivilege', null, queryParams, dbServer);
};