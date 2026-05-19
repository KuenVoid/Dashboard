import React from 'react';

const ActivityMonitor = ({ progress1, percentage1, setProgress1, setPercentage1, progress2, percentage2, setProgress2, setPercentage2, progress3, percentage3, setProgress3, setPercentage3, progress4, percentage4, setProgress4, setPercentage4 }) => {
  return (
    <div className="activitymonitor blocks">
      <h2>Activity Monitor</h2>
      <h2>Enter your progress:</h2>
      <div className='progressinputs'>
        <input type="text" placeholder='Progess name' id='progress1' value={progress1} onChange={ e => setProgress1(e.target.value) }/>
        <input type="number" min={0} max={100} id='percentage1' placeholder='%' value={percentage1} onChange={ e => setPercentage1(Math.max(0, Math.min(100, Number(e.target.value) || 0))) }/>
      </div>
      <div className='progressinputs'>
        <input type="text" placeholder='Progess name' id='progress2' value={progress2} onChange={ e => setProgress2(e.target.value) }/>
        <input type="number" min={0} max={100} id='percentage2' placeholder='%' value={percentage2} onChange={ e => setPercentage2(Math.max(0, Math.min(100, Number(e.target.value) || 0))) }/>
      </div>
      <div className='progressinputs'>
        <input type="text" placeholder='Progess name' id='progress3' value={progress3} onChange={ e => setProgress3(e.target.value) }/>
        <input type="number" min={0} max={100} id='percentage3' placeholder='%' value={percentage3} onChange={ e => setPercentage3(Math.max(0, Math.min(100, Number(e.target.value) || 0))) }/>
      </div>
      <div className='progressinputs'>
        <input type="text" placeholder='Progess name' id='progress4' value={progress4} onChange={ e => setProgress4(e.target.value) }/>
        <input type="number" min={0} max={100} id='percentage4' placeholder='%' value={percentage4} onChange={ e => setPercentage4(Math.max(0, Math.min(100, Number(e.target.value) || 0))) }/>
      </div>
    </div>
  );
};

export default ActivityMonitor;
