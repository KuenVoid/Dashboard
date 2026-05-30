import { useState, useEffect, useRef } from "react";
import Menu from "./Component/Menu";
import Home from "./Component/Home";
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

    // Calendar
    const [EventContent, setEventContent] = useState(() => {
        const savedData = localStorage.getItem("EventContent");
        return savedData ? JSON.parse(savedData) : [
            { id: "c1", Title: "Do Something", Time: 1780099200000, EndTime: 1780113600000, Location: "HK", Category: "Not-Important" },
            { id: "c2", Title: "Do Nothing", Time: 1780099200000, EndTime: 1780128000000, Location: "US", Category: "Somewhat-Important" },
            { id: "c3", Title: "Zoom", Time: 1780113600000, EndTime: 1780214400000, Location: "Online", Category: "Important" },
            { id: "c12", Title: "Class", Time: 1780113600000, EndTime: 1780300800000, Location: "HKUST", Category: "Not-Important" }
        ];
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("app-theme", theme);
        localStorage.setItem("Title", DashboardTitle);
        // localStorage.setItem("EventContent", JSON.stringify(EventContent));
    }, [theme, EventContent]);

    return (
        <div className="app-container">
            <Menu width={sidebarWidth} setCurrentPage={setCurrentPage} DashboardTitle={DashboardTitle} />
            <div className="resizer-handle" onMouseDown={startResizing} />
            <div className="main-content">
                {CurrentPage === "Home" && (
                    <Home username={username} log_msg={log_msg} EventContent={EventContent} />
                )}
                {/* {CurrentPage === "Todo" && <Todo />} */}
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