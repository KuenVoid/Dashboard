import Editicon from './assets/Edit.svg'
import { useState, useEffect } from 'react';

const Home = (styles) => {
    const [editstyle, seteditstyle] = useState('none');
    const [editanim, seteditanim] = useState('');
    const [inputstyle1, setinputstyle1] = useState('none');
    const [inputstyle2, setinputstyle2] = useState('none');
    const [inputstyle3, setinputstyle3] = useState('none');
    const [inputstyle4, setinputstyle4] = useState('none');
    const [currenttime, setcurrenttime] = useState();
    const [currentdate, setcurrentdate] = useState();
    const [goaldisplay,  setgoaldisplay] = useState('none');
    const [goalanim,  setgoalanim] = useState('');
    var todo1data = localStorage.getItem('todo1') + " -" + localStorage.getItem('dl1');
    var todo2data = localStorage.getItem('todo2') + " -" + localStorage.getItem('dl2');
    var todo3data = localStorage.getItem('todo3') + " -" + localStorage.getItem('dl3');
    var todo4data = localStorage.getItem('todo4') + " -" + localStorage.getItem('dl4');
    var goal1data = localStorage.getItem('goal1');
    var goal2data = localStorage.getItem('goal2');
    var goal3data = localStorage.getItem('goal3');
    var goal4data = localStorage.getItem('goal4');
    let user = localStorage.getItem('username');
    if(!localStorage.getItem('todo1') || localStorage.getItem('todo1') == ' ' || !localStorage.getItem('dl1') || localStorage.getItem('dl1') == ' ') {
        todo1data = '';
    }
    if(!localStorage.getItem('todo2') || localStorage.getItem('todo2') == ' ' || !localStorage.getItem('dl2') || localStorage.getItem('dl2') == ' ') {
        todo2data = '';
    }
    if(!localStorage.getItem('todo3') || localStorage.getItem('todo3') == ' ' || !localStorage.getItem('dl3') || localStorage.getItem('dl3') == ' ') {
        todo3data = '';
    }
    if(!localStorage.getItem('todo4') || localStorage.getItem('todo4') == ' ' || !localStorage.getItem('dl4') || localStorage.getItem('dl4') == ' ') {
        todo4data = '';
    }
    if(!localStorage.getItem('goal1') || localStorage.getItem('goal1') == ' ') {
        goal1data = '';
    }
    if(!localStorage.getItem('goal2') || localStorage.getItem('goal2') == ' ') {
        goal2data = '';
    }
    if(!localStorage.getItem('goal3') || localStorage.getItem('goal3') == ' ') {
        goal3data = '';
    }
    if(!localStorage.getItem('goal4') || localStorage.getItem('goal4') == ' ') {
        goal4data = '';
    }

    const updatetd = () => {
        let date = new Date().toLocaleDateString();
        let time = new Date().toLocaleTimeString();

        setcurrenttime(time);
        setcurrentdate(date);
    }
    const change1 = () => {
        if(inputstyle1 == 'none'){
            setinputstyle1('block');
        } else {
            setinputstyle1('none');
        }
    }
    const change2 = () => {
        if(inputstyle2 == 'none'){
            setinputstyle2('block');
        } else {
            setinputstyle2('none');
        }
    }
    const change3 = () => {
        if(inputstyle3 == 'none'){
            setinputstyle3('block');
        } else {
            setinputstyle3('none');
        }
    }
    const change4 = () => {
        if(inputstyle4 == 'none'){
            setinputstyle4('block');
        } else {
            setinputstyle4('none');
        }
    }
    const changeeditstyle = () => {
        if(editstyle == 'none'){
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
    const showgoal = () => {
        if(goaldisplay == 'none'){
            setgoalanim('goalopen 400ms linear');
            setgoaldisplay('block');
        } else {
            setgoalanim('goalclose 400ms linear');
            setTimeout(() => {
                setgoaldisplay('none');
                setgoalanim('');
            }, 400);
        }
    }
    const savetododata = e => {
        const id = e.target.id;
        localStorage.setItem(id, e.target.value);
    }

    setInterval(() => {
        updatetd();
    }, 500);

    return (
        <div className="homepage pages" { ...styles }>
            <div className="welcome">
                <h2>Welcome {user}!</h2>
                <h2>Date: { currentdate }</h2>
                <h2>Time: { currenttime }</h2>
                <div className="productive"></div>
            </div>
            <div className="goal">
                <h2>Goals</h2>
                <img src={ Editicon } alt="editicon" id='goaledit' onClick={showgoal}/>
                <h2>{ goal1data }</h2>
                <h2>{ goal2data }</h2>
                <h2>{ goal3data }</h2>
                <h2>{ goal4data }</h2>
            </div>
            <div className="todo">
                <h2>To-do list</h2>
                <img src={ Editicon } alt="editicon" id='editable' onClick={ changeeditstyle }/>
                <h2 id='todolists1'> { todo1data }</h2>
                <h2 id='todolists2'> { todo2data }</h2>
                <h2 id='todolists3'> { todo3data }</h2>
                <h2 id='todolists4'> { todo4data }</h2>
            </div>
            <div className='edittodo' style={ {display:editstyle, animation:editanim} }>
                <h2>Edit your Todo list</h2>
                <div className='container'>
                    <h2 onClick={ change1 }>To-do 1</h2>
                    <input type="text" placeholder='To-do thing:' style={ {display: inputstyle1} } id='todo1' onChange={ savetododata }/>
                    <input type="text" placeholder='Deadline:' style={ {display: inputstyle1} } id='dl1' onChange={ savetododata }/>
                </div>
                <div className='container'>
                    <h2 onClick={ change2 }>To-do 2</h2>
                    <input type="text" placeholder='To-do thing:' style={ {display: inputstyle2} } id='todo2' onChange={ savetododata }/>
                    <input type="text" placeholder='Deadline:' style={ {display: inputstyle2} } id='dl2' onChange={ savetododata }/>
                </div>
                <div className='container'>
                    <h2 onClick={ change3 }>To-do 3</h2>
                    <input type="text" placeholder='To-do thing:' style={ {display: inputstyle3} } id='todo3' onChange={ savetododata }/>
                    <input type="text" placeholder='Deadline:' style={ {display: inputstyle3} } id='dl3' onChange={ savetododata }/>
                </div>
                <div className='container'>
                    <h2 onClick={ change4 }>To-do 4</h2>
                    <input type="text" placeholder='To-do thing:' style={ {display: inputstyle4} } id='todo4' onChange={ savetododata }/>
                    <input type="text" placeholder='Deadline:' style={ {display: inputstyle4} } id='dl4' onChange={ savetododata }/>
                </div>
            </div>
            <div className="editgoal" style={ {display: goaldisplay, animation: goalanim} }>
                <h2>Set Goals</h2>
                <input type="text" placeholder='Goal 1' id='goal1' onChange={savetododata}/>
                <input type="text" placeholder='Goal 2' id='goal2' onChange={savetododata}/>
                <input type="text" placeholder='Goal 3' id='goal3' onChange={savetododata}/>
                <input type="text" placeholder='Goal 4' id='goal4' onChange={savetododata}/>
            </div>
        </div>
    );
}
 
export default Home;
