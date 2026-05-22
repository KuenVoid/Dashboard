import { useState, useEffect, useRef } from "react";
import useLocalStorage from './hooks/useLocalStorage';
import Menulogo from './assets/Menu.svg';
import Home from './Home';
import Settings from  './Settings';
import Tools from './Tool';
import Menu from './components/Menu';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingdisplay, setsettingdisplay] = useState('none');
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
    const willOpen = !menuOpen;
    setMenuOpen(willOpen);
    setpagestransition('all 260ms ease');
    // toggle the CSS-driven menu visibility
    document.body.classList.toggle('menu-open', willOpen);
    setTimeout(() => {
      setpagestransition('');
    }, 300);
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
      <img src={ Menulogo } alt="menu logo" id='menu' onClick={ showmenu } draggable='false' style={ {transition: pagestransition} }/>
        <Menu background={menucolour} onHome={homepage} onTools={toolpage} onSettings={settingpage} />
        <Settings style={ {display: settingdisplay, transition: pagestransition} }/>
        <Home style={ {display: homedisplay, transition: pagestransition} }/>
        <Tools style={ {display: toolsdisplay, transition: pagestransition} }></Tools>
    </div>
  );
}

export default App;
