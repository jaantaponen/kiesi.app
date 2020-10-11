import React, { useState } from 'react';
import './MenuButton.css';

export default (props: any) => {
  return (
    <button className="menu-button" onClick={ (e) => props.onClick() }>
      <div className="menu-button-bar"/>
      <div className="menu-button-bar"/>
      <div className="menu-button-bar"/>
    </button>
  );
}
