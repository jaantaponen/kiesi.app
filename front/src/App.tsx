import React, { useEffect, useState } from 'react';
import './App.css';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import Map from './Map';
import Login from './Login';
import PoolTool from './PoolTool';
import Sidebar from './Sidebar';
import MenuButton from './MenuButton';


const tokenInStorage = () => {
  return localStorage.getItem('token') !== null;
};
function App() {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const match = useLocation();
  document.getElementById("root")?.addEventListener(("touchmove"), (ev) => {
    ev.preventDefault();
  });
  useEffect(() => {
    if (tokenInStorage()) setLoggedIn(true);
    else setLoggedIn(false);
  }, [match])

  useEffect(() => {
    console.log(match);
    console.log(isLoggedIn);
  }, [match, isLoggedIn])

  const onMenuClick = () => {
    setMenuVisible(!menuVisible);
  }
  console.log(isLoggedIn, match, tokenInStorage)
  return (
    <div className="App">
      <Switch>
        <Route path="/login" component={Login} />
        <div>
          <div id="container" className={menuVisible ? "container-menu-visible" : ""}>
            <MenuButton onClick={onMenuClick} />
            <Route path="/" exact render={() => {
              if (tokenInStorage()) {
                return <Map />
              } else {
                return <Redirect to="/login" />
              }
            }} />
            <Route path="/tool" exact render={() => {
              if (tokenInStorage()) {
                return <PoolTool />
              } else {
                return <Redirect to="/login" />
              }
            }} />
          </div>
          <Sidebar setVisible={setMenuVisible} />
        </div>
      </Switch>
    </div>
  );
}

export default App;
