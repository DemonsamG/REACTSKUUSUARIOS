import styles from '../styles/Users.module.css'; // Reutilizamos estilos
import ReusableModal from '../components/modals/ReusableModal.jsx';
import { roleGroupFields } from '../components/config/RoleGroups-fieldConfigs.js';
import AlertModal from '../components/modals/AlertModal.jsx';
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
  Icon,
  BusyIndicator
} from '@ui5/webcomponents-react';

import { DbContext } from '../contexts/dbContext.jsx';
import * as roleGroupService from '../services/roleGroupsService.js'; // Servicio MOCK

// Columnas de la tabla
const roleGroupColumns = [
  { Header: "ID Rol", accessor: "ROLEID" },
  { Header: "Sociedad", accessor: "IDSOCIEDAD" },
  { Header: "CEDI", accessor: "IDCEDI" },
  { Header: "Grupo ET", accessor: "IDGRUPOET" },
  { Header: "ID", accessor: "ID" },
  { Header: "Privilegio", accessor: "PRIVILEGIEID" },
  {
    Header: "Activo", accessor: "ACTIVED",
    Cell: ({ value }) => (value ? "Sí" : "No")
  },
];

export default function RoleGroups() {
  const { dbServer } = useContext(DbContext);

  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roleGroupService.getRoleGroups(dbServer);
      setAllItems(data);
      setFilteredItems(data);
    } catch (err) {
      setError(err.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dbServer]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    if (query === '') {
      setFilteredItems(allItems);
      return;
    }
    const filtered = allItems.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
    setFilteredItems(filtered);
  };

  const handleRowSelect = (event) => {
    const row = event.detail?.row;
    if (row && row.isSelected) {
      setSelectedRow(row.original);
    } else {
      setSelectedRow(null);
    }
  };

  const handleCreate = async (formData) => {
    try {
      setLoading(true);
      const newItem = await roleGroupService.createRoleGroup(formData, dbServer);
      setAllItems(prev => [newItem, ...prev]);
      setFilteredItems(prev => [newItem, ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      setError(err.message || "Error al crear registro");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    if (!item) return;
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleEdit = async (updatedData) => {
    try {
      setLoading(true);
      const updatedItem = await roleGroupService.updateRoleGroup(updatedData, dbServer);
      
      const keyMatcher = (item) =>
        item.ROLEID === editingItem.ROLEID &&
        item.IDSOCIEDAD === editingItem.IDSOCIEDAD &&
        item.PRIVILEGIEID === editingItem.PRIVILEGIEID; // Llave simple simulada

      setAllItems(prev => prev.map(item => keyMatcher(item) ? updatedItem : item));
      setFilteredItems(prev => prev.map(item => keyMatcher(item) ? updatedItem : item));
      
      setShowEditModal(false);
      setEditingItem(null);
      setSelectedRow(null);
    } catch (err) {
      setError(err.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirmModal = (item) => {
    if (!item) return;
    setItemToDelete(item);
    setShowConfirmModal(true);
  };

  const handleDelete = async (item) => {
    try {
      setLoading(true);
      await roleGroupService.deleteRoleGroup(item, dbServer); // Borrado lógico simulado
      
      const keyMatcher = (i) =>
        i.ROLEID === item.ROLEID &&
        i.IDSOCIEDAD === item.IDSOCIEDAD &&
        i.PRIVILEGIEID === item.PRIVILEGIEID; // Llave simple simulada

      setAllItems(prev => prev.filter(i => !keyMatcher(i)));
      setFilteredItems(prev => prev.filter(i => !keyMatcher(i)));
      
      setSelectedRow(null);
    } catch (err) {
      setError(err.message || "Error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = (event) => {
    setShowConfirmModal(false);
    if (event === "Sí") {
      handleDelete(itemToDelete);
    }
    setItemToDelete(null);
  };

  return (
    <Page className={styles.pageContainer}>
      <Bar><Title className={styles.titlePageName}>Grupos de Roles (ZTROLE_GRUPOSET)</Title></Bar>

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
        data={filteredItems}
        columns={roleGroupColumns}
        selectionMode="SingleSelect"
        onRowSelect={handleRowSelect}
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
                design="Positive"
                onClick={() => setShowCreateModal(true)}
                disabled={loading}
              />
              <ToolbarButton
                icon='edit'
                design="Attention"
                onClick={() => handleEditClick(selectedRow)}
                disabled={!selectedRow || loading}
              />
              <ToolbarButton
                icon='delete'
                design="Negative"
                onClick={() => handleOpenConfirmModal(selectedRow)}
                disabled={!selectedRow || loading}
              />
            </FlexBox>
            <ToolbarSpacer />
            <Title>Registros ({filteredItems.length})</Title>
          </Toolbar>
        }
      />

      {/* Modales */}
      <ReusableModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Grupo de Rol"
        fields={roleGroupFields}
        onSubmit={handleCreate}
        submitButtonText="Crear"
      />
      <ReusableModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Grupo de Rol"
        fields={roleGroupFields}
        onSubmit={handleEdit}
        submitButtonText="Guardar Cambios"
        initialData={editingItem}
      />
      <MessageBox
        open={showConfirmModal}
        titleText="Confirmar eliminación"
        actions={["Sí", "No"]}
        type="Warning"
        onClose={handleModalClose}
      >
        ¿Está seguro de que desea eliminarlo (simulado)?
      </MessageBox>
    </Page>
  );
}