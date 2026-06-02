import React, { useState } from "react";
import "../Style_Sheets/Settings.css";

const themes = ["Space-Black", "Abyss-Deep-Blue", "Nordic-Frost", "Cyberpunk-Neon", "Earthy-Sage",
    "Crimson", "Retro-Terminal", "Amethyst-Dark", "Obsidian-Volt", "Cyber-Emerald", "Pinky-Rose",
    "Pink-Blossom", "Matcha-Blossom", "Nordic-Winter", "Minimal-Alabaster", "Latte-Macchiato"];

export default function Settings({ currentTheme, setcurrentTheme, sidebarwidth,
    dashboardTitle, setDashboardTitle, username, setusername, log_msg, setlog_msg }) {
    const [email, setEmail] = useState("user@example.com");
    const [TitleValid, setTitleValid] = useState(true);
    const [usernameValid, setusernameValid] = useState(true);
    const [toggles, setToggles] = useState({
        showSparkkCharts: false,
        showProgressBars: true,
        showActionableGoals: true,
    });

    const handleToggle = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };
    const TextCheck = (val, type) => {
        if (type == "log_msg") {
            setlog_msg(val);
            localStorage.setItem("log_msg", val);
        } else if (val.length <= 16) {
            if (type == "Title") {
                if (!TitleValid) setTitleValid(true);
                setDashboardTitle(val);
                localStorage.setItem("Title", val);
            } else if (type == "username") {
                if (!usernameValid) setusernameValid(true);
                setusername(val);
                localStorage.setItem("username", val);
            }
        } else {
            if (type == "Title") {
                setTitleValid(false);
            } else if (type == "username") {
                setusernameValid(false);
            }
        }
    }
    const handleClear = () => {
        localStorage.clear();
        window.location.reload();
    }

    return (
        <div className="settings-container">
            <header className="settings-header">
                <h1 className="settings-title">Account & Application Settings</h1>
            </header>

            <div className="settings-grid">
                {/* Top Left: Profile & Sync */}
                <div className="set-card profile-card">
                    <h2>Profile</h2>

                    <div className="profile-info-section">
                        <div className="profile-inputs">
                            <div className="input-group">
                                <label>Username</label>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => TextCheck(e.target.value, "username")}
                                    />
                                    {!usernameValid && <h3>Length Too Long</h3>}
                                    <span className="edit-icon">✎</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Log Message</label>
                                <input
                                    type="text"
                                    value={log_msg}
                                    onChange={(e) => TextCheck(e.target.value, "log_msg")} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Right: Calendar Sync */}
                <div className="set-card calendar-card">
                    <div className="sync-section">
                        <h3>Data Management</h3>
                        <button className="danger-btn" onDoubleClick={handleClear}>Reset to Default Settings</button>
                    </div>
                </div>

                {/* Bottom Left: App Customization */}
                <div className="set-card customization-card">
                    <h2>App Customization</h2>
                    <div className="customization-columns">
                        <div className="custom-col">
                            <h3>Appearance</h3>
                            <div className="toggle-row">
                                <h3>Theme: </h3>
                                <select className="settings-select" id="theme-select" value={currentTheme}
                                    onChange={(e) => setcurrentTheme(e.target.value)}>
                                    {themes.map((T) => (
                                        <option key={T} value={T}>{T.replace("-", " ")}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="custom-col">
                            <h3>SideBar Width</h3>
                            <p className="info-text">Width: {sidebarwidth}vw</p>

                            <div className="input-group mt-15">
                                <label>Dashboard Title</label>
                                <input
                                    type="text"
                                    value={dashboardTitle}
                                    onChange={(e) => TextCheck(e.target.value, "Title")}
                                />
                                {!TitleValid && <h3>Length Too Long</h3>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}