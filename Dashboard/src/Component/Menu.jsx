import React from "react";

export default function Menu({ width, setCurrentPage, DashboardTitle }) {
    const options = ["Home", "Todo", "Calendar", "Settings"];

    return (
        <nav className='menu' style={{ width: `${width}vw` }}>
            <h1 className='sidebar-title'>{DashboardTitle}</h1>
            {options.map((option) => (
                <h2 key={option} className='page_option' onClick={() => setCurrentPage(option)}>
                    {option}
                </h2>
            ))}
        </nav>
    );
}