import { useState } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import Editicon from '../../assets/Edit.svg';

const Goals = () => {
    const [goaldisplay, setGoaldisplay] = useState('none');
    const [goalanim, setGoalanim] = useState('');
    const [goal1, setGoal1] = useLocalStorage('goal1', '');
    const [goal2, setGoal2] = useLocalStorage('goal2', '');
    const [goal3, setGoal3] = useLocalStorage('goal3', '');
    const [goal4, setGoal4] = useLocalStorage('goal4', '');
    const [welcomeblock] = useLocalStorage('blockcolor', '#ffffff');

    const showgoal = () => {
        if (goaldisplay === 'none') {
            setGoalanim('goalopen 400ms linear');
            setGoaldisplay('block');
        } else {
            setGoalanim('goalclose 400ms linear');
            setTimeout(() => {
                setGoaldisplay('none');
                setGoalanim('');
            }, 400);
        }
    }

    return (
        <>
            <div className="goal" style={{ backgroundColor: welcomeblock }}>
                <h2>Goals</h2>
                <img src={Editicon} alt="editicon" id='goaledit' onClick={showgoal} />
                <h2>{goal1}</h2>
                <h2>{goal2}</h2>
                <h2>{goal3}</h2>
                <h2>{goal4}</h2>
            </div>
            <div className="editgoal blocks" style={{ display: goaldisplay, animation: goalanim }}>
                <h2>Set Goals</h2>
                <input type="text" placeholder='Goal 1' id='goal1' value={goal1} onChange={(e) => setGoal1(e.target.value)} />
                <input type="text" placeholder='Goal 2' id='goal2' value={goal2} onChange={(e) => setGoal2(e.target.value)} />
                <input type="text" placeholder='Goal 3' id='goal3' value={goal3} onChange={(e) => setGoal3(e.target.value)} />
                <input type="text" placeholder='Goal 4' id='goal4' value={goal4} onChange={(e) => setGoal4(e.target.value)} />
            </div>
        </>
    );
}

export default Goals;
