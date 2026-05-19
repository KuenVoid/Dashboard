import { useState, useEffect } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';

const Welcome = () => {
    const [user] = useLocalStorage('username', '');
    const [progress1] = useLocalStorage('progress1', '');
    const [percentage1] = useLocalStorage('percentage1', 0);
    const [progress2] = useLocalStorage('progress2', '');
    const [percentage2] = useLocalStorage('percentage2', 0);
    const [progress3] = useLocalStorage('progress3', '');
    const [percentage3] = useLocalStorage('percentage3', 0);
    const [progress4] = useLocalStorage('progress4', '');
    const [percentage4] = useLocalStorage('percentage4', 0);
    const [progresscolor] = useLocalStorage('barcolor', '#bee1fa');
    const [welcomeblock] = useLocalStorage('blockcolor', '#ffffff');

    const [currenttime, setCurrenttime] = useState('');
    const [currentdate, setCurrentdate] = useState('');

    useEffect(() => {
        const updatetd = () => {
            setCurrenttime(new Date().toLocaleTimeString());
            setCurrentdate(new Date().toLocaleDateString());
        };
        updatetd();
        const id = setInterval(updatetd, 500);
        return () => clearInterval(id);
    }, []);

    const newwelcomeblock = (!welcomeblock || welcomeblock === '#ffffff' || welcomeblock === 'rgb(255,255,255)')
        ? 'linear-gradient(to right, rgb(245,245,245), rgb(255,255,255))'
        : `linear-gradient(to right, rgb(255,255,255), ${welcomeblock})`;

    return (
        <div className="welcome" style={{ background: newwelcomeblock }}>
            <h2>Welcome {user}!</h2>
            <h2>Date: {currentdate}</h2>
            <h2>Time: {currenttime}</h2>
            <div className="productive">
                <div className="bars">
                    <div className='bar' style={{ backgroundColor: progresscolor, width: `${Number(percentage1)}%` }}><h2>{progress1}</h2></div>
                </div>
                <div className="bars">
                    <div className='bar' style={{ backgroundColor: progresscolor, width: `${Number(percentage2)}%` }}><h2>{progress2}</h2></div>
                </div>
                <div className="bars">
                    <div className='bar' style={{ backgroundColor: progresscolor, width: `${Number(percentage3)}%` }}><h2>{progress3}</h2></div>
                </div>
                <div className="bars">
                    <div className='bar' style={{ backgroundColor: progresscolor, width: `${Number(percentage4)}%` }}><h2>{progress4}</h2></div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
