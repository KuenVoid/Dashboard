import React from "react";

export default function Menu({width}) {
  return (
    <nav className='menu' style={ { width: `${width}vw` } }>
      <h1 className='sidebar-title'>Dashboard</h1>
      <h2 className='page_option'>Home</h2>
      <h2 className="page_option">Todo</h2>
      <h2 className="page_option">Calendar</h2>
      <h2 className='page_option'>Settings</h2>
    </nav>
  );
}