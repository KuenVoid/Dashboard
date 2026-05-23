import { useState, useEffect, useRef } from "react";

export function useSidebar(storageKey = "sidebar_width", defaultWidth = 20) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? parseFloat(saved) : defaultWidth;
  });

  const isResizing = useRef(false);

  const startResizing = () => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 15 && newWidth < 40) {
        setSidebarWidth(newWidth);
      }
    };

    const stopResizing = () => {
      if (!isResizing.current) return;
      isResizing.current = false;
      document.body.style.cursor = "default";
      console.log("resizing");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, []);
  
  useEffect(() => {
    localStorage.setItem(storageKey, sidebarWidth);
  }, [sidebarWidth, storageKey]);

  return {sidebarWidth, startResizing};
}