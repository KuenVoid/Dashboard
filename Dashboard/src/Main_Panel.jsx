import { useState, useEffect, useRef } from "react";
import Menu from "./Component/Menu"; 
import Home from "./Component/Home";
import Calendar from "./Component/Calendar";
import Settings from "./Component/Settings";
import { useSidebar } from "./hooks/sidebar";
import "./Style_Sheets/App.css";

export default function App() {
  const {sidebarWidth, startResizing} = useSidebar();
  const [CurrentPage, setCurrentPage] = useState("Home");
  const [theme, settheme] = useState(localStorage.getItem("app-theme") || "Space-Black");
  const [DashboardTitle, setDashboardTitle] = useState(localStorage.getItem("Title") || "Dashboard");
  const [username, setusername] = useState(localStorage.getItem("username") || "User");
  const [log_msg, setlog_msg] = useState(
    localStorage.getItem("log_msg") || "Where you can easily manage your progress, \
    streamline daily metrics, and track actionable objectives with tailored analytical insights."
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
    localStorage.setItem("Title", DashboardTitle);
  }, [theme]);
  
  return (
    <div className="app-container">
      <Menu width={sidebarWidth} setCurrentPage={setCurrentPage} DashboardTitle={DashboardTitle}/>
      <div className="resizer-handle" onMouseDown={startResizing} />
      <div className="main-content">
        {CurrentPage === "Home" && <Home username={username} log_msg={log_msg}/>}
        {/* {CurrentPage === "Todo" && <Todo />} */ }
        {CurrentPage === "Calendar" && <Calendar />}
        {CurrentPage === "Settings" && <Settings currentTheme={theme} setcurrentTheme={settheme}
        sidebarwidth={Math.round(sidebarWidth * 10) / 10} dashboardTitle={DashboardTitle}
        setDashboardTitle={setDashboardTitle} username={username} setusername={setusername}
        log_msg={log_msg} setlog_msg={setlog_msg}/>}
      </div>
    </div>
  );
}