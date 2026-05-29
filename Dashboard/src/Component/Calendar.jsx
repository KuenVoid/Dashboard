import React, { useEffect, useState } from "react";
import "../Style_Sheets/Calendar.css";

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [menuSettings, setMenuSettings] = useState({
        visible: false,
        x: 0,
        y: 0,
        type: null,
        targetId: null
    });

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const startDayOffset = new Date(year, month, 1).getDay();
    const DisplayMonth = monthNames[month].substring(0, 3);

    const daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);
    const blankOffsets = Array.from({ length: startDayOffset }, (_, i) => i);

    const sampleEvents = [12, 18, 24];
    const sampleTodos = [
        { id: 101, text: "Prepare slides" },
        { id: 102, text: "Send weekly update" }
    ];
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div
            className="cal-container"
            onClick={(e) => {
                if (e && typeof e.button !== "undefined" && e.button !== 0) return;
                if (menuSettings.visible) setMenuSettings({ ...menuSettings, visible: false });
            }}
        >
            <header className="cal-header">
                <h1 className="cal-welcome-title">Calendar - {day} {DisplayMonth} {year}</h1>
            </header>

            <div className="cal-layout-grid">
                {/* Left Side: Calendar Block */}
                <div className="cal-dash-card cal-main-card" onContextMenu={(e) => e.preventDefault()}>
                    <div className="cal-card-header">
                        <div className="cal-month-switcher">
                            <button className="cal-switcher-btn" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>◀</button>
                            <h2>{monthNames[month]} {year}</h2>
                            <button className="cal-switcher-btn" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>▶</button>
                        </div>
                        <button className="cal-edit-btn">Edit</button>
                    </div>

                    <div className="cal-grid-matrix">
                        {blankOffsets.map((offset) => (
                            <div key={`blank-${offset}`} className="cal-day-cell cal-empty-cell"></div>
                        ))}

                        {daysInMonth.map((day) => (
                            <div
                                key={day}
                                className="cal-day-cell"
                                onContextMenu={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const y_cord = (e.clientY + 135 > window.innerHeight) ? e.clientY - 135 : e.clientY;
                                    setMenuSettings({ visible: true, x: e.clientX, y: y_cord, type: "calendar", targetId: day });
                                }}
                            >
                                <span className="cal-day-number">{day}</span>
                                {sampleEvents.includes(day) && (
                                    <div className="cal-event-tag">Event</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Vertically Aligned Panels */}
                <div className="cal-side-panels">
                    {/* Upcoming Block */}
                    <div className="cal-dash-card cal-side-card">
                        <h2>Upcoming</h2>
                        <div className="cal-side-content">
                            <div className="cal-upcoming-item">
                                <span className="cal-upcoming-date">May 12</span>
                                <span className="cal-upcoming-title">Sprint Launch</span>
                            </div>
                            <div className="cal-upcoming-item">
                                <span className="cal-upcoming-date">May 18</span>
                                <span className="cal-upcoming-title">Client Review</span>
                            </div>
                        </div>
                    </div>

                    {/* Todos Block */}
                    <div className="cal-dash-card cal-side-card">
                        <h2>Todos</h2>
                        <div className="cal-side-content cal-todo-list">
                            {sampleTodos.map((todo) => (
                                <div
                                    key={todo.id}
                                    className="cal-todo-item"
                                    onContextMenu={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        const y_cord = (e.clientY + 135 > window.innerHeight) ? e.clientY - 135 : e.clientY;
                                        setMenuSettings({ visible: true, x: e.clientX, y: y_cord, type: "todo", targetId: todo.id });
                                    }}
                                >
                                    <span className="cal-todo-text">{todo.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Context Menu Popup */}
            {menuSettings.visible && (
                <div className="custom-context-menu" style={{ top: `${menuSettings.y}px`, left: `${menuSettings.x}px` }}>
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
    );
}