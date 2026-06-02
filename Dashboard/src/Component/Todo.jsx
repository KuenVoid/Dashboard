import React, { useState, useEffect } from "react";
import "../Style_Sheets/Todo.css";

export default function Todo({ todos, setTodos }) {
    const [quickAddText, setQuickAddText] = useState("");
    const [menuSettings, setMenuSettings] = useState({ visible: false, x: 0, y: 0, targetId: null });
    const [formModal, setFormModal] = useState({ isOpen: false, mode: null, targetId: null });

    // Form States
    const [formTitle, setFormTitle] = useState("");
    const [formDate, setFormDate] = useState("");
    const [formCategory, setFormCategory] = useState("Personal");
    const [formPriority, setFormPriority] = useState("Low");
    const [formStatus, setFormStatus] = useState("Pending");

    const handleContextMenu = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        const menuHeight = 125;
        const y_cord = (e.clientY + menuHeight > window.innerHeight) ? e.clientY - menuHeight : e.clientY;
        setMenuSettings({ visible: true, x: e.clientX, y: y_cord, targetId: id });
    };

    const closeMenu = (e) => {
        if (e && typeof e.button !== "undefined" && e.button !== 0) return;
        if (menuSettings.visible) setMenuSettings({ ...menuSettings, visible: false });
    };

    const handleQuickAdd = () => {
        if (!quickAddText.trim()) return;
        const newTask = {
            id: `t${Date.now()}`,
            title: quickAddText,
            date: new Date().toISOString().split('T')[0],
            category: "Personal",
            priority: "Medium",
            status: "Pending"
        };
        setTodos([...todos, newTask]);
        setQuickAddText("");
    };

    const toggleStatus = (id) => {
        setTodos(todos.map(t => {
            if (t.id === id) return { ...t, status: t.status === "Completed" ? "Pending" : "Completed" };
            return t;
        }));
        setMenuSettings({ ...menuSettings, visible: false });
    };

    const deleteTask = (id) => {
        setTodos(todos.filter(t => t.id !== id));
        setMenuSettings({ ...menuSettings, visible: false });
    };

    const openModal = (mode, id = null) => {
        if (mode === "edit" && id) {
            const target = todos.find(t => t.id === id);
            setFormTitle(target.title);
            setFormDate(target.date);
            setFormCategory(target.category);
            setFormPriority(target.priority);
            setFormStatus(target.status);
        } else {
            setFormTitle("");
            setFormDate(new Date().toISOString().split('T')[0]);
            setFormCategory("Work");
            setFormPriority("Medium");
            setFormStatus("Pending");
        }
        setFormModal({ isOpen: true, mode, targetId: id });
        setMenuSettings({ ...menuSettings, visible: false });
    };

    const saveForm = () => {
        if (!formTitle.trim()) return;

        if (formModal.mode === "edit") {
            setTodos(todos.map(t => t.id === formModal.targetId ? {
                ...t, title: formTitle, date: formDate, category: formCategory, priority: formPriority, status: formStatus
            } : t));
        } else {
            setTodos([...todos, {
                id: `t${Date.now()}`, title: formTitle, date: formDate, category: formCategory, priority: formPriority, status: formStatus
            }]);
        }
        setFormModal({ isOpen: false, mode: null, targetId: null });
    };

    const stats = {
        total: todos.length,
        completed: todos.filter(t => t.status === "Completed").length,
        pending: todos.filter(t => t.status !== "Completed").length,
        overdue: todos.filter(t => t.status !== "Completed" && new Date(t.date) < new Date(new Date().setHours(0, 0, 0, 0))).length
    };

    // Filtering
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const filteredTodos = todos.filter(task => {
        const matchesCategory = filterCategory === "All" || task.category === filterCategory;
        const matchesStatus = filterStatus === "All" || task.status === filterStatus;
        return matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
        if(a.status !== b.status) return a.status === "Completed" ? 1: -1;
        return new Date(a.date) - new Date(b.date);
    });

    // Multi-Select Tasks
    const [SelectedTask, setSelectedTask] = useState([]);
    const [LastSelect, setLastSelect] = useState(null);

    const handleRowSelect = (e, id) => {
        if (e.button !== 0) return;
        const currentIndex = filteredTodos.findIndex(task => task.id === id);

        if (e.shiftKey && LastSelect !== null) {
            const start = Math.min(LastSelect, currentIndex);
            const end = Math.max(LastSelect, currentIndex);
            const rangeIds = filteredTodos.slice(start, end + 1).map(t => t.id);
            setSelectedTask(Array.from(new Set([...SelectedTask, ...rangeIds])));
        } else if (e.ctrlKey || e.metaKey) {
            if (SelectedTask.includes(id)) {
                setSelectedTask(SelectedTask.filter(taskId => taskId !== id));
            } else {
                setSelectedTask([...SelectedTask, id]);
            }
            setLastSelect(currentIndex);
        } else {
            setSelectedTask([id]);
            setLastSelect(currentIndex);
        }
    }

    const multidelete = () => {
        setTodos(todos.filter(t => !SelectedTask.includes(t.id)));
        setSelectedTask([]);
    }

    useEffect(() => {
        localStorage.setItem("dashboard_todos", JSON.stringify(todos));
    }, [todos]);

    return (
        <div className="todo-container" onClick={closeMenu}>
            <header className="todo-header">
                <h1 className="welcome-title">Tasks & Todos</h1>
            </header>

            <div className="todo-layout-grid">
                {/* Left Column: Main Table */}
                <div className="dash-card todo-main-card">
                    <div className="card-header-inline">
                        <h2>All Todos</h2>
                        <button className="outline-btn small-btn" onClick={() => openModal("create")}>+ New Task</button>
                    </div>

                    <div className="todo-table-wrapper">
                        <table className="todo-table">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Task Name</th>
                                    <th>Due Date</th>
                                    <th>Category</th>
                                    <th>Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTodos.map(task => (
                                    <tr
                                        key={task.id}
                                        className={`${task.status === "Completed" ? "row-completed" : ""} ${SelectedTask.includes(task.id) ? "row-selected" : ""}`}
                                        onContextMenu={(e) => handleContextMenu(e, task.id)}
                                        onClick={e => handleRowSelect(e, task.id)}
                                    >
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={task.status === "Completed"}
                                                onChange={() => toggleStatus(task.id)}
                                                className="todo-checkbox"
                                            />
                                        </td>
                                        <td className="task-title">{task.title}</td>
                                        <td className="task-date">{task.date}</td>
                                        <td><span className={`todo-badge cat-badge`}>{task.category}</span></td>
                                        <td><span className={`todo-badge pri-${task.priority.toLowerCase()}`}>{task.priority}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {todos.length === 0 && <p className="empty-state">No tasks found. Add one to get started!</p>}
                    </div>
                </div>

                {/* Right Column: Stats & Add */}
                <div className="todo-side-panels">
                    {/* Stats Card */}
                    <div className="dash-card todo-stats-card">
                        <h2>Statistics</h2>
                        <div className="todo-stats-grid">
                            <div className="t-stat-box box-total">
                                <span className="t-stat-label">Total Tasks</span>
                                <span className="t-stat-value">{stats.total}</span>
                            </div>
                            <div className="t-stat-box box-completed">
                                <span className="t-stat-label">Completed</span>
                                <span className="t-stat-value">{stats.completed}</span>
                            </div>
                            <div className="t-stat-box box-pending">
                                <span className="t-stat-label">Pending</span>
                                <span className="t-stat-value">{stats.pending}</span>
                            </div>
                            <div className="t-stat-box box-overdue">
                                <span className="t-stat-label">Overdue</span>
                                <span className="t-stat-value">{stats.overdue}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Add Card */}
                    <div className="dash-card quick-add-card">
                        <h2>Quick Add</h2>
                        <div className="quick-add-group">
                            <input
                                type="text"
                                placeholder="I need to..."
                                className="quick-add-input"
                                value={quickAddText}
                                onChange={(e) => setQuickAddText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
                            />
                            <button className="solid-btn full-width" onClick={handleQuickAdd}>+ Add Quick Task</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Context Menu */}
            {menuSettings.visible && (
                <div className="custom-context-menu" style={{ top: `${menuSettings.y}px`, left: `${menuSettings.x}px` }}>
                    <button onClick={() => toggleStatus(menuSettings.targetId)}>Toggle Status</button>
                    <button onClick={() => openModal("edit", menuSettings.targetId)}>Edit Task Details</button>
                    <hr className="menu-divider" />
                    {(SelectedTask.length > 1) ?
                    <button className="delete-action" onClick={() => multidelete()}>Delete Selected Tasks</button> :
                    <button className="delete-action" onClick={() => deleteTask(menuSettings.targetId)}>Delete Task</button>
                    }
                </div>
            )}

            {formModal.isOpen && (
                <div className="modal-backdrop">
                    <div className="edit-modal-card">
                        <div className="modal-header">
                            <h2>{formModal.mode === "edit" ? "Edit Task" : "Create New Task"}</h2>
                            <button onClick={() => setFormModal({ isOpen: false, mode: null, targetId: null })}>✕</button>
                        </div>
                        <div className="modal-body">
                            <label>Task Title</label>
                            <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />

                            <label>Due Date</label>
                            <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)}
                                style={{ backgroundColor: 'var(--bg-workspace)', color: 'var(--text-primary)', border: '1px solid var(--border-element)', padding: '12px', borderRadius: '6px' }} />

                            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label>Category</label>
                                    <select className="Multiple-Choices" value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                                        <option value="Work">Work</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Team">Team</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label>Priority</label>
                                    <select className="Multiple-Choices" value={formPriority} onChange={(e) => setFormPriority(e.target.value)}>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-actions" style={{ marginTop: '25px' }}>
                                <button onClick={() => setFormModal({ isOpen: false, mode: null, targetId: null })}>Cancel</button>
                                <button className="save-btn" onClick={saveForm}>Save Task</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}