import React, { useState } from "react";
import "../Style_Sheets/Home.css";

export default function Home() {
  const [username, setusername] = useState(
    localStorage.getItem("username") || "User"
  );
  const [log_msg, setlog_msg] = useState(
    localStorage.getItem("log_msg") || "Where you can easily manage your progress, streamline daily metrics, \
    and track actionable objectives with tailored analytical insights."
  );
  return (
    <div className="home-container">
      <header className="home-header"><h1 className="welcome-title">Home</h1></header>
      <div className="dashboard-grid">
        <div className="dash-card welcome-card">
          <h2>Welcome to your Dashboard, {username}</h2>
          <h2>{log_msg}</h2>
        </div>
      </div>
    </div>
  );
}