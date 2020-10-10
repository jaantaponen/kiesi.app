import React, { useEffect, useState } from 'react';

import fetch from 'node-fetch';
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

  const [name, setName] = useState<string>("username");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    (async () => {
      await getJwt();
      refresh();
    })();
  }, [])
  return (
    <form className='container'>
      <div>
        <input type="text" name="name" value={name} onChange={(e) => {
          setName(e.target.value);
        }}/>
      </div>
      <div>
        <input type="password" name="password" value={password} onChange={(e) => {
          setPassword(e.target.value);
        }}/>
      </div>
      <div>
        <button onClick={getJwt}>log in</button>
      </div>
    </form>
  )
}