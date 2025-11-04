import styles from '../styles/Users.module.css';
import ReusableModal from '../components/modals/ReusableModal';
import { userEditFields, userCreationFields } from '../components/config/Users-fieldConfigs';
import AlertModal from '../components/modals/AlertModal';
// MODIFICADO: Importar hooks de React
import React, { useState, useEffect, useContext } from 'react';
import {
  Page,
  Bar,
  Input,
  Toolbar,
  Title,
  AnalyticalTable,
  ToolbarSpacer,
  ToolbarButton,
  FlexBox,
  MessageBox,
  Text,
  Label,
  Icon,
  BusyIndicator // MODIFICADO: Importar BusyIndicator
} from '@ui5/webcomponents-react';

// MODIFICADO: Importar DbContext y el servicio
import { DbContext } from '../contexts/dbContext';
import * as usersService from '../services/usersService';

// ELIMINADO: const initialUsers = [...]

// Columnas de la tabla (sin cambios)
const userColumns = [
  { Header: "User ID", accessor: "USERID" },
  { Header: "Nombre de Usuario", accessor: "USERNAME" },
  { Header: "Alias", accessor: "ALIAS" },
  { Header: "Correo Electrónico", accessor: "EMAIL" },
  { Header: "Teléfono", accessor: "PHONENUMBER" },
  { Header: "Extensión", accessor: "EXTENSION" },
  {
    Header: "Activo", accessor: "ACTIVED",
    Cell: ({ value }) => {
      const isActive = value;
      const statusClass = isActive ? styles.statusActive : styles.statusInactive;

      return (
        <div className={`${styles.statusBadge} ${statusClass}`}>
          <Icon name={isActive ? "accept" : "decline"} />
          <Text>{isActive ? "Activo" : "Inactivo"}</Text>
        </div>
      );
    }
  },
];


export default function Users() {
  // NUEVO: Obtener dbServer del contexto
  const { dbServer } = useContext(DbContext);

  //Controlar el "hover" de los botones (sin cambios)
  const [isHoveredDelete, setisHoveredDelete] = useState(false);
  const [isHoveredAdd, setisHoveredAdd] = useState(false);
  const [isHoveredInfo, setisHoveredInfo] = useState(false);
  const [isHoveredEdit, setisHoveredEdit] = useState(false);

  // MODIFICADO: Estados de datos
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // NUEVO: Estados de UI (loading/error)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de Modales (sin cambios)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);

  // NUEVO: Función para cargar datos
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersService.getUsers(dbServer);
      setAllUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  // NUEVO: useEffect para cargar datos al inicio
  useEffect(() => {
    loadUsers();
  }, [dbServer]); // Recargar si cambia el dbServer

  // handleSearch (sin cambios)
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    if (query === '') {
      setFilteredUsers(allUsers);
      return;
    }
    const filtered = allUsers.filter((user) => {
      return Object.values(user).some((value) =>
        String(value).toLowerCase().includes(query)
      );
    });
    setFilteredUsers(filtered);
  };

  // handleRowSelect (sin cambios)
  const handleRowSelect = (event) => {
    const row = event.detail?.row;
    if (row && row.isSelected) {
      setSelectedRow(row.original);
    } else {
      setSelectedRow(null);
    }
  };

  // --- Lógica CRUD Modificada ---

  // MODIFICADO: handleCreateUser
  const handleCreateUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await usersService.createUser(userData, dbServer);
      
      // Actualizar estado local
      setAllUsers(prevUsers => [newUser, ...prevUsers]);
      setFilteredUsers(prevUsers => [newUser, ...prevUsers]);
      
      setShowCreateModal(false);
    } catch (err) {
      setError(err.message || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  // MODIFICADO: handleEditUser
  const handleEditUser = async (updatedUserData) => {
    try {
      setLoading(true);
      setError(null);
      const userIdToUpdate = editingUser.USERID;
      // Combina los datos antiguos y nuevos
      const updatedUser = await usersService.updateUser({ ...editingUser, ...updatedUserData }, dbServer);
      
      // Actualiza ambas listas
      setAllUsers(prevUsers =>
        prevUsers.map(user =>
          user.USERID === userIdToUpdate ? updatedUser : user
        )
      );
      setFilteredUsers(prevUsers =>
        prevUsers.map(user =>
          user.USERID === userIdToUpdate ? updatedUser : user
        )
      );
      
      setShowEditModal(false);
      setEditingUser(null);
      setSelectedRow(null);
    } catch (err) {
      setError(err.message || "Error al actualizar usuario");
    } finally {
      setLoading(false);
    }
  };
  
  // handleEditClick (sin cambios)
  const handleEditClick = (userToEdit) => {
    if (!userToEdit) return;
    setEditingUser(userToEdit);
    setShowEditModal(true);
  };
  
  // handleShowDetails / handleCloseDetails (sin cambios)
  const handleShowDetails = (userData) => {
    setSelectedUserData(userData);
    setIsDetailModalOpen(true);
  };
  const handleCloseDetails = () => {
    setIsDetailModalOpen(false);
    setSelectedUserData(null);
  };

  // MODIFICADO: handleDeleteClick (ahora separada)
  const handleDeleteClick = async (item) => {
    try {
      setLoading(true);
      setError(null);
      await usersService.deleteUser(item.USERID, dbServer);

      // Actualizar estado local (simulando borrado lógico/físico)
      // Para un borrado lógico real, deberías recargar o marcar como DELETED=true
      setAllUsers(prevUsers =>
        prevUsers.filter(user => user.USERID !== item.USERID)
      );
      setFilteredUsers(prevUsers =>
        prevUsers.filter(user => user.USERID !== item.USERID)
      );
      
      setSelectedRow(null);
    } catch (err) {
      setError(err.message || "Error al eliminar usuario");
    } finally {
      setLoading(false);
    }
  };

  // MODIFICADO: handleModalClose
  const handleModalClose = (event) => {
    setShowConfirmModal(false);
    if (event === "Sí") {
      handleDeleteClick(itemToDelete); // Llama a la función async
    }
    setItemToDelete(null);
  };

  // handleOpenConfirmModal (sin cambios)
  const handleOpenConfirmModal = (item) => {
    setItemToDelete(item);
    setShowConfirmModal(true);
  };

  // --- Render ---
  return (
    <Page className={styles.pageContainer}>
      <Bar><Title className={styles.titlePageName}>Usuarios</Title></Bar>

      {/* NUEVO: Indicador de carga y error */}
      {loading && <BusyIndicator active style={{ width: '100%' }} />}
      {error && (
        <AlertModal
          open={!!error}
          onClose={() => setError(null)}
          title="Error"
          design="Negative"
          message={<Text>{error}</Text>}
        />
      )}

      <AnalyticalTable
        data={filteredUsers}
        columns={userColumns}
        selectionMode="SingleSelect"
        onRowSelect={handleRowSelect}
        filterable
        sortable
        visibleRows={12}
        noDataText="No se encontraron registros"
        header={
          <Toolbar className={styles.barTable}>
            <FlexBox className={styles.buttonGroupContainer}>
              <Input
                type="search"
                placeholder="Buscar..."
                className={styles.searchInput}
                icon='search'
                onInput={handleSearch}
              />
              <ToolbarButton
                icon='add'
                design={isHoveredAdd ? "Positive" : "Transparent"}
                onMouseEnter={() => setisHoveredAdd(true)}
                onMouseLeave={() => setisHoveredAdd(false)}
                onClick={() => setShowCreateModal(true)}
                disabled={loading} // MODIFICADO
              />
              <ToolbarButton
                icon='hint'
                design={isHoveredInfo ? "Emphasized" : "Transparent"}
                onMouseEnter={() => setisHoveredInfo(true)}
                onMouseLeave={() => setisHoveredInfo(false)}
                onClick={() => handleShowDetails(selectedRow)}
                disabled={!selectedRow || loading} // MODIFICADO
              />
              <ToolbarButton
                icon='edit'
                design={isHoveredEdit ? "Attention" : "Transparent"}
                onMouseEnter={() => setisHoveredEdit(true)}
                onMouseLeave={() => setisHoveredEdit(false)}
                onClick={() => handleEditClick(selectedRow)}
                disabled={!selectedRow || loading} // MODIFICADO
              />
              <ToolbarButton
                icon='delete'
                design={isHoveredDelete ? "Negative" : "Transparent"}
                onMouseEnter={() => setisHoveredDelete(true)}
                onMouseLeave={() => setisHoveredDelete(false)}
                onClick={() => handleOpenConfirmModal(selectedRow)}
                disabled={!selectedRow || loading} // MODIFICADO
              />
            </FlexBox>
            <ToolbarSpacer />
            <Title>Usuarios ({filteredUsers.length})</Title>
          </Toolbar>
        }
      />{/* Fin Barra de busqueda y crud */}

      {/* Modales (sin cambios en sus props) */}
      <ReusableModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Usuario"
        fields={userCreationFields}
        onSubmit={handleCreateUser}
        submitButtonText="Crear Usuario"
      />

      <ReusableModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        title="Editar Usuario"
        fields={userEditFields}
        onSubmit={handleEditUser}
        submitButtonText="Guardar Cambios"
        initialData={editingUser}
      />
      
      {selectedUserData && (
        <AlertModal
          open={isDetailModalOpen}
          onClose={handleCloseDetails}
          title="Detalles del Usuario"
          buttonText="Cerrar"
          message={
            <FlexBox
              direction="Column"
              className={styles.AlertContent}
            >
              <FlexBox className={styles.AlertRow}>
                <Label wrappingType="Normal" showColon={true}>ID de Empleado</Label>
                <Text>{selectedUserData.EMPLOYEEID}</Text>
              </FlexBox>
              <FlexBox className={styles.AlertRow}>
                <Label wrappingType="Normal" showColon={true}>ID de CEDI</Label>
                <Text>{selectedUserData.CEDIID}</Text>
              </FlexBox>
              <FlexBox className={styles.AlertRow}>
                <Label wrappingType="Normal" showColon={true}>ID de Compañia</Label>
                <Text>{selectedUserData.COMPANYID}</Text>
              </FlexBox>
              <FlexBox className={styles.AlertRow}>
                <Label wrappingType="Normal" showColon={true}>Borrado</Label>
                <Text>{selectedUserData.DELETED ? "Sí" : "No"}</Text>
              </FlexBox>
            </FlexBox>
          }
        />
      )};

      <MessageBox
        open={showConfirmModal}
        titleText="Confirmar eliminación"
        actions={["Sí", "No"]}
        type="Warning"
        onClose={handleModalClose}
      >
        ¿Está seguro de que desea eliminarlo?
      </MessageBox>
    </Page>
  );
}