import React, { useState } from "react";
import "../Style_Sheets/Home.css";

export default function Home({ username, log_msg }) {
    const [menuSettings, setMenuSettings] = useState({ visible: false, x: 0, y: 0, targetCategory: null });
    const [editModal, setEditModal] = useState({ isOpen: false, targetMetric: null });
    const [editPerc, setEditPerc] = useState(0);
    const [editTitle, setEditTitle] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [createModal, setcreateModal] = useState({ isOpen: false });
    const [newPerc, setNewPerc] = useState(0);
    const [newTitle, setNewTitle] = useState('New Goal');
    const [newStatus, setNewStatus] = useState('Stable');

    const [CompletedGoal, setCompletedGoal] = useState(() => {
        const num_of_goal = localStorage.getItem("Goal_Completed");
        return num_of_goal ? JSON.parse(num_of_goal) : 0;
    });
    const [GoalMetrics, setGoalMetrics] = useState(() => {
        const savedData = localStorage.getItem("dashboard_Goal_metrics");
        return savedData ? JSON.parse(savedData) : [];
    });

    // Start Right Click Function
    const handleRightClick = (e, metricObj) => {
        e.stopPropagation();
        e.preventDefault();
        const menuHeight = (metricObj) ? 165 : 95;
        const viewportHeight = window.innerHeight;
        const y_cord = (e.clientY + menuHeight > viewportHeight) ? e.clientY - menuHeight : e.clientY;

        setMenuSettings({
            visible: true,
            x: e.clientX,
            y: y_cord,
            targetCategory: metricObj
        });
    };
    const closeMenu = (e) => {
        if (e && typeof e.button !== "undefined" && e.button !== 0) return;
        if (menuSettings.visible) { setMenuSettings({ ...menuSettings, visible: false }); }
    };
    const ContextMenuCloseOnCLick = () => {
        setMenuSettings({ ...menuSettings, visible: false });
    };
    const ModalEditOpen = () => {
        setEditPerc(menuSettings.targetCategory.percentage); // Set Percentage value
        setEditTitle(menuSettings.targetCategory.title); // Set Title value
        setEditModal({
            isOpen: true,
            targetMetric: menuSettings.targetCategory
        });
        setMenuSettings({ ...menuSettings, visible: false });
    };

    const ModalCreateOpen = () => {
        setcreateModal({ isOpen: true });
        setMenuSettings({ ...menuSettings, visible: false });
    };

    // Storage Management
    const saveGoal = (currentGoalMetrics) => {
        localStorage.setItem("dashboard_Goal_metrics", JSON.stringify(currentGoalMetrics));
    };
    const changeGoal = () => {
        const updatedGoal = { ...editModal.targetMetric, title: editTitle, status: editStatus, percentage: editPerc };
        const updatedList = GoalMetrics.map(Specific_Goal => {
            return Specific_Goal.id === updatedGoal.id ? updatedGoal : Specific_Goal;
        });
        setGoalMetrics(updatedList);
        saveGoal(updatedList);
        setEditModal({ isOpen: false, targetMetric: null });
    }
    const AppendGoal = () => {
        const newgoal = {
            id: `p${Date.now()}`,
            title: newTitle,
            percentage: newPerc,
            status: newStatus
        }
        const updatedList = [...GoalMetrics, newgoal];
        setGoalMetrics(updatedList);
        setcreateModal({ isOpen: false });
        saveGoal(updatedList);
    }
    const DelGoal = (id) => {
        const updatedList = GoalMetrics.filter((metric) => metric.id !== id);
        setGoalMetrics(updatedList);
        saveGoal(updatedList);
        setMenuSettings({ ...menuSettings, visible: false });
    }
    const CompGoal = (id) => {
        const newTotal = CompletedGoal + 1;
        setCompletedGoal(newTotal);
        localStorage.setItem("Goal_Completed", newTotal);
        DelGoal(id);
    }

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
                        <h2>Today's Calendar</h2>
                    </div>
                </div>
                {/* This is the goal session */}
                <div className="dash-card Goal-card" onContextMenu={(e) => { handleRightClick(e, null) }}>
                    <h2>Progress Bar</h2>

                    <div className="goal-group">
                        {GoalMetrics.map((metric) => {
                            return (
                                <div key={metric.id} className="goal-item"
                                    onContextMenu={(e) => { handleRightClick(e, metric) }}>
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
                <div className="dash-card todo-card">
                    <div className="todo-stat">
                        <h2>Important Todo</h2>
                    </div>
                </div>
            </div>
            {/* Context Menu */}
            {menuSettings.visible && (
                <div className="custom-context-menu" style={{ top: `${menuSettings.y}px`, left: `${menuSettings.x}px` }}>
                    {menuSettings.targetCategory ? (
                        <>
                            <button onClick={ModalEditOpen}>Edit {menuSettings.targetCategory?.title || "Goal"}</button>
                            <button onClick={() => CompGoal(menuSettings.targetCategory.id)}>Mark as Completed</button>
                            <button className="delete-action" onClick={() => DelGoal(menuSettings.targetCategory.id)}>
                                Delete Progress Line</button>
                        </>
                    ) : (
                        /* If targetCategory is null */
                        <button onClick={ModalCreateOpen}>Add New Progress Line</button>
                    )}
                    <hr className="menu-divider" />
                    <button onClick={closeMenu}>Cancel</button>
                </div>
            )}
            {/* Edit Menu */}
            {editModal.isOpen && (
                <div className="modal-backdrop">
                    <div className="edit-modal-card">
                        <div className="modal-header">
                            <h2>Edit Goal</h2>
                            <button onClick={() => setEditModal({ ...editModal, isOpen: false })}>✕</button>
                        </div>
                        <div className="modal-body">
                            <input type="text" value={editTitle}
                                onChange={(e) => setEditTitle(String(e.target.value))} />
                            <select id="StatusChoice" className="Multiple-Choices" value={editStatus}
                                onChange={(e) => setEditStatus(String(e.target.value))}>
                                <option value="Good">Good</option>
                                <option value="Stable">Stable</option>
                                <option value="Bad">Bad</option>
                            </select>

                            <label>New Percentage ({editPerc}%)</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={editPerc} // Bind the state value
                                onChange={(e) => setEditPerc(Number(e.target.value))} // Update state on change
                            />

                            <div className="modal-actions">
                                <button onClick={() => setEditModal({ ...editModal, isOpen: false })}>Cancel</button>
                                <button className="save-btn" onClick={changeGoal}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {createModal.isOpen && (
                <div className="modal-backdrop">
                    <div className="edit-modal-card">
                        <div className="modal-header">
                            <h2>Append Goal</h2>
                            <button onClick={() => setcreateModal({ ...editModal, isOpen: false })}>✕</button>
                        </div>
                        <div className="modal-body">
                            <input type="text" value={newTitle}
                                onChange={(e) => setNewTitle(String(e.target.value))} />
                            <select id="StatusChoice" className="Multiple-Choices" value={newStatus}
                                onChange={(e) => setNewStatus(String(e.target.value))}>
                                <option value="Good">Good</option>
                                <option value="Stable">Stable</option>
                                <option value="Bad">Bad</option>
                            </select>

                            <label>New Percentage ({newPerc}%)</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={newPerc} // Bind the state value
                                onChange={(e) => setNewPerc(Number(e.target.value))} // Update state on change
                            />

                            <div className="modal-actions">
                                <button onClick={() => setcreateModal({ ...editModal, isOpen: false })}>Cancel</button>
                                <button className="save-btn" onClick={AppendGoal}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}