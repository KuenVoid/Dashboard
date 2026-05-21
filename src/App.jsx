import { useState, useEffect, useRef } from "react";
import useLocalStorage from './hooks/useLocalStorage';
import Menulogo from './assets/Menu.svg';
import Home from './Home';
import Settings from  './Settings';
import Tools from './Tool';
import Menu from './components/Menu';

function App() {
  const [menuleft, setmenuleft] = useState('-20vw');
  const [menubutleft, setmenubutleft] = useState('2vw');
  const [settingdisplay, setsettingdisplay] = useState('none');
  const [pagewidth, setpagewidth] = useState('100vw');
  const [homedisplay, sethomedisplay] = useState('block');
  const [toolsdisplay, settoolsdisplay] = useState('none');
  const [pagestransition, setpagestransition] = useState('');
  const [menucolour] = useLocalStorage('menucolor', 'linear-gradient(rgb(50, 50, 255), rgb(50, 45, 255))');
  const [bgcolour] = useLocalStorage('bgcolor', '#e6e6e6');
  const [blockcolour] = useLocalStorage('blockcolor', '#ffffff');

  // Prefer CSS variable `--blockcolor` for styling; avoid direct DOM writes.

  useEffect(() => {
    const root = document.documentElement;
    try {
      if (bgcolour) root.style.setProperty('--bgcolor', bgcolour);
      if (menucolour) root.style.setProperty('--menucolor', menucolour);
      if (blockcolour) root.style.setProperty('--blockcolor', blockcolour);
    } catch (e) {
      // ignore
    }
  }, [bgcolour, menucolour, blockcolour]);

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

  const settingDisplayRef = useRef(settingdisplay);
  useEffect(() => { settingDisplayRef.current = settingdisplay; });

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        showmenu();
      } else if (e.key === 'Escape') {
        if (settingDisplayRef.current === 'block') {
          homepage();
        } else {
          settingpage();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="container" style={ {background: bgcolour} }>
      <img src={ Menulogo } alt="menu logo" id='menu' onClick={ showmenu } draggable='false' style={ {left: menubutleft, transition: pagestransition} }/>
      <Menu left={menuleft} transition={pagestransition} background={menucolour} onHome={homepage} onTools={toolpage} onSettings={settingpage} />
      <Settings style={ {width: pagewidth, display: settingdisplay, transition: pagestransition} }/>
      <Home style={ {width: pagewidth, display: homedisplay, transition: pagestransition} }/>
      <Tools style= { {width: pagewidth, display: toolsdisplay, transition: pagestransition} }></Tools>
    </div>
  );
}

export default App;
