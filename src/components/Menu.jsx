import React from 'react';

const menu = ({ background, onHome, onTools, onSettings }) => {
  return (
    <div className="menu" style={ background ? { background } : undefined }>
      <h2 onClick={ onHome }>Home</h2>
      <h2 onClick={ onTools }>Tools</h2>
      <h2 onClick={ onSettings }>Settings</h2>
    </div>
  );
}

export default menu;
