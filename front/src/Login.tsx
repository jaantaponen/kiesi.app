import React, { useEffect, useState } from 'react';

import fetch from 'node-fetch';
import './Common.css';
import './Login.css';
import { Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

export default () => {

  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [tokenExists, setToken] = useState("");
  const getJwt = async () => {
    try {
      const res = await fetch('http://localhost:3001/login', {
        method: "POST",
        body: JSON.stringify({username: name, password: password}),
      });
      const token = (await res.json()).bearer;
      localStorage.setItem('token', token);
      setToken("kissa");
      console.log("token found");
    } catch (e) {
      console.log(name, password);
      console.log(e)
      //  localStorage.setItem('token', "debug");
    } finally {

    }
  }


  useEffect(() => {
    (async () => {
      await getJwt();
    })();
  }, []);
  return (
    <>
    {tokenExists === "" || !localStorage.getItem("token") ? 
      <div className='container'>
        <h1 className="login-title">kiesi.app</h1>
        <input className="login-element" placeholder="username" type="text" name="name" value={name} onChange={(e) => {
          console.log(e.target.value);
          setName(e.target.value);
        }}/>
        <input className="login-element" placeholder="password" type="password" name="password" value={password} onChange={(e) => {
          setPassword(e.target.value);
        }}/>
        <button className="login-element main-button" onClick={getJwt}>Log in</button>
      </div>
    : <Redirect to="/"/>}
    </>
  )
}
