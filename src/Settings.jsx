import { useState } from "react";
import useLocalStorage from './hooks/useLocalStorage';

const rgbToHex = (c, fallback = '#e6e6e6') => {
    if (!c) return fallback;
    if (c[0] === '#') return c;
    const m = c.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (!m) return fallback;
    const r = parseInt(m[1], 10);
    const g = parseInt(m[2], 10);
    const b = parseInt(m[3], 10);
    return '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('');
}

const Settings = (styles) => {
    const [bgcolor, setbgcolor] = useLocalStorage('bgcolor', '#e6e6e6');
    const [menucolor, setmenucolor] = useLocalStorage('menucolor', '#3232ff');
    const [blockcolor, setblockcolor] = useLocalStorage('blockcolor', '#ffffff');
    const [barcolor, setbarcolor] = useLocalStorage('barcolor', '#bee1fa');


    const [username, setUsername] = useLocalStorage('username', '');
    const setusername = (e) => {
        setUsername(e.target.value);
    }
    const takecolor = (e) => setbgcolor(e.target.value);
    const takemenucolor = (e) => setmenucolor(e.target.value);
    const takeblockcolor = (e) => setblockcolor(e.target.value);
    const takebarcolor = (e) => setbarcolor(e.target.value);
    const savecolor = () => {
        // useLocalStorage already persists; no page reload needed
    }
    const resetcolor = () => {
        setbgcolor('#e6e6e6');
        setmenucolor('#3232ff');
        setblockcolor('#ffffff');
        setbarcolor('#bee1fa');
    }

    return (
        <div className="pages setting" {...styles}>
            <div className="usersetting blocks">
                <h2>Enter your username:</h2>
                <input type="text" placeholder="Username:" value={username} onChange={ setusername }/>
            </div>
            <div className="background blocks">
                <h2>Background color:</h2>
                <div className="colorcontainer">
                        <input type="color" name="background" id="bg" value={rgbToHex(bgcolor, '#e6e6e6')} onChange={ takecolor }/>
                        <div className='colordisplay' style={ {backgroundColor: bgcolor} }></div>
                </div>
                <h2>Menu color:</h2>
                <div className="colorcontainer">
                        <input type="color" name="menucolor" id="menucolor" value={rgbToHex(menucolor, '#3232ff')} onChange={ takemenucolor }/>
                        <div className='colordisplay' style={ {backgroundColor: menucolor} }></div>
                </div>
                <h2>Blocks color:</h2>
                <div className="colorcontainer">
                        <input type="color" name="blockcolor" id="blockcolor" value={rgbToHex(blockcolor, '#ffffff')} onChange={ takeblockcolor } />
                        <div className="colordisplay" style={ {backgroundColor: blockcolor} }></div>
                </div>
                <h2>Progress bars color:</h2>
                <div className="colorcontainer">
                        <input type="color" name="barcolor" id="barcolor" value={rgbToHex(barcolor, '#bee1fa')} onChange={ takebarcolor } />
                        <div className="colordisplay" style={ {backgroundColor: barcolor} }></div>
                </div>
                <input type="button" className="button" value="Change Color" id="colorsubmit" onClick={ savecolor }/>
                <input type="button" className="button" value="Reset Color" id="colorreset" onClick={ resetcolor }/>
            </div>
        </div>
    );
}
 
export default Settings;
