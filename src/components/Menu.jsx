import React from 'react';

const Menu = ({ left, transition, background, onHome, onTools, onSettings }) => {
  return (
    <div className="Menu" style={ {left: left, transition: transition, background: background} }>
      <h2 onClick={ onHome }>Home</h2>
      <h2 onClick={ onTools }>Tools</h2>
      <h2 onClick={ onSettings }>Settings</h2>
    </div>
  );
}

export default Menu;
