import React, { useState } from "react";
import "../Style_Sheets/Home.css";

export default function Home() {
  const [username, setusername] = useState(
    localStorage.getItem("username") || "User"
  );
  const [log_msg, setlog_msg] = useState(
    localStorage.getItem("log_msg") || "Where you can easily manage your progress, \
    streamline daily metrics, and track actionable objectives with tailored analytical insights."
  );
  const [menuSettings, setMenuSettings] = useState({visible: false, x: 0, y: 0, targetCategory: null});
  const [editModal, setEditModal] = useState({ isOpen: false, targetMetric: null });
  const [editVal, setEditVal] = useState(0);

  const [GoalMetrics, setGoalMetrics] = useState(() => {
    const savedData = localStorage.getItem("dashboard_Goal_metrics");
    
    return savedData ? JSON.parse(savedData) : [
      { id: "p1", title: "Project Alpha", percentage: 85, status: "good" },
      { id: "p2", title: "Core Infrastructure", percentage: 60, status: "good" },
      { id: "p3", title: "Beta Program", percentage: 45, status: "stable" }
    ];
  });

  // Start Right Click Function
  const handleRightClick = (e, metricObj) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuSettings({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetCategory: metricObj
    });
  };
  const closeMenu = (e) => {
    if (e && typeof e.button !== "undefined" && e.button !== 0) return;
    if(menuSettings.visible){setMenuSettings({ ...menuSettings, visible: false });} // DEL
  };
  const ContextMenuCloseOnCLick = () => {
    setMenuSettings({ ...menuSettings, visible: false });
  };
  const ModalEditOpen = () => {
  setEditVal(menuSettings.targetCategory.percentage); // Set starting value
  setEditModal({
    isOpen: true,
    targetMetric: menuSettings.targetCategory
  });
  setMenuSettings({ ...menuSettings, visible: false });
};

  return (
    <div className="home-container" onClick={(e) => closeMenu(e)}>
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
            <div key={metric.id} className="goal-item"
            onContextMenu={(e) => {handleRightClick(e, metric)}}>
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
      {/* Context Menu */}
      {menuSettings.visible && (
      <div 
        className="custom-context-menu"
        style={{ top: `${menuSettings.y}px`, left: `${menuSettings.x}px`}}>
        <button onClick={ModalEditOpen}>Edit {menuSettings.targetCategory?.title || "Goal"}</button>
        <button onClick={ContextMenuCloseOnCLick}>Duplicate Bar</button>
        <button className="delete-action" onClick={ContextMenuCloseOnCLick}>Delete Progress Line</button>
        <hr className="menu-divider" />
        <button onClick={closeMenu}>Cancel</button>
      </div>)}
      {/* Edit Menu */}
      {editModal.isOpen && (
      <div className="modal-backdrop">
        <div className="edit-modal-card">
          <div className="modal-header">
            <h2>Edit Goal</h2>
            <button onClick={() => setEditModal({ ...editModal, isOpen: false })}>✕</button>
          </div>
          <div className="modal-body">
            <input type="text" defaultValue={editModal.targetMetric?.title} />
            
            <label>New Percentage ({editVal}%)</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={editVal} // Bind the state value
              onChange={(e) => setEditVal(Number(e.target.value))} // Update state on change
            />
            
            <div className="modal-actions">
              <button onClick={() => setEditModal({ ...editModal, isOpen: false })}>Cancel</button>
              <button className="save-btn">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}