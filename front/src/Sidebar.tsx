import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default ({setVisible}: {setVisible: any}) => {
  const menuItems = [
    {id: "main", title: "My pools"},
    {id: "join", title: "Join a pool"},
    {id: "logout", title: "Logout"}
  ];

  const [activeItem, setActiveItem] = useState<string>("main");
  const history = useHistory();
  const location = useLocation();
  const mm: any = {
    "/tool": "join",
    "/": "main",
  }
  const menuItemClicked = (id: string) => {
    setActiveItem(id);
    if (id === 'join') {
      history.push("/tool");
    } else if (id === 'main') {
      history.push("/");
    } else if (id === 'logout') {
      window.localStorage.removeItem('token');
    }
    setVisible(false);
  }

  return (
    <div id="sidebar">
      <h1>kiesi.app</h1>
      { menuItems.map(menuItem =>
        <a
          key={menuItem.id}
          className={`sidebar-row ${mm[location.pathname] === menuItem.id ? "selected" : ""}`}
          onClick={(e) => menuItemClicked(menuItem.id)}
        >
          {menuItem.title}
        </a>
      )}
    </div>
  );
}
