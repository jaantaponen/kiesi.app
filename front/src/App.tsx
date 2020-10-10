import React, { useState } from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Map from './Map';
import Login from './Login';


const tokenInStorage = () => {
  return localStorage.getItem('token') !== null;
};
function App() {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const refresh = () => {
    if (tokenInStorage()) setLoggedIn(true);
  }
  return (
    <div className="App">
      <BrowserRouter>
        {isLoggedIn ? 
          <Route path="/">
            <Map />
          </Route> : <Login refresh={refresh} />}
      </BrowserRouter>
    </div>
  );
}

export default App;
