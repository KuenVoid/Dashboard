import { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import Editicon from '../../assets/Edit.svg';

const formatTodo = (t, d) => {
    if (!t) return '';
    return d ? `${t} - ${d}` : t;
}

const Todo = () => {
    const [editstyle, seteditstyle] = useState('none');
    const [editanim, seteditanim] = useState('');
    const [inputstyle1, setinputstyle1] = useState('none');
    const [inputstyle2, setinputstyle2] = useState('none');
    const [inputstyle3, setinputstyle3] = useState('none');
    const [inputstyle4, setinputstyle4] = useState('none');

    const [todo1, setTodo1] = useLocalStorage('todo1', '');
    const [dl1, setDl1] = useLocalStorage('dl1', '');
    const [todo2, setTodo2] = useLocalStorage('todo2', '');
    const [dl2, setDl2] = useLocalStorage('dl2', '');
    const [todo3, setTodo3] = useLocalStorage('todo3', '');
    const [dl3, setDl3] = useLocalStorage('dl3', '');
    const [todo4, setTodo4] = useLocalStorage('todo4', '');
    const [dl4, setDl4] = useLocalStorage('dl4', '');
    const [welcomeblock] = useLocalStorage('blockcolor', '#ffffff');

    const todo1data = formatTodo(todo1, dl1);
    const todo2data = formatTodo(todo2, dl2);
    const todo3data = formatTodo(todo3, dl3);
    const todo4data = formatTodo(todo4, dl4);

    const change1 = () => setinputstyle1(inputstyle1 === 'none' ? 'block' : 'none');
    const change2 = () => setinputstyle2(inputstyle2 === 'none' ? 'block' : 'none');
    const change3 = () => setinputstyle3(inputstyle3 === 'none' ? 'block' : 'none');
    const change4 = () => setinputstyle4(inputstyle4 === 'none' ? 'block' : 'none');

    const changeeditstyle = () => {
        if (editstyle === 'none') {
            seteditanim('editopen 400ms linear');
            seteditstyle('block');
        } else {
            seteditanim('editclose 400ms linear');
            setTimeout(() => {
                seteditstyle('none');
                seteditanim('');
            }, 400);
        }
    }

    return (
        <>
            <div className="todo" style={{ backgroundColor: welcomeblock }}>
                <h2>To-do list</h2>
                <img src={Editicon} alt="editicon" id='editable' onClick={changeeditstyle} />
                <h2 id='todolists1'> {todo1data}</h2>
                <h2 id='todolists2'> {todo2data}</h2>
                <h2 id='todolists3'> {todo3data}</h2>
                <h2 id='todolists4'> {todo4data}</h2>
            </div>

            <div className='edittodo' style={{ display: editstyle, animation: editanim }}>
                <h2>Edit your Todo list</h2>
                <div className='container'>
                    <h2 onClick={change1}>To-do 1</h2>
                    <input type="text" placeholder='To-do thing:' style={{ display: inputstyle1 }} id='todo1' value={todo1} onChange={(e) => setTodo1(e.target.value)} />
                    <input type="text" placeholder='Deadline:' style={{ display: inputstyle1 }} id='dl1' value={dl1} onChange={(e) => setDl1(e.target.value)} />
                </div>
                <div className='container'>
                    <h2 onClick={change2}>To-do 2</h2>
                    <input type="text" placeholder='To-do thing:' style={{ display: inputstyle2 }} id='todo2' value={todo2} onChange={(e) => setTodo2(e.target.value)} />
                    <input type="text" placeholder='Deadline:' style={{ display: inputstyle2 }} id='dl2' value={dl2} onChange={(e) => setDl2(e.target.value)} />
                </div>
                <div className='container'>
                    <h2 onClick={change3}>To-do 3</h2>
                    <input type="text" placeholder='To-do thing:' style={{ display: inputstyle3 }} id='todo3' value={todo3} onChange={(e) => setTodo3(e.target.value)} />
                    <input type="text" placeholder='Deadline:' style={{ display: inputstyle3 }} id='dl3' value={dl3} onChange={(e) => setDl3(e.target.value)} />
                </div>
                <div className='container'>
                    <h2 onClick={change4}>To-do 4</h2>
                    <input type="text" placeholder='To-do thing:' style={{ display: inputstyle4 }} id='todo4' value={todo4} onChange={(e) => setTodo4(e.target.value)} />
                    <input type="text" placeholder='Deadline:' style={{ display: inputstyle4 }} id='dl4' value={dl4} onChange={(e) => setDl4(e.target.value)} />
                </div>
            </div>
        </>
    );
}

export default Todo;
