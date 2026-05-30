import React, { useEffect, useState } from "react";
import "../Style_Sheets/Calendar.css";
import { currentMonitor } from "@tauri-apps/api/window";

export default function Calendar() {
    const [CurrentDate, setCurrentDate] = useState(new Date());
    const [ViewCalendar, setViewCalendar] = useState(CurrentDate);
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const [SelectedDate, setSelectedDate] = useState(CurrentDate.getTime());

    // Data Management
    const [EventContent, setEventContent] = useState(() => {
        const savedData = localStorage.getItem("EventContent");
        return savedData ? JSON.parse(savedData) : [
            {id: "c1", Title: "Do Something", Time: 1780093800000, Location: "HK", Category: "Not-Important", Duration: "1h"},
            {id: "c2", Title: "Do Nothing", Time: 1780122600000, Location: "US", Category: "Somewhat-Important", Duration: "1h"},
            {id: "c3", Title: "Zoom" , Time: 1780144200000, Location: "Online", Category: "Important", Duration: "1h"},
            {id: "c12", Title: "Class", Time: 1780151400000, Location: "HKUST", Category: "Not-Important", Duration: "2h"},
            {id: "c13", Title: "Class", Time: 1780151400000, Location: "HKUST", Category: "Not-Important", Duration: "2h"},
            {id: "c23", Title: "Class", Time: 1780151400000, Location: "HKUST", Category: "Not-Important", Duration: "2h"},
            {id: "c123", Title: "Class", Time: 1780151400000, Location: "HKUST", Category: "Not-Important", Duration: "2h"}
        ];
    })
    const EventOccured = EventContent.map(event => new Date(event.Time))
    .filter(date => date.getFullYear() === ViewCalendar.getFullYear() && date.getMonth() === ViewCalendar.getMonth())
    .map(date => date.getDate());


    // Display Materials
    const display_year = CurrentDate.getFullYear();
    const display_month = monthNames[CurrentDate.getMonth()].substring(0);
    const display_day = CurrentDate.getDate();

    // Calendar Display
    const totalDays = new Date(ViewCalendar.getFullYear(), ViewCalendar.getMonth() + 1, 0).getDate();
    const startDayOffset = new Date(ViewCalendar.getFullYear(), ViewCalendar.getMonth(), 1).getDay();
    const daysInMonth = Array.from({length: totalDays}, (_, i) => i + 1);
    const blankOffsets = Array.from({length: startDayOffset}, (_, i) => i);
    
    // Context Menu Configuration
    const [menuSettings, setMenuSettings] = useState({
        visible: false,
        x: 0,
        y: 0,
        type: null,
        targetId: null
    });

    const HandleContextMenu = (e, Content_Type, id) => {
        e.stopPropagation();
        e.preventDefault();
        const y_cord = (e.clientY + 135 > window.innerHeight)? e.clientY - 135 : e.clientY;
        setMenuSettings({visible: true, x: e.clientX, y: y_cord, type: Content_Type, targetId: id});
    }

    const HandleSelectedDay = (day) => {
        const exactDate = new Date(ViewCalendar.getFullYear(), ViewCalendar.getMonth(), day);
        setSelectedDate(exactDate.getTime());
    }

        const previewEvents = EventContent.filter((event) => {
        if (!SelectedDate) return false;
        
        const eventDate = new Date(event.Time);
        const selectedDateObj = new Date(SelectedDate);

        return (
            eventDate.getFullYear() === selectedDateObj.getFullYear() &&
            eventDate.getMonth() === selectedDateObj.getMonth() &&
            eventDate.getDate() === selectedDateObj.getDate()
        );
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
        onClick={e => {
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
                            <button className="cal-switcher-btn" onClick={() => setViewCalendar(new Date(ViewCalendar.getFullYear(), ViewCalendar.getMonth() - 1, 1))}>{"<"}</button>
                            <h2>{monthNames[ViewCalendar.getMonth()]}</h2>
                            <button className="cal-switcher-btn" onClick={() => setViewCalendar(new Date(ViewCalendar.getFullYear(), ViewCalendar.getMonth() + 1, 1))}>{">"}</button>
                        </div>
                    </div>
                    {/* Contents */}
                    <div className="cal-grid-matrix">
                        {/* Empty Slots */}
                        {blankOffsets.map((offset) => (
                            <div key={`blank-${offset}`} className="cal-day-cell cal-empty-cell"></div>
                        ))}
                        {/* Numbered Slots */}
                        {daysInMonth.map((day) => (
                            <div className="cal-day-cell" key={day}
                            onClick={() => HandleSelectedDay(day)}
                            onContextMenu={e => HandleContextMenu(e, "calendar", day)}>
                                <span className="cal-day-number">{day}</span>
                                {EventOccured.includes(day) && (
                                    <div className="cal-event-tag">Event Occured</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Right side of the calendar page */}
                <div className="cal-side-panels">
                    {/* Upcoming Event Block */}
                    <div className="cal-dash-card cal-side-card">
                        <h2>Upcoming Events</h2>
                        <div className="cal-side-content">
                            {SelectedDate ? (
                                previewEvents.length > 0 ? (
                                    previewEvents.sort((a, b) => a.Time - b.Time)
                                    .map((event) => (
                                        <div key={event.id} className={`cal-upcoming-item ${event.Category}`}>
                                            <span className="cal-upcoming-title">{event.Title}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p>No events on this date. Enjoy your free time!</p>
                                )
                            ) : (
                                <p>Click a day to view events.</p>
                            )}
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
                    <button onClick={() => setMenuSettings({ ...menuSettings, visible: false })}>Edit Day {menuSettings.targetId}</button>
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