import React from 'react';

const LuckyDraw = ({ items, result, drawinput, onToggleDraw, onItemsChange, onSpin }) => {
  const itemsValue = Array.isArray(items) && items.length ? items.join(', ') : '';
  return (
    <div className="luckydraw blocks">
      <h2>Lucky draw</h2>
      <h2 className='add' onClick={ onToggleDraw }>+</h2>
      <h2>Rewards: <br/> {itemsValue}</h2>
      <h2>{result}</h2>
      <input type="button" value="Spin" id='spinbut' onClick={ onSpin }/>
      <div className='drawinput' style={{ display: drawinput }}>
        <input type="text" placeholder='Items1, Items2, ...' value={ itemsValue } onChange={ onItemsChange } />
      </div>
    </div>
  );
};

export default LuckyDraw;
