import { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import Editicon from '../../assets/Edit.svg';

const time_left = (t, d) => {
    if (!t) return '';
    return d? '${t} - ${d}': t;
}
function todo_template(num, item, display_time) {
    return (
        <div>
            <h3>Todo {num}</h3>
            <p>{item}</p>
            <p>{display_time}</p>
        </div>
    )
}

const Todo = () => {
    const [welcomeblock] = useLocalStorage('blockcolor', '#ffffff');

    return (
        <>
            <div className="todo" style={{ backgroundColor: welcomeblock }}>
                <div>
                <h2>To-do list</h2>
                <img src={Editicon} alt="editicon" id='editable'/>
                </div>
            </div>
        </>
    );
}

export default Todo;
