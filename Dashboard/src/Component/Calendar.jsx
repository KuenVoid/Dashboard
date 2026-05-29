import React, { useEffect, useState } from "react";
import "../Style_Sheets/Calendar.css";
import { currentMonitor } from "@tauri-apps/api/window";

export default function Calendar() {
    const [CurrentDate, setCurrentDate] = useState(new Date());
    const [ViewMonth, setViewMonth] = useState(CurrentDate.getMonth());
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Display Materials:
    const display_year = CurrentDate.getFullYear();
    const display_month = monthNames[CurrentDate.getMonth()].substring(0);
    const display_day = CurrentDate.getDate();

    // Context Menu Configuration
    const [menuSettings, setMenuSettings] = useState({
        visible: false,
        x: 0,
        y: 0,
        type: null,
        targetId: null
    });

    // Render time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="cal-container"
        onclick={e => {
            if(e && typeof e.button !== "undefined" && e.button !== 0) return;
            if(menuSettings.visible) setMenuSettings({...menuSettings, visible: false});
        }}>
            <header className="cal-header">
                <h1 className="cal-welcome-title">Calendar - {display_day} {display_month} {display_year}</h1>
            </header>
            {/* Consist all the blocks */}
            <div className="cal-layout-grid">
                <div className="cal-dash-card cal-main-card">
                    <div className="cal-card-header">
                        {/* The header of the calendar */}
                        <div className="cal-month-switcher">
                            <button className="cal-switcher-btn">{"<"}</button>
                            <h2>{monthNames[ViewMonth]}</h2>
                            <button className="cal-switcher-btn">{">"}</button>
                        </div>
                        <button className="cal-edit-btn">Edit</button>
                    </div>
                    {/* Contents */}
                    <div className="cal-grid-matrix">

                    </div>
                </div>
                {/* Right side of the calendar page */}
                <div className="cal-side-panels">
                    {/* Upcoming Event Block */}
                    <div className="cal-dash-card cal-side-card">
                        <h2>Upcoming Events</h2>
                        <div className="cal-side-content">
                            {/* Remember to use the following as template */}
                            <div className="cal-upcoming-item">
                                <span className="cal-upcoming-date">Test Date</span>
                                <span className="cal-upcoming-title">Test Content</span>
                            </div>
                        </div>
                    </div>

                    {/* Todo Block */}
                    <div className="cal-dash-card cal-todo-list">
                        <h2>Todos</h2>
                    </div>
                </div>
            </div>
            {/* Context menu */}
            {menuSettings.visible && (
                <div className="custom-context-menu" style={{
                    top: `${menuSettings.y}px`,
                    left: `${menuSettings.x}px`
                }}>
                {menuSettings.type === "calendar" ? (
                <>
                    <button onClick={() => setMenuSettings({ ...menuSettings, visible: false })}>Edit</button>
                    <button onClick={() => setMenuSettings({ ...menuSettings, visible: false })}>Duplicate</button>
                    <hr className="menu-divider" />
                    <button className="delete-action" onClick={() => setMenuSettings({ ...menuSettings, visible: false })}>Delete Event</button>
                </>
                ) : (
                <>
                    <button onClick={() => setMenuSettings({ ...menuSettings, visible: false })}>Edit</button>
                    <button onClick={() => setMenuSettings({ ...menuSettings, visible: false })}>Complete</button>
                    <hr className="menu-divider" />
                    <button className="delete-action" onClick={() => setMenuSettings({ ...menuSettings, visible: false })}>Delete Todo</button>
                </>
                )}
                </div>
            )}
        </div>
    )
}