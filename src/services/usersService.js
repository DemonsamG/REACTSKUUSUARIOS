// --- MOCK API ---
// TODO: No se proporcionó un endpoint de API para el CRUD de Usuarios.
// Estas funciones están simuladas. Deberás reemplazarlas por las
// llamadas reales a 'apiCall' (del apiHelper.js) cuando tengas el endpoint.

const MOCK_API_DELAY = 500; // Simula un retraso de red

// Usamos 'let' para que la lista sea mutable para las simulaciones
let mockUsers = [
  {
    USERID: "001",
    USERNAME: "Johnathan Doe (Mock)",
    COMPANYID: 101,
    CEDIID: 5,
    EMPLOYEEID: 45012,
    EMAIL: "john.doe@examplecorp.com",
    ACTIVED: true,
    DELETED: false,
    ALIAS: "JohnnyD",
    PHONENUMBER: "+525512345678",
    EXTENSION: "301",
  },
  {
    USERID: "002",
    USERNAME: "Ana García (Mock)",
    COMPANYID: 102,
    CEDIID: 6,
    EMPLOYEEID: 45013,
    EMAIL: "ana.garcia@examplecorp.com",
    ACTIVED: false,
    DELETED: false,
    ALIAS: "Anita",
    PHONENUMBER: "+525598765432",
    EXTENSION: "302",
  },
];

/**
 * Simula la obtención de todos los usuarios
 */
export const getUsers = async (dbServer) => {
  console.warn(`MOCK API: getUsers() está usando datos simulados (dbServer: ${dbServer}).`);
  await new Promise(r => setTimeout(r, MOCK_API_DELAY));
  // Devuelve una copia de los usuarios no eliminados
  return [...mockUsers.filter(u => !u.DELETED)];
};

/**
 * Simula la creación de un nuevo usuario
 */
export const createUser = async (userData, dbServer) => {
  console.warn(`MOCK API: createUser() (dbServer: ${dbServer})`, userData);
  await new Promise(r => setTimeout(r, MOCK_API_DELAY));
  
  const newUser = {
    ...userData,
    USERID: Date.now().toString(), // ID simulado
    DELETED: userData.DELETED || false,
    ACTIVED: userData.ACTIVED === undefined ? true : userData.ACTIVED
  };
  
  mockUsers = [newUser, ...mockUsers]; // Agrega al inicio
  return newUser;
};

/**
 * Simula la actualización de un usuario
 */
export const updateUser = async (userData, dbServer) => {
  console.warn(`MOCK API: updateUser() (dbServer: ${dbServer})`, userData);
  await new Promise(r => setTimeout(r, MOCK_API_DELAY));
  
  mockUsers = mockUsers.map(u => 
    u.USERID === userData.USERID ? userData : u
  );
  return userData;
};

/**
 * Simula la eliminación (lógica o física) de un usuario
 */
export const deleteUser = async (userId, dbServer) => {
  console.warn(`MOCK API: deleteUser() (dbServer: ${dbServer})`, userId);
  await new Promise(r => setTimeout(r, MOCK_API_DELAY));
  
  const user = mockUsers.find(u => u.USERID === userId);
  if (user && user.hasOwnProperty('DELETED')) {
    // Simula borrado lógico
    user.DELETED = true;
  } else {
    // Simula borrado físico
    mockUsers = mockUsers.filter(u => u.USERID !== userId);
  }
  
  return { USERID: userId, status: 'deleted' };
};