import { IconButton } from '@mui/material';
import React from 'react';
import { ReactComponent as SidebarToggle } from '../../assets/open-sidebar.svg';
import './Header.scss';

function Header() {
  const toggleSidebar = () => {
    document.getElementById('sidebar').classList.toggle('active');
  };

  return (
    <div className="header">
      <IconButton onClick={toggleSidebar}>
        <SidebarToggle />
      </IconButton>
    </div>
  );
}

export default Header;
