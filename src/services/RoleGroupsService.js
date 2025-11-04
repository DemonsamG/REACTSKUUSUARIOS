// --- MOCK API ---
// TODO: No se proporcionó un endpoint de API para ZTROLE_GRUPOSET.
// Estas funciones están simuladas.

const MOCK_API_DELAY = 500;

// Datos simulados basados en la imagen
let mockData = [
  { ROLEID: "ADMIN", IDSOCIEDAD: 1000, IDCEDI: 200, IDGRUPOET: "G1", ID: "ID_01", PRIVILEGIEID: "P_READ", ACTIVED: true, DELETED: false },
  { ROLEID: "USER", IDSOCIEDAD: 1000, IDCEDI: 200, IDGRUPOET: "G2", ID: "ID_02", PRIVILEGIEID: "P_WRITE", ACTIVED: true, DELETED: false },
  { ROLEID: "ADMIN", IDSOCIEDAD: 1000, IDCEDI: 300, IDGRUPOET: "G1", ID: "ID_03", PRIVILEGIEID: "P_DELETE", ACTIVED: false, DELETED: false },
];

export const getRoleGroups = async (dbServer) => {
  console.warn("MOCK API: getRoleGroups() está usando datos simulados.");
  await new Promise(r => setTimeout(r, MOCK_API_DELAY));
  return [...mockData.filter(d => !d.DELETED)];
};

export const createRoleGroup = async (data, dbServer) => {
  console.warn("MOCK API: createRoleGroup()");
  await new Promise(r => setTimeout(r, MOCK_API_DELAY));
  const newItem = { ...data, DELETED: false };
  mockData = [newItem, ...mockData];
  return newItem;
};

export const updateRoleGroup = async (data, dbServer) => {
  console.warn("MOCK API: updateRoleGroup()");
  await new Promise(r => setTimeout(r, MOCK_API_DELAY));
  mockData = mockData.map(d => (
    d.ROLEID === data.ROLEID &&
    d.IDSOCIEDAD === data.IDSOCIEDAD &&
    d.PRIVILEGIEID === data.PRIVILEGIEID // Asumiendo llave simple
  ) ? data : d);
  return data;
};

export const deleteRoleGroup = async (data, dbServer) => {
  console.warn("MOCK API: deleteRoleGroup()");
  await new Promise(r => setTimeout(r, MOCK_API_DELAY));
  // Borrado lógico simulado
  mockData = mockData.map(d => (
    d.ROLEID === data.ROLEID &&
    d.IDSOCIEDAD === data.IDSOCIEDAD &&
    d.PRIVILEGIEID === data.PRIVILEGIEID // Asumiendo llave simple
  ) ? { ...d, DELETED: true } : d);
  return data;
};