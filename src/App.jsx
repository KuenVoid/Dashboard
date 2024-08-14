import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Menulogo from './assets/Menu.svg';
import Home from './Home';
import Settings from  './Settings';
import Tools from './Tool';

function App() {
  var block = document.getElementsByClassName('blocks');
  const [menuleft, setmenuleft] = useState('-20vw');
  const [menubutleft, setmenubutleft] = useState('2vw');
  const [settingdisplay, setsettingdisplay] = useState('none');
  const [pagewidth, setpagewidth] = useState('100vw');
  const [homedisplay, sethomedisplay] = useState('block');
  const [toolsdisplay, settoolsdisplay] = useState('none');
  const [pagestransition, setpagestransition] = useState('');
  var menucolour = localStorage.getItem('menucolor');
  var bgcolour = localStorage.getItem('bgcolor');
  var blockcolour = localStorage.getItem('blockcolor');

  if(blockcolour) {
    for(let item of block) {
      item.style.backgroundColor = blockcolour;
    }
  }
  if(!menucolour) {
    menucolour = 'linear-gradient(rgb(50, 50, 255), rgb(50, 45, 255))'
  }
  if(!bgcolour) {
    bgcolour = 'rgb(230, 230, 230)'
  }

  const showmenu = () => {
    if(menuleft == '0') {
      setmenuleft('-20vw');
      setmenubutleft('2vw');
      setpagewidth('100vw');
      setpagestransition('all 1s');

      setTimeout(() => {
        setpagestransition('');
      }, 1000);
    } else {
      setmenuleft('0');
      setmenubutleft('22vw');
      setpagewidth('80vw');
      setpagestransition('all 1s');

      setTimeout(() => {
        setpagestransition('');
      }, 1000);
    }
  }
  const homepage = () => {
    if(homedisplay == 'block')return;
    sethomedisplay('block');
    settoolsdisplay('none');
    setsettingdisplay('none');
  }
  const toolpage = () => {
    if(toolsdisplay == 'block')return;
    sethomedisplay('none');
    settoolsdisplay('block');
    setsettingdisplay('none');
  }
  const settingpage = () => {
    if(settingdisplay == 'block')return;
    sethomedisplay('none');
    settoolsdisplay('none');
    setsettingdisplay('block');
  }

  document.addEventListener('keydown', e => {
    if(e.key === 'Tab') {
      showmenu();
    } else if(e.key === 'Escape'){
      if(settingdisplay == 'block') {
        homepage();
      } else{
        settingpage();
      }
    }
  })

  return (
    <div className="container" style={ {background: bgcolour} }>
      <img src={ Menulogo } alt="menu logo" id='menu' onClick={ showmenu } draggable='false' style={ {left: menubutleft, transition: pagestransition} }/>
      <div className="Menu" style={ {left:menuleft, transition: pagestransition, background: menucolour} } >
        <h2 onClick={ homepage }>Home</h2>
        <h2 onClick={ toolpage }>Tools</h2>
        <h2 onClick={ settingpage }>Settings</h2>
      </div>
      <Settings style={ {width: pagewidth, display: settingdisplay, transition: pagestransition} }/>
      <Home style={ {width: pagewidth, display: homedisplay, transition: pagestransition} }/>
      <Tools style= { {width: pagewidth, display: toolsdisplay, transition: pagestransition} }></Tools>
    </div>
  );
}

export default App;
