import React from 'react';

const Log = ({ logdisplay, log1, log2, log3, log4, setLog1, setLog2, setLog3, setLog4, onToggle }) => {
  return (
    <div className="log blocks">
      <h2>Items log:</h2>
      <h2 className='add' onClick={ onToggle }>+</h2>
      <div style={{ display: logdisplay }} className="inputcontainer">
        <input type="text" placeholder='Logs' id='log1' value={log1} onChange={e => setLog1(e.target.value)} />
        <input type="text" placeholder='Logs' id='log2' value={log2} onChange={e => setLog2(e.target.value)} />
        <input type="text" placeholder='Logs' id='log3' value={log3} onChange={e => setLog3(e.target.value)} />
        <input type="text" placeholder='Logs' id='log4' value={log4} onChange={e => setLog4(e.target.value)} />
      </div>
    </div>
  );
};

export default Log;
