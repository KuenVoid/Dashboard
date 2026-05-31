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

    // All Events Actions
    const [formModal, setFormModal] = useState({ isOpen: false, mode: null, targetEvent: null });
    const [formTitle, setFormTitle] = useState("");
    const [formLocation, setFormLocation] = useState("");
    const [formCategory, setFormCategory] = useState("Not-Important");
    const [formStartDate, setFormStartDate] = useState("");
    const [formStartTime, setFormStartTime] = useState("");
    const [formEndDate, setFormEndDate] = useState("");
    const [formEndTime, setFormEndTime] = useState("");

    const isFormTimeReversed = () => {
        if (!formStartDate || !formStartTime || !formEndDate || !formEndTime) return false;
        const [sYear, sMonth, sDay] = formStartDate.split('-').map(Number);
        const [startH, startM] = formStartTime.split(':').map(Number);
        const [eYear, eMonth, eDay] = formEndDate.split('-').map(Number);
        const [endH, endM] = formEndTime.split(':').map(Number);

        return new Date(sYear, sMonth - 1, sDay, startH, startM).getTime() > new Date(eYear, eMonth - 1, eDay, endH, endM).getTime();
    };
    
    const saveFormChanges = () => {
        const [sYear, sMonth, sDay] = formStartDate.split('-').map(Number);
        const [startH, startM] = formStartTime.split(':').map(Number);
        const [eYear, eMonth, eDay] = formEndDate.split('-').map(Number);
        const [endH, endM] = formEndTime.split(':').map(Number);

        const finalStartTime = new Date(sYear, sMonth - 1, sDay, startH, startM).getTime();
        const finalEndTime = new Date(eYear, eMonth - 1, eDay, endH, endM).getTime();

        // Check Reverse
        if (finalStartTime > finalEndTime) {
            return;
        }

        let updatedList;

        if (formModal.mode === "edit") {
            // OVERWRITE MODE: Updates matching item details
            updatedList = EventContent.map(event => {
                if (event.id === formModal.targetEvent.id) {
                    return {
                        ...event,
                        Title: formTitle || "Untitled Event",
                        Location: formLocation,
                        Category: formCategory,
                        Time: finalStartTime,
                        EndTime: finalEndTime
                    };
                }
                return event;
            });
        } else if (formModal.mode === "duplicate") {
            // DUPLICATE MODE: Creates and appends a brand new clone block
            const newClonedEvent = {
                id: `c${Date.now()}`,
                Title: formTitle || "Untitled Event Copy",
                Location: formLocation,
                Category: formCategory,
                Time: finalStartTime,
                EndTime: finalEndTime
            };
            updatedList = [...EventContent, newClonedEvent];
        } else if (formModal.mode === "create") {
            // CREATE MODE: Instantiates a completely brand new standalone event
            const newEvent = {
                id: `e${Date.now()}`,
                Title: formTitle || "New Event",
                Location: formLocation,
                Category: formCategory,
                Time: finalStartTime,
                EndTime: finalEndTime
            };
            updatedList = [...EventContent, newEvent];
        }

        setEventContent(updatedList);
        // localStorage.setItem("EventContent", JSON.stringify(updatedList));
        setFormModal({ isOpen: false, mode: null, targetEvent: null });
    };

    // Universal Form Unpacker
    const openFormModal = (modeType) => {
        const formatDate = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const formatTime = (d) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');

        if (modeType === "create") {
            // Build clean template times based on the current active SelectedDate anchor
            const defaultDate = SelectedDate ? new Date(SelectedDate) : new Date();
            const startPlaceholder = new Date(defaultDate.getFullYear(), defaultDate.getMonth(), defaultDate.getDate(), 9, 0);  // 09:00
            const endPlaceholder = new Date(defaultDate.getFullYear(), defaultDate.getMonth(), defaultDate.getDate(), 10, 0); // 10:00

            setFormTitle("");
            setFormLocation("");
            setFormCategory("Not-Important");
            setFormStartDate(formatDate(startPlaceholder));
            setFormStartTime(formatTime(startPlaceholder));
            setFormEndDate(formatDate(endPlaceholder));
            setFormEndTime(formatTime(endPlaceholder));

            setFormModal({ isOpen: true, mode: "create", targetEvent: null });
        } else {
            const target = EventContent.find(e => e.id === menuSettings.targetId);
            if (!target) return;

            const startDate = new Date(target.Time);
            const endDate = new Date(target.EndTime);

            setFormTitle(modeType === "duplicate" ? `${target.Title} (Copy)` : target.Title);
            setFormLocation(target.Location || "");
            setFormCategory(target.Category || "Not-Important");
            setFormStartDate(formatDate(startDate));
            setFormStartTime(formatTime(startDate));
            setFormEndDate(formatDate(endDate));
            setFormEndTime(formatTime(endDate));

            setFormModal({ isOpen: true, mode: modeType, targetEvent: target });
        }

        setMenuSettings({ ...menuSettings, visible: false });
    };

    // Delete Event(s)
    const deleteSingleEvent = () => {
        const targetId = menuSettings.targetId;
        if (!targetId) return;

        const updatedList = EventContent.filter(event => event.id !== targetId);
        setEventContent(updatedList);
        // localStorage.setItem("EventContent", JSON.stringify(updatedList)); // Ready when you are
        setMenuSettings({ ...menuSettings, visible: false });
    };

    const deleteAllEventsOnDay = () => {
        const targetDay = menuSettings.targetId;
        if (!targetDay) return;

        const dayStartBoundary = new Date(ViewCalendar.getFullYear(), ViewCalendar.getMonth(), targetDay, 0, 0, 0, 0).getTime();
        const dayEndBoundary = new Date(ViewCalendar.getFullYear(), ViewCalendar.getMonth(), targetDay, 23, 59, 59, 999).getTime();

        const updatedList = EventContent.filter(event => {
            const overlapsWithDay = event.Time <= dayEndBoundary && event.EndTime >= dayStartBoundary;
            return !overlapsWithDay;
        });

        setEventContent(updatedList);
        // localStorage.setItem("EventContent", JSON.stringify(updatedList)); // Ready when you are
        setMenuSettings({ ...menuSettings, visible: false });
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
                        <div className="cal-side-content" onContextMenu={(e) => HandleContextMenu(e, "upcoming-panel", "new-event")}>
                            {SelectedDate ? (
                                previewEvents.length > 0 ? (
                                    previewEvents.sort((a, b) => a.Time - b.Time)
                                        .map((event) => (
                                            <div key={event.id} className={`cal-upcoming-item ${event.Category}`}
                                                onContextMenu={(e) => { e.stopPropagation(); HandleContextMenu(e, "event", event.id) }}>
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
                            <button className="delete-action" onClick={deleteAllEventsOnDay}>Delete All Events</button>
                        </>
                    ) : menuSettings.type === "event" ? (
                        <>
                            {/* Restored to route straight to the unified form architecture */}
                            <button onClick={() => openFormModal("edit")}>Edit Details</button>
                            <button onClick={() => openFormModal("duplicate")}>Duplicate Event</button>
                            <hr className="menu-divider" />
                            <button className="delete-action" onClick={deleteSingleEvent}>Delete Event</button>
                        </>
                    ) : menuSettings.type === "upcoming-panel" ? (
                        <>
                            <button onClick={() => openFormModal("create")}>Add New Event</button>
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
            {formModal.isOpen && (
                <div className="modal-backdrop">
                    <div className="edit-modal-card">
                        <div className="modal-header">
                            <h2>
                                {formModal.mode === "edit" && "Edit Event Details"}
                                {formModal.mode === "duplicate" && "Duplicate & Adjust Event"}
                                {formModal.mode === "create" && "Add New Event"}
                            </h2>
                            <button onClick={() => setFormModal({ isOpen: false, mode: null, targetEvent: null })}>✕</button>
                        </div>
                        <div className="modal-body">
                            <label>Event Title</label>
                            <input
                                type="text"
                                value={formTitle}
                                placeholder={formModal.mode === "create" ? "Enter event title..." : ""}
                                onChange={(e) => setFormTitle(e.target.value)}
                            />

                            <label>Location</label>
                            <input
                                type="text"
                                value={formLocation}
                                placeholder={formModal.mode === "create" ? "e.g., Zoom, Office, Room 101" : ""}
                                onChange={(e) => setFormLocation(e.target.value)}
                            />

                            <label>Category Priority</label>
                            <select className="Multiple-Choices" value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                                <option value="Not-Important">Not Important</option>
                                <option value="Somewhat-Important">Somewhat Important</option>
                                <option value="Very-Important">Very Important</option>
                            </select>

                            {isFormTimeReversed() && (
                                <span style={{
                                    color: "#ff4d4d", fontSize: "0.85rem", fontWeight: "bold", marginTop: "10px",
                                    display: "block", backgroundColor: "rgba(255, 77, 77, 0.1)", padding: "6px 10px", borderRadius: "4px"
                                }}>
                                    ⚠ Error: End date/time cannot be earlier than start date/time.
                                </span>
                            )}

                            <div style={{ display: "flex", gap: "16px", width: "100%", marginTop: "10px" }}>
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <span style={{ fontWeight: "bold", fontSize: "0.85rem", opacity: 0.7 }}>START</span>
                                    <label>Date</label>
                                    <input type="date" value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} />
                                    <label>Time</label>
                                    <input type="time" value={formStartTime} onChange={(e) => setFormStartTime(e.target.value)} />
                                </div>
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <span style={{ fontWeight: "bold", fontSize: "0.85rem", opacity: 0.7 }}>END</span>
                                    <label>Date</label>
                                    <input type="date" value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} />
                                    <label>Time</label>
                                    <input type="time" value={formEndTime} onChange={(e) => setFormEndTime(e.target.value)} />
                                </div>
                            </div>

                            <div className="modal-actions" style={{ marginTop: "20px" }}>
                                <button onClick={() => setFormModal({ isOpen: false, mode: null, targetEvent: null })}>Cancel</button>
                                <button
                                    className="save-btn" onClick={saveFormChanges} disabled={isFormTimeReversed()}
                                    style={{
                                        opacity: isFormTimeReversed() ? 0.4 : 1,
                                        cursor: isFormTimeReversed() ? "not-allowed" : "pointer", transition: "all 0.2s ease"
                                    }}
                                >
                                    {isFormTimeReversed() ? (
                                        "Invalid Interval"
                                    ) : (
                                        <>
                                            {formModal.mode === "edit" && "Save Changes"}
                                            {formModal.mode === "duplicate" && "Create Clone"}
                                            {formModal.mode === "create" && "Add Event"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}