import { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import Log from './components/Tools/Log';
import ActivityMonitor from './components/Tools/ActivityMonitor';

const Tools = (styles) => {
    const [logdisplay, setLogdisplay] = useState('none');
    const [log1, setLog1] = useLocalStorage('log1', '');
    const [log2, setLog2] = useLocalStorage('log2', '');
    const [log3, setLog3] = useLocalStorage('log3', '');
    const [log4, setLog4] = useLocalStorage('log4', '');
    const [progress1, setProgress1] = useLocalStorage('progress1', '');
    const [percentage1, setPercentage1] = useLocalStorage('percentage1', 0);
    const [progress2, setProgress2] = useLocalStorage('progress2', '');
    const [percentage2, setPercentage2] = useLocalStorage('percentage2', 0);
    const [progress3, setProgress3] = useLocalStorage('progress3', '');
    const [percentage3, setPercentage3] = useLocalStorage('percentage3', 0);
    const [progress4, setProgress4] = useLocalStorage('progress4', '');
    const [percentage4, setPercentage4] = useLocalStorage('percentage4', 0);

    const changelogdisplay = () => {
        setLogdisplay(prev => prev === 'none' ? 'block' : 'none');
    }
    const changedrawdisplay = () => {
        setDrawinput(prev => prev === 'none' ? 'block' : 'none');
    }
    const setitems = (e) => {
        const value = e.target.value || '';
        const arr = value.split(',').map(s => s.trim()).filter(Boolean);
        setItems(arr);
    }
    const spin = () => {
        const itemlength = items.length;
        if (!itemlength) {
            setResult('');
            return;
        }
        setResult(items[Math.floor(Math.random() * itemlength)]);
    }
    const clamp = (n) => Math.max(0, Math.min(100, Number(n) || 0));


    return (
        <div className='pages' {...styles}>
            <Log
                logdisplay={logdisplay}
                log1={log1} log2={log2} log3={log3} log4={log4}
                setLog1={setLog1} setLog2={setLog2} setLog3={setLog3} setLog4={setLog4}
                onToggle={changelogdisplay}
            />

            <ActivityMonitor
                progress1={progress1} percentage1={percentage1} setProgress1={setProgress1} setPercentage1={(v) => setPercentage1(clamp(v))}
                progress2={progress2} percentage2={percentage2} setProgress2={setProgress2} setPercentage2={(v) => setPercentage2(clamp(v))}
                progress3={progress3} percentage3={percentage3} setProgress3={setProgress3} setPercentage3={(v) => setPercentage3(clamp(v))}
                progress4={progress4} percentage4={percentage4} setProgress4={setProgress4} setPercentage4={(v) => setPercentage4(clamp(v))}
            />
        </div>
    );
}
 
export default Tools;
