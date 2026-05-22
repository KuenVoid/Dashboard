import { useState, useEffect, useRef } from "react";
import Menu from "./Component/Menu"; 
import Home from "./Component/Home";
import "./App.css";

export default function App() {
  const [sidebarWidth, SetsidebarWidth] = useState(20);
  const isResizing = useRef(false);

  const startResizing = () => {
    isResizing.current = true;
    document.body.style.cursor = "ew-resize";
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    const handleMouseMove = e => {
      if(!isResizing.current) return;

      const newWidth = e.clientX / window.innerWidth * 100;
      if(newWidth > 15.5 && newWidth < 40){
        SetsidebarWidth(newWidth);
      }
    }
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResizing);

    return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", stopResizing);  
    }
  }, [])
  
  return (
    <div className="app-container">
      <Menu width={sidebarWidth} />
      <div className="resizer-handle" onMouseDown={startResizing} />
      <Home />
    </div>
  );
}