import React, { useEffect, useState } from "react";
import "../Style_Sheets/Calendar.css";
import { currentMonitor } from "@tauri-apps/api/window";

export default function Calendar({ EventContent, setEventContent }) {
    const [CurrentDate, setCurrentDate] = useState(new Date());
    const [ViewCalendar, setViewCalendar] = useState(CurrentDate);
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const [SelectedDate, setSelectedDate] = useState(CurrentDate.getTime());
    const [scrollLock, setScrollLock] = useState(false);
    let touchStartX = 0;

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
    const daysInMonth = Array.from({ length: totalDays }, (_, i) => i + 1);
    const blankOffsets = Array.from({ length: startDayOffset }, (_, i) => i);

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
        const y_cord = (e.clientY + 135 > window.innerHeight) ? e.clientY - 135 : e.clientY;
        setMenuSettings({ visible: true, x: e.clientX, y: y_cord, type: Content_Type, targetId: id });
    }

    const HandleSelectedDay = (day) => {
        const exactDate = new Date(ViewCalendar.getFullYear(), ViewCalendar.getMonth(), day);
        setSelectedDate(exactDate.getTime());
    }

    const previewEvents = EventContent.filter((event) => {
        const selected = new Date(SelectedDate);
        return event.Time <= selected.setHours(23, 59, 59) && event.EndTime >= selected.setHours(0, 0, 0);
    });

    // Edit Menus

    // Upcoming Events
    const [editEventModal, setEditEventModal] = useState({ isOpen: false, targetEvent: null });
    const [editEventTitle, setEditEventTitle] = useState("");
    const [editEventLocation, setEditEventLocation] = useState("");
    const [editEventCategory, setEditEventCategory] = useState("Not-Important");
    const [editEventStartDate, setEditEventStartDate] = useState("");
    const [editEventStartTime, setEditEventStartTime] = useState("");
    const [editEventEndDate, setEditEventEndDate] = useState("");
    const [editEventEndTime, setEditEventEndTime] = useState("");

    // Unpacks selected event values into tracking states and launches the modal
    const ModalEditEventOpen = () => {
        const target = EventContent.find(e => e.id === menuSettings.targetId);
        if (!target) return;

        const startDate = new Date(target.Time);
        const endDate = new Date(target.EndTime);

        const formatDate = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const formatTime = (d) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');

        setEditEventTitle(target.Title);
        setEditEventLocation(target.Location || "");
        setEditEventCategory(target.Category || "Not-Important");

        // Set separate start and end parameters
        setEditEventStartDate(formatDate(startDate));
        setEditEventStartTime(formatTime(startDate));
        setEditEventEndDate(formatDate(endDate));
        setEditEventEndTime(formatTime(endDate));

        setEditEventModal({ isOpen: true, targetEvent: target });
        setMenuSettings({ ...menuSettings, visible: false });
    };

    // Rebuilds raw strings back into accurate multi-day UNIX timestamps
    const saveEditedEvent = () => {
        const [sYear, sMonth, sDay] = editEventStartDate.split('-').map(Number);
        const [startH, startM] = editEventStartTime.split(':').map(Number);

        const [eYear, eMonth, eDay] = editEventEndDate.split('-').map(Number);
        const [endH, endM] = editEventEndTime.split(':').map(Number);

        const finalStartTime = new Date(sYear, sMonth - 1, sDay, startH, startM).getTime();
        const finalEndTime = new Date(eYear, eMonth - 1, eDay, endH, endM).getTime();

        const updatedList = EventContent.map(event => {
            if (event.id === editEventModal.targetEvent.id) {
                return {
                    ...event,
                    Title: editEventTitle,
                    Location: editEventLocation,
                    Category: editEventCategory,
                    Time: finalStartTime,
                    EndTime: finalEndTime
                };
            }
            return event;
        });

        setEventContent(updatedList);
        // localStorage.setItem("EventContent", JSON.stringify(updatedList));
        setEditEventModal({ isOpen: false, targetEvent: null });
    };

    const isTimeReversed = () => {
        if (!editEventStartDate || !editEventStartTime || !editEventEndDate || !editEventEndTime) return false;

        const [sYear, sMonth, sDay] = editEventStartDate.split('-').map(Number);
        const [startH, startM] = editEventStartTime.split(':').map(Number);
        const [eYear, eMonth, eDay] = editEventEndDate.split('-').map(Number);
        const [endH, endM] = editEventEndTime.split(':').map(Number);

        return new Date(sYear, sMonth - 1, sDay, startH, startM).getTime() > new Date(eYear, eMonth - 1, eDay, endH, endM).getTime();
    };

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
                if (e && typeof e.button !== "undefined" && e.button !== 0) return;
                if (menuSettings.visible) setMenuSettings({ ...menuSettings, visible: false });
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
                            <h2>{ViewCalendar.getFullYear()} - {monthNames[ViewCalendar.getMonth()]}</h2>
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
                                            <div key={event.id} className={`cal-upcoming-item ${event.Category}`}
                                                onContextMenu={(e) => HandleContextMenu(e, "event", event.id)}>
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
                            <button className="delete-action" onClick={() => setMenuSettings({ ...menuSettings, visible: false })}>Delete All Event</button>
                        </>
                    ) : menuSettings.type === "event" ? (
                        <>
                            <button onClick={ModalEditEventOpen}>Edit Details</button>
                            <button onClick={() => setMenuSettings({ ...menuSettings, visible: false })}>Reschedule Time</button>
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

            {/* Edit Multi-Day Event Details Modal */}
            {editEventModal.isOpen && (
                <div className="modal-backdrop">
                    <div className="edit-modal-card">
                        <div className="modal-header">
                            <h2>Edit Event Details</h2>
                            <button onClick={() => setEditEventModal({ isOpen: false, targetEvent: null })}>✕</button>
                        </div>
                        <div className="modal-body">
                            <label>Event Title</label>
                            <input
                                type="text"
                                value={editEventTitle}
                                onChange={(e) => setEditEventTitle(e.target.value)}
                            />

                            <label>Location</label>
                            <input
                                type="text"
                                value={editEventLocation}
                                onChange={(e) => setEditEventLocation(e.target.value)}
                            />

                            <label>Category Priority</label>
                            <select
                                className="Multiple-Choices"
                                value={editEventCategory}
                                onChange={(e) => setEditEventCategory(e.target.value)}
                            >
                                <option value="Not-Important">Not Important</option>
                                <option value="Somewhat-Important">Somewhat Important</option>
                                <option value="Important">Important</option>
                            </select>

                            {/* Side-by-Side Start & End Configuration Matrix */}
                            <div style={{ display: "flex", gap: "16px", width: "100%", marginTop: "10px" }}>
                                {/* START COLUMN */}
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <span style={{ fontWeight: "bold", fontSize: "0.85rem", opacity: 0.7 }}>START</span>
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={editEventStartDate}
                                        onChange={(e) => setEditEventStartDate(e.target.value)}
                                    />
                                    <label>Time</label>
                                    <input
                                        type="time"
                                        value={editEventStartTime}
                                        onChange={(e) => setEditEventStartTime(e.target.value)}
                                    />
                                </div>

                                {/* END COLUMN */}
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <span style={{ fontWeight: "bold", fontSize: "0.85rem", opacity: 0.7 }}>END</span>
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={editEventEndDate}
                                        onChange={(e) => setEditEventEndDate(e.target.value)}
                                    />
                                    <label>Time</label>
                                    <input
                                        type="time"
                                        value={editEventEndTime}
                                        onChange={(e) => setEditEventEndTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="modal-actions" style={{ marginTop: "20px" }}>
                                <button onClick={() => setEditEventModal({ isOpen: false, targetEvent: null })}>Cancel</button>
                                <button className="save-btn" onClick={saveEditedEvent}
                                    disabled={isTimeReversed()}
                                    style={{ opacity: isTimeReversed() ? 0.5 : 1, cursor: isTimeReversed() ? "not-allowed" : "pointer" }}>
                                    {isTimeReversed() ? "Invalid Interval" : "Save Changes"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}