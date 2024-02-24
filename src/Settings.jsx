import { useState } from "react";

const Settings = (styles) => {
    var bgcol = localStorage.getItem('bgcolor');
    var menucol = localStorage.getItem('menucolor');
    if(!bgcol || bgcol == ' '){
        bgcol = 'rgb(230, 230, 230)';
    }
    if(!menucol || menucol == ' '){
        menucol = 'rgb(50, 50, 255)';
    }
    const [bgcolor, setbgcolor] = useState(bgcol);
    const [menucolor, setmenucolor] = useState(menucol);

    const setusername = (e) => {
        let name = e.target.value;
        localStorage.setItem('username', name);
    }
    const takecolor = (e) => {
        var color = e.target.value;

        setbgcolor(color);
    }
    const takemenucolor = (e) => {
        var color = e.target.value;

        setmenucolor(color);
    }
    const savecolor = () => {
        localStorage.setItem('bgcolor', bgcolor);
        localStorage.setItem('menucolor', menucolor);
        window.location.reload(false);
    }
    const resetcolor = () => {
        localStorage.setItem('bgcolor', 'rgb(230, 230, 230)');
        localStorage.setItem('menucolor', 'rgb(50, 50, 255)');
        window.location.reload(false);
    }

    return (
        <div className="pages setting" {...styles}>
            <div className="usersetting">
                <h2>Enter your username:</h2>
                <input type="text" placeholder="Username:" onChange={ setusername }/>
            </div>
            <div className="background">
                <h2>Background color:</h2>
                <div className="colorcontainer">
                    <input type="color" name="background" id="bg" onChange={ takecolor }/>
                    <div className='colordisplay' style={ {backgroundColor: bgcolor} }></div>
                </div>
                <h2>Menu color:</h2>
                <div className="colorcontainer">
                    <input type="color" name="menucolor" id="menucolor" onChange={ takemenucolor }/>
                    <div className='colordisplay' style={ {backgroundColor: menucolor} }></div>
                </div>
                <input type="button" className="button" value="Change Color" id="colorsubmit" onClick={ savecolor }/>
                <input type="button" className="button" value="Reset Color" id="colorreset" onClick={ resetcolor }/>
            </div>
        </div>
    );
}
 
export default Settings;
