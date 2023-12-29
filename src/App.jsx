import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import Menulogo from './assets/Menu.svg';
import Home from './Home';
import Settings from  './Settings';
import Tools from './Tool';

function App() {
  const [menuleft, setmenuleft] = useState('-20vw');
  const [menubutleft, setmenubutleft] = useState('2vw');
  const [settingtop, setsettingtop] = useState('-100vh');
  const [pagewidth, setpagewidth] = useState('100vw');
  const [homedisplay, sethomedisplay] = useState('block');
  const [toolsdisplay, settoolsdisplay] = useState('none');
  const [pagestransition, setpagestransition] = useState('');
  const [editusernamedisplay, seteditusernamedisplay] = useState('none');
  const [editusernameanim, seteditusernameanim] = useState('');
  const [editinputanim, seteditinputanim] = useState('');
  var username = localStorage.getItem('username');

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
  const showsetting = () => {
    if(settingtop == '0') {
      setsettingtop('-100vh');
    } else {
      setsettingtop('0');
    }
  }
  const showuser = () => {
    if(editusernamedisplay == 'block') {
      seteditusernameanim('userclose 250ms linear');
      seteditinputanim('inputclose1 250ms linear');
      setTimeout(() => {
        seteditusernamedisplay('none');
        seteditusernameanim('');
      }, 250);
    } else {
      seteditusernamedisplay('block');
      seteditusernameanim('useropen 250ms linear');
      seteditinputanim('inputopen1 250ms linear');
      setTimeout(() => {
        seteditusernameanim('');
        seteditinputanim('');
      }, 250);
    }
  }
  const homepage = () => {
    if(homedisplay == 'block')return;
    sethomedisplay('block');
    settoolsdisplay('none');
  }
  const toolpage = () => {
    if(toolsdisplay == 'block')return;
    sethomedisplay('none');
    settoolsdisplay('block');
  }
  const setusername = (e) => {
    let name = e.target.value;
    localStorage.setItem('username', name);
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
      <img src={ Menulogo } alt="menu logo" id='menu' onClick={ showmenu } draggable='false' style={ {left: menubutleft, transition: pagestransition} }/>
      <h2 className="setting" onClick={ showsetting }>Settings</h2>
      <h2 className="setting username" onClick={showuser}>Username</h2>
      <div className="edituser" style={ {display: editusernamedisplay, animation: editusernameanim}}>
        <input type="text" onChange={setusername} placeholder="Username:" id="username" style={ {animation: editinputanim} }/>
      </div>
      <div className="Menu" style={ {left:menuleft, transition: pagestransition} } >
            <h2 onClick={homepage}>Home</h2>
            <h2 onClick={toolpage}>Tools</h2>
        </div>
      <Settings style={ {top: settingtop} }/>
      <Home style={ {width: pagewidth, display: homedisplay, transition: pagestransition} }/>
      <Tools style= { {width: pagewidth, display: toolsdisplay, transition: pagestransition} }></Tools>
    </div>
  );
}

export default App;
