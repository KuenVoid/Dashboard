import { useState, useEffect, useRef } from "react";

export function useSidebar(storageKey = "sidebar_width", defaultWidth = 20) {
  // Initialize state directly from localStorage so it persists on page refresh
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? parseFloat(saved) : defaultWidth;
  });

  const isResizing = useRef(false);

  // Start tracking drag operations
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
      
      // Save the final position to localStorage when the user lets go of the mouse
      localStorage.setItem(storageKey, sidebarWidth);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [sidebarWidth, storageKey]); // Tracks width changes to capture final positions

  // Return the data your components actually care about
  return { sidebarWidth, startResizing };
}