import { useState, useEffect } from 'react';

const Tools = (styles) => {
    const [drawinput, setdrawinput] = useState('none');
    var items = localStorage.getItem('items');
    var itemarray = localStorage.getItem('items').split(',');
    var [result, setresult] = useState();
    var [logdisplay, setlogdisplay] = useState('none');

    if(!itemarray) {
        itemarray == '';
    }

    const changelogdisplay = () => {
        if(logdisplay == 'none'){
            setlogdisplay('block')
        } else {
            setlogdisplay('none')
        }
    }
    const changedrawdisplay = () => {
        if(drawinput == 'none') {
            setdrawinput('block');
        } else {
            setdrawinput('none');
        }
    }
    const setitems = (e) => {
        items = e.target.value;
        localStorage.setItem('items', items);
    }
    const spin = () => {
        var itemlength = Number(itemarray.length);
        setresult(itemarray[Math.floor(Math.random() * itemlength)]);
    }
    const progresschange = (e) => {
        localStorage.setItem(e.target.id, e.target.value);
    }
    const percentagechange = (e) => {
        if (Number(e.target.value) > 100) {
            localStorage.setItem(e.target.id, 100);
        } else if (Number(e.target.value) < 0) {
            localStorage.setItem(e.target.id, 0);
        } else {
            localStorage.setItem(e.target.id, e.target.value);
        }
    }

    return (
        <div className='pages' {...styles}>
            <div className="luckydraw blocks">
                <h2>Lucky draw</h2>
                <h2 className='add' onClick={ changedrawdisplay }>+</h2>
                <h2>Rewards: <br/> {items}</h2>
                <h2>{result}</h2>
                <input type="button" value="Spin" id='spinbut' onClick={ spin }/>
                <div className='drawinput' style={ {display:drawinput} }>
                    <input type="text" placeholder='Items1, Items2, ...' onChange={setitems}/>
                </div>
            </div>
            <div className="log blocks">
                <h2>Items log:</h2>
                <h2 className='add' onClick={ changelogdisplay }>+</h2>
                <div style={ {display:logdisplay} } className="inputcontainer">
                    <input type="text" placeholder='Logs' id='log1'/>
                    <input type="text" placeholder='Logs' id='log2'/>
                    <input type="text" placeholder='Logs' id='log3'/>
                    <input type="text" placeholder='Logs' id='log4'/>
                </div>
            </div>
            <div className="activitymonitor blocks">
                <h2>Activity Monitor</h2>
                <h2>Enter your progress:</h2>
                <div className='progressinputs'>
                    <input type="text" placeholder='Progess name' id='progress1' onChange={ progresschange }/>
                    <input type="number" min={0} max={100} id='percentage1' placeholder='%' onChange={ percentagechange }/>
                </div>
                <div className='progressinputs'>
                    <input type="text" placeholder='Progess name' id='progress2' onChange={ progresschange }/>
                    <input type="number" min={0} max={100} id='percentage2' placeholder='%' onChange={ percentagechange }/>
                </div>
                <div className='progressinputs'>
                    <input type="text" placeholder='Progess name' id='progress3' onChange={ progresschange }/>
                    <input type="number" min={0} max={100} id='percentage3' placeholder='%' onChange={ percentagechange }/>
                </div>
                <div className='progressinputs'>
                    <input type="text" placeholder='Progess name' id='progress4' onChange={ progresschange }/>
                    <input type="number" min={0} max={100} id='percentage4' placeholder='%' onChange={ percentagechange }/>
                </div>
            </div>
        </div>
    );
}
 
export default Tools;
