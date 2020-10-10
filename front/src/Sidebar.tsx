import React, { useState } from 'react';
import './Sidebar.css';

export default () => {
  const menuItems = [
    {id: "main", title: "My pools"},
    {id: "join", title: "Join a pool"},
    {id: "settings", title: "Settings"}
  ];

  const [activeItem, setActiveItem] = useState<string>("main");

  const menuItemClicked = (id: string) => {
    console.log(id);
    setActiveItem(id);
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
