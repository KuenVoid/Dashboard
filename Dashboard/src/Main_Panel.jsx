import { useState, useEffect, useRef } from "react";
import Menu from "./Component/Menu";
import Home from "./Component/Home";
import Todo from "./Component/Todo"
import Calendar from "./Component/Calendar";
import Settings from "./Component/Settings";
import { useSidebar } from "./hooks/sidebar";
import "./Style_Sheets/App.css";

export default function App() {
    const { sidebarWidth, startResizing } = useSidebar();
    const [CurrentPage, setCurrentPage] = useState("Home");
    const [theme, settheme] = useState(localStorage.getItem("app-theme") || "Space-Black");
    const [DashboardTitle, setDashboardTitle] = useState(localStorage.getItem("Title") || "Dashboard");
    const [username, setusername] = useState(localStorage.getItem("username") || "User");
    const [log_msg, setlog_msg] = useState(
        localStorage.getItem("log_msg") || "Where you can easily manage your progress, \
        streamline daily metrics, and track actionable objectives with tailored analytical insights."
    );

    // Todo
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem("dashboard_todos");
        return saved ? JSON.parse(saved) : [];
        return [];
    });

    // Calendar
    const [EventContent, setEventContent] = useState(() => {
        const savedData = localStorage.getItem("EventContent");
        return savedData ? JSON.parse(savedData) : [];
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("app-theme", theme);
        localStorage.setItem("Title", DashboardTitle);
    }, [theme, EventContent]);

    return (
        <div className="app-container">
            <Menu width={sidebarWidth} setCurrentPage={setCurrentPage} DashboardTitle={DashboardTitle} />
            <div className="resizer-handle" onMouseDown={startResizing} />
            <div className="main-content">
                {CurrentPage === "Home" && (
                    <Home username={username} log_msg={log_msg} EventContent={EventContent} />
                )}
                {CurrentPage === "Todo" && (
                    <Todo todos={todos} setTodos={setTodos}/>
                )}
                {CurrentPage === "Calendar" && (
                    <Calendar EventContent={EventContent} setEventContent={setEventContent} />
                )}
                {CurrentPage === "Settings" && <Settings currentTheme={theme} setcurrentTheme={settheme}
                    sidebarwidth={Math.round(sidebarWidth * 10) / 10} dashboardTitle={DashboardTitle}
                    setDashboardTitle={setDashboardTitle} username={username} setusername={setusername}
                    log_msg={log_msg} setlog_msg={setlog_msg} />}
            </div>
        </div>
    );
}