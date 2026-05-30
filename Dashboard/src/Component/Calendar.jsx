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
    const [scrollLock, setScrollLock] = useState(false);
    let touchStartX = 0;

    // Data Management
    const [EventContent, setEventContent] = useState(() => {
        const savedData = localStorage.getItem("EventContent");
        return savedData ? JSON.parse(savedData) : [
            {id: "c1", Title: "Do Something", Time: 1780194600000, EndTime: 1780200000000, Location: "HK", Category: "Not-Important"},
            {id: "c2", Title: "Do Nothing", Time: 1780200000000, EndTime: 1780205400000, Location: "US", Category: "Somewhat-Important"},
            {id: "c3", Title: "Zoom" , Time: 1780205400000, EndTime: 1780394400000, Location: "Online", Category: "Important"},
            {id: "c12", Title: "Class", Time: 1780210800000, EndTime: 1780308000000, Location: "HKUST", Category: "Not-Important"}
        ];
    })

    const EventOccured = EventContent.filter(event => {
        const start = new Date(event.Time);
        const end = new Date(event.EndTime);
        
        const monthStart = new Date(ViewCalendar.getFullYear(), ViewCalendar.getMonth(), 1);
        const nextMonthStart = new Date(ViewCalendar.getFullYear(), ViewCalendar.getMonth() + 1, 1);

        // If it starts before the next month begins AND ends after this month started, it's a match
        return start < nextMonthStart && end >= monthStart;
    }).flatMap(event => {
        const start = new Date(event.Time);
        const end = new Date(event.EndTime);
        const days = [];
        
        const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
        const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate());
        
        let loop = new Date(startMidnight);
        while (loop <= endMidnight) {
            if (loop.getFullYear() === ViewCalendar.getFullYear() && loop.getMonth() === ViewCalendar.getMonth()) {
                days.push(loop.getDate());
            }
            loop.setDate(loop.getDate() + 1);
        }
        return days;
    });

    // Display Materials
    const display_year = CurrentDate.getFullYear();
    const display_month = monthNames[CurrentDate.getMonth()].substring(0);
    const display_day = CurrentDate.getDate();

    const timestampconvert = (timestamp) => {
        const temp = new Date(timestamp);
        const hours = temp.getHours();
        const minutes = temp.getMinutes();
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hours}:${formattedMinutes}`;
    }

    const isSameDay = (timestamp1, timestamp2) => {
        const d1 = new Date(timestamp1);
        const d2 = new Date(timestamp2);
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    };

    // Handling scroll to change month preview
    const handleMonthChange = (direction) => {
        if (scrollLock) return;

        setScrollLock(true);
        setViewCalendar(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));

        // Release the lock after 500ms so the user can swipe again
        setTimeout(() => {
            setScrollLock(false);
        }, 500);
    };
    const handleWheel = (e) => {
        // e.deltaX > 0 means swiping left (moving next), < 0 means swiping right (moving prev)
        if (Math.abs(e.deltaX) > 20) {
            if (e.deltaX > 0) {
                handleMonthChange(1); // Next Month
            } else {
                handleMonthChange(-1); // Previous Month
            }
        }
    };
    const handleTouchStart = (e) => {
        touchStartX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const swipeDistance = touchStartX - touchEndX;

        // Threshold of 50px ensures tiny accidental twitches don't change the month
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                handleMonthChange(1);  // Swiped left -> Next Month
            } else {
                handleMonthChange(-1); // Swiped right -> Prev Month
            }
        }
    };

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
        const selected = new Date(SelectedDate);
        return event.Time <= selected.setHours(23,59,59) && event.EndTime >= selected.setHours(0,0,0);
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
                <div className="cal-dash-card cal-main-card"
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}>
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
                                            <span className="cal-upcoming-secondary-title">
                                                {isSameDay(event.Time, SelectedDate) ? timestampconvert(event.Time) : "00:00"} 
                                                {" - "}
                                                {isSameDay(event.EndTime, SelectedDate) ? timestampconvert(event.EndTime) : "23:59"}
                                                {", "}{event.Location}
                                            </span>
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