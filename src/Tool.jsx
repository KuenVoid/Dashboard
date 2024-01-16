import { useState, useEffect } from 'react';

const Tools = (styles) => {
    return (
        <div className='pages' {...styles}>
            <div className="luckydraw">
                <h2>Lucky draw / Spin</h2>
                <h2 className='add'>+</h2>
            </div>
        </div>
    );
}
 
export default Tools;