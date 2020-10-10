import React, { useEffect, useState } from 'react';
import './App.css';
import {BrowserRouter, Redirect, Route, Switch, useLocation, useRouteMatch} from 'react-router-dom';
import Map from './Map';
import Login from './Login';
import PoolTool from './PoolTool';


const tokenInStorage = () => {
  return localStorage.getItem('token') !== null;
};
function App() {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const match = useLocation();
  useEffect(() => {
    if (tokenInStorage()) setLoggedIn(true);
    else setLoggedIn(false);
  }, [match])
  useEffect(() => {
    console.log(match);
  }, [match, isLoggedIn])
  return (
    <div className="App">
        <Switch>
          <Route path="/" exact render={() => {
            if (tokenInStorage()) {
              return <Map />
            } else {
              return <Redirect to="/login" />
            }
          }}/>
          <Route path="/tool" exact render={() => {
            if (tokenInStorage()) {
              return <PoolTool />
            } else {
              return <Redirect to="/login" />
            }
          }}/>
          <Route path="/login"  component={Login}/>
        </Switch>
    </div>
  );
}

export default App;
