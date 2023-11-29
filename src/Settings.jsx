import Color from './assets/Color.svg';
import { useState } from "react";

const Settings = (styles) => {
    const [themepage, setthemepage] = useState('100vw');
    return (
        <div className="settings" {...styles}>
            <div className='Theme'>
                <h2>Theme</h2>
                <img src={ Color } alt="Color logo" draggable='false' />
            </div>

            <div className="themepage">
                
            </div>
        </div>
    );
}
 
export default Settings;