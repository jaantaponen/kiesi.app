import React, { useState } from 'react';
import { useHistory } from 'react-router';
import './Sidebar.css';

export default ({setVisible}: {setVisible: any}) => {
  const menuItems = [
    {id: "main", title: "My pools"},
    {id: "join", title: "Join a pool"},
    {id: "settings", title: "Settings"}
  ];

  const [activeItem, setActiveItem] = useState<string>("main");
  const history = useHistory();
  const menuItemClicked = (id: string) => {
    setActiveItem(id);
    if (id === 'join') {
      history.push("/tool");
    } else if (id === 'main') {
      history.push("/");
    }
    setVisible(false);
  }

  return (
    <div id="sidebar">
      <h1>kiesi.app</h1>
      { menuItems.map(menuItem =>
        <a
          className={`sidebar-row ${activeItem === menuItem.id ? "selected" : ""}`}
          onClick={(e) => menuItemClicked(menuItem.id)}
        >
          {menuItem.title}
        </a>
      )}
    </div>
  );
}
