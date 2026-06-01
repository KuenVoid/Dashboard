import React from "react";
import "../Style_Sheets/Todo.css";

export default function Todo(){
    return (
        <div className="Todo" data-theme="Matcha-Blossom">
            {/* Main Application Content */}
            <main className="workspace">
                <header className="workspace-header">
                    <h1>Todo - 1 June 2026</h1>
                </header>

                <div className="dashboard-grid">
                    {/* Main Table Segment */}
                    <section className="card todo-list-card">
                        <div className="card-header">
                            <h2>All Todos</h2>
                            <div className="controls">
                                <label>Sort by: 
                                    <select defaultValue="Due Date"><option>Due Date</option></select>
                                </label>
                                <label>Filter by: 
                                    <select defaultValue="Work"><option>Work</option></select>
                                </label>
                            </div>
                        </div>

                        <table className="todo-table">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" disabled /></th>
                                    <th>Task</th>
                                    <th>Due Date</th>
                                    <th>Category</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableRow task="Complete Project Report" date="Today" cat="Work" pri="High" stat="Pending" checked />
                                <TableRow task="Schedule Team Sync" date="12/10/2022" cat="Personal" pri="Medium" stat="Completed" checked />
                                <TableRow task="Groceries - Buy Milk" date="12/10/2022" cat="Shopping" pri="Low" stat="Completed" />
                                <TableRow task="Follow up with Client" date="12/10/2022" cat="Shopping" pri="Low" stat="In Progress" checked />
                                <TableRow task="Follow up with Client" date="12/10/2022" cat="Work" pri="High" stat="Pending" checked />
                                <TableRow task="Order Supplies - Printer Ink" date="12/10/2022" cat="Personal" pri="Medium" stat="Pending" />
                                <TableRow task="Complete Project Report" date="12/10/2022" cat="Team" pri="Low" stat="Pending" />
                                <TableRow task="Wireframe Review" date="12/10/2022" cat="Personal" pri="Medium" stat="Pending" checked />
                                <TableRow task="Complete Project Report" date="01/10/2023" cat="Work" pri="Medium" stat="Completed" checked />
                                <TableRow task="Follow up with Client" date="01/10/2023" cat="Shopping" pri="Low" stat="In Progress" />
                                <TableRow task="Order Supplies - Printer Ink" date="01/10/2023" cat="Shopping" pri="Low" stat="Completed" />
                                <TableRow task="Wireframe Review" date="01/10/2023" cat="Shopping" pri="Low" stat="In Progress" />
                                <TableRow task="Wireframe Review" date="01/10/2023" cat="Personal" pri="High" stat="Completed" />
                                <TableRow task="Wireframe Review" date={<span className="text-danger">07/10/2023</span>} cat="Work" pri="High" stat="Pending" checked />
                                <TableRow task="Wireframe Review" date={<span className="text-danger">03/10/2023</span>} cat="Personal" pri="High" stat="Pending" checked />
                                <TableRow task="Complete Project Report" date="01/10/2023" cat="Team" pri="Low" stat="Completed" />
                            </tbody>
                        </table>
                    </section>

                    {/* Right Hand Metrics Panel */}
                    <div className="right-column">
                        <section className="card stats-card">
                            <h2>Todo Statistics</h2>
                            <div className="stats-grid">
                                <div className="stat-box box-gray">
                                    <span className="stat-label">Total Tasks</span>
                                    <span className="stat-value">32</span>
                                </div>
                                <div className="stat-box box-green">
                                    <span className="stat-label">Completed</span>
                                    <span className="stat-value">14</span>
                                </div>
                                <div className="stat-box box-tan">
                                    <span className="stat-label">Pending</span>
                                    <span className="stat-value">18</span>
                                </div>
                                <div className="stat-box box-red">
                                    <span className="stat-label">Overdue</span>
                                    <span className="stat-value">2</span>
                                </div>
                            </div>
                            <div className="stats-chart">
                                <div className="bar bar-1"></div>
                                <div className="bar bar-2"></div>
                                <div className="bar bar-3"></div>
                                <div className="bar bar-4"></div>
                                <div className="bar bar-5"></div>
                                <div className="bar bar-6"></div>
                            </div>
                        </section>

                        <section className="card quick-add-card">
                            <h2>Quick Add</h2>
                            <div className="quick-add-form">
                                <input type="text" placeholder="Add new task..." className="quick-add-input" />
                                <button className="quick-add-btn">+ Add</button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Sub-component helper for neat row parsing
function TableRow({ task, date, cat, pri, stat, checked }) {
    return (
        <tr>
            <td>
                <input 
                    type="checkbox" 
                    defaultChecked={checked} 
                    className="custom-checkbox"
                />
            </td>
            <td className="task-name">{task}</td>
            <td className="task-date">{date}</td>
            <td><span className={`badge cat-${cat.toLowerCase()}`}>{cat}</span></td>
            <td><span className={`badge pri-${pri.toLowerCase()}`}>{pri}</span></td>
            <td><span className={`badge stat-${stat.replace(/\s+/g, '').toLowerCase()}`}>{stat}</span></td>
        </tr>
    );
}