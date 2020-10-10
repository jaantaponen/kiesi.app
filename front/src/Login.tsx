import React, { useEffect, useState } from 'react';

import fetch from 'node-fetch';
import './Login.css';

export default ({ refresh }: { refresh: any }) => {

  const getJwt = async () => {
    try {
      const res = await (await fetch('/jwt')).json();
      localStorage.setItem('token', res.token);
    } catch (e) {
      localStorage.setItem('token', "debug");
    } finally {
      //refresh();
    }
  }

  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    (async () => {
      //await getJwt();
      //refresh();
    })();
  }, [])
  return (
    <form className='container'>
      <h1 className="login-title">kiesi.app</h1>
      <input className="login-element" placeholder="username" type="text" name="name" value={name} onChange={(e) => {
        setName(e.target.value);
      }}/>
      <input className="login-element" placeholder="password" type="password" name="password" value={password} onChange={(e) => {
        setPassword(e.target.value);
      }}/>
      <button className="login-element main-button" onClick={getJwt}>Log in</button>
    </form>
  )
}
