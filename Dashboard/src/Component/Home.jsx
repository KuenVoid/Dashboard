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


  const [GoalMetrics, setGoalMetrics] = useState(() => {
    const savedData = localStorage.getItem("dashboard_Goal_metrics");
    
    return savedData ? JSON.parse(savedData) : [];
  });

  return (
    <div className="home-container">
      <header className="home-header"><h1 className="welcome-title">Home</h1></header>
      <div className="dashboard-grid">

        {/* This is the welcome block */}
        <div className="dash-card welcome-card">
          <h2>Welcome to your Dashboard, {username}</h2>
          <h3>{log_msg}</h3>
        </div>

        {/* This is the summary block */}
        <div className="dash-card summary-card">
          <div className="summary-stat">
            <h2>Placeholder</h2>
          </div>
        </div>
        {/* This is the goal session */}
        <div className="dash-card Goal-card">
          <h2>Progress Bar</h2>

          <div className="goal-group">
            {GoalMetrics.map((metric) => { return (
            <div key={metric.id} className="goal-item">
              <div className="goal-labels">
                <span>{metric.title}</span>
                <span className={`status-${metric.status}`}>
                  {metric.percentage}% | {metric.status}
                </span>
              </div>

              <div className="goal-bar-bg">
                <div 
                  className="goal-bar-fill" 
                  style={{ width: `${metric.percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
          </div>
        </div>
      </div>
    </div>
  );
}