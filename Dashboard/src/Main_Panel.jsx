import { useState, useEffect, useRef } from "react";
import Menu from "./Component/Menu"; 
import Home from "./Component/Home";
import Settings from "./Component/Settings";
import { useSidebar } from "./hooks/sidebar";
import "./Style_Sheets/App.css";

export default function App() {
  const {sidebarWidth, startResizing} = useSidebar();
  const [CurrentPage, setCurrentPage] = useState("Home");
  
  return (
    <div className="app-container">
      <Menu width={sidebarWidth} setCurrentPage={setCurrentPage} />
      <div className="resizer-handle" onMouseDown={startResizing} />
      <div className="main-content">
        {CurrentPage === "Home" && <Home />}
        {/* {CurrentPage === "Todo" && <Todo />}
        {CurrentPage === "Calendar" && <Calendar />} */ }
        {CurrentPage === "Settings" && <Settings />}
      </div>
    </div>
  );
}