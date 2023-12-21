import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Menu from './menu';
import Menulogo from './assets/Menu.svg';
import Home from './Home';
import Settings from  './Settings';

function App() {
  const [menuleft, setmenuleft] = useState('-20vw');
  const [menubutleft, setmenubutleft] = useState('2vw');
  const [settingtop, setsettingtop] = useState('-100vh');
  const [pagewidth, setpagewidth] = useState('100vw');

  const showmenu = () => {
    if(menuleft == '0') {
      setmenuleft('-20vw');
      setmenubutleft('2vw');
      setpagewidth('100vw');
    } else {
      setmenuleft('0');
      setmenubutleft('22vw');
      setpagewidth('80vw');
    }
  }
  const showsetting = () => {
    if(settingtop == '0') {
      setsettingtop('-100vh');
    } else {
      setsettingtop('0');
    }
  }

  document.addEventListener('keydown', e => {
    if(e.key === 'Tab') {
      showmenu();
    } else if(e.key === 'Escape'){
      showsetting();
    }
  })

  return (
    <div className="container">
      <img src={ Menulogo } alt="menu logo" id='menu' onClick={ showmenu } draggable='false' style={ {left: menubutleft} }/>
      <h2 id="setting" onClick={ showsetting }>Settings</h2>
      <Menu style={ {left: menuleft} } />
      <Settings style={ {top: settingtop} }/>
      <Home style={ {width: pagewidth} }/>
    </div>
  );
}

export default App;
