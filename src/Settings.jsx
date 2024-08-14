import { useState } from "react";

const Settings = (styles) => {
    var bgcol = localStorage.getItem('bgcolor');
    var menucol = localStorage.getItem('menucolor');
    var blockcol = localStorage.getItem('blockcolor');
    var barcol = localStorage.getItem('barcolor');
    if(!bgcol || bgcol == ' '){
        bgcol = 'rgb(230, 230, 230)';
    }
    if(!menucol || menucol == ' '){
        menucol = 'rgb(50, 50, 255)';
    }
    if(!blockcol || blockcol == ' '){
        blockcol = 'rgb(255, 255, 255)';
    }
    if(!barcol || barcol == ' '){
        barcol = 'rgb(190, 225, 250)';
    }
    const [bgcolor, setbgcolor] = useState(bgcol);
    const [menucolor, setmenucolor] = useState(menucol);
    const [blockcolor, setblockcolor] = useState(blockcol);
    const [barcolor, setbarcolor] = useState(barcol);


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
    const takeblockcolor = e => {
        var col = e.target.value;

        setblockcolor(col);
    }
    const takebarcolor = e => {
        var col = e.target.value;

        setbarcolor(col)
    }
    const savecolor = () => {
        localStorage.setItem('bgcolor', bgcolor);
        localStorage.setItem('menucolor', menucolor);
        localStorage.setItem('blockcolor', blockcolor);
        localStorage.setItem('barcolor', barcolor)
        window.location.reload(false);
    }
    const resetcolor = () => {
        localStorage.setItem('bgcolor', 'rgb(230, 230, 230)');
        localStorage.setItem('menucolor', 'rgb(50, 50, 255)');
        localStorage.setItem('blockcolor', 'rgb(255,255,255)');
        localStorage.setItem('barcolor', 'rgb(190, 225, 250)')
        window.location.reload(false);
    }

    return (
        <div className="pages setting" {...styles}>
            <div className="usersetting blocks">
                <h2>Enter your username:</h2>
                <input type="text" placeholder="Username:" onChange={ setusername }/>
            </div>
            <div className="background blocks">
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
                <h2>Blocks color:</h2>
                <div className="colorcontainer">
                    <input type="color" name="blockcolor" id="blockcolor" onChange={ takeblockcolor } />
                    <div className="colordisplay" style={ {backgroundColor: blockcolor} }></div>
                </div>
                <h2>Progress bars color:</h2>
                <div className="colorcontainer">
                    <input type="color" name="barcolor" id="barcolor" onChange={ takebarcolor } />
                    <div className="colordisplay" style={ {backgroundColor: barcolor} }></div>
                </div>
                <input type="button" className="button" value="Change Color" id="colorsubmit" onClick={ savecolor }/>
                <input type="button" className="button" value="Reset Color" id="colorreset" onClick={ resetcolor }/>
            </div>
        </div>
    );
}
 
export default Settings;
