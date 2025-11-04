import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { ShellBar, ShellBarItem, Button  } from '@ui5/webcomponents-react';
import { SideNavigation, SideNavigationItem, SideNavigationSubItem } from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/nav-back.js';
import '@ui5/webcomponents-icons/dist/group.js';
import '@ui5/webcomponents-icons/dist/locate-me.js';
import '@ui5/webcomponents-icons/dist/home.js';
import '@ui5/webcomponents-icons/dist/account.js';
import '@ui5/webcomponents-icons/dist/menu2.js';
import '@ui5/webcomponents-icons/dist/employee.js';
import '@ui5/webcomponents-icons/dist/role.js';
import '@ui5/webcomponents-icons/dist/private.js';

// 1. Importa tu archivo de CSS Modules
import styles from '../styles/ShellLayout.module.css';

export default function ShellLayout() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleSideNavSelection = (event) => {
    const key = event.detail.item.dataset.key;
    if (key) {
      navigate(key);
    }
  };

  return (
    <>
      {/* ... (ShellBar existente) ... */}
      <div className={styles.shellContainer}>
        <SideNavigation
          // ... (props existentes)
        >
          {/* Item con sub-items */}
          <SideNavigationItem text="Gestión de Usuarios" icon="group" expanded>
            <SideNavigationSubItem text="Usuarios" data-key="/users" icon='employee'/>
            <SideNavigationSubItem text="Roles" data-key="/roles" icon='role'/>
            <SideNavigationSubItem text="Privilegios (Vista 360)" data-key="/privileges" icon='private'/>
            
            {/* --- AÑADIR ESTOS DOS --- */}
            <SideNavigationSubItem text="Privilegios de App" data-key="/role-app-privileges" icon='key'/>
            <SideNavigationSubItem text="Grupos de Roles" data-key="/role-groups" icon='instance'/>
            {/* --- FIN DE AÑADIR --- */}

          </SideNavigationItem>

          <SideNavigationItem text="Configuración" icon="home" data-key="/configuracion" />
        </SideNavigation>
        <main className={styles.contentContainer}>
          <Outlet />
        </main>
      </div>
    </>
  );
}