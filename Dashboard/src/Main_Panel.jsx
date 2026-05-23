import { useState, useEffect, useRef } from "react";
import Menu from "./Component/Menu"; 
import Home from "./Component/Home";
import { useSidebar } from "./hooks/sidebar";
import "./Style_Sheets/App.css";

export default function App() {
  const {sidebarWidth, startResizing} = useSidebar();
  
  return (
    <div className="app-container">
      <Menu width={sidebarWidth} />
      <div className="resizer-handle" onMouseDown={startResizing} />
      <Home />
    </div>
  );
}