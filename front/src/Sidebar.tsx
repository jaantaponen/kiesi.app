import React, { useState } from 'react';
import './Sidebar.css';
import { useHistory } from 'react-router-dom';
export default () => {
  const menuItems = [
    {id: "main", title: "My pools"},
    {id: "join", title: "Join a pool"},
    {id: "settings", title: "Settings"}
  ];

  const [activeItem, setActiveItem] = useState<string>("main");

  const history = useHistory();
  const menuItemClicked = (id: string) => {
    console.log(id);
    setActiveItem(id);
    history.push("/tool");
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
