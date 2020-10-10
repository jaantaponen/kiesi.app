import express from 'express'
const router = express.Router()
import kiesi_service from '../services/kiesi_service'
const jwt = require('jsonwebtoken')
require('dotenv').config()

router.get('/', async (_request, response) => {
  await kiesi_service.testConnection()
  response.status(200).send("nauraaaaa")
})



// Never do this!
let users = {
  john: { password: "passwordjohn" },
  mary: { password: "passwordmary" }
}
router.post('/login', async (req, res) => {
  const reqq = JSON.parse(req.body)
  let username = reqq.username
  let password = reqq.password

  // Neither do this!
  if (!username || !password || (<any>users)[username].password !== password) {
    return res.status(401).send()
  }
  //use the payload to store information about the user such as username, user role, etc.
  let payload = { username: username }
  //create the access token with the shorter lifespan
  let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.ACCESS_TOKEN_LIFE
  })

  //send the access token to the client inside a cookie
  res.cookie("jwt", accessToken, { secure: true, httpOnly: true })
  res.send()
  return ""
})






/*
const ensureAuth = (req: { cookies: { jwt: any } }, res: { status: (arg0: number) => { (): any; new(): any; send: { (): any; new(): any } } }, next: () => void) => {
  let accessToken = req.cookies.jwt

  //if there is no token stored in cookies, the request is unauthorized
  if (!accessToken){
      return res.status(403).send()
  }
  let payload
  try{
      //use the jwt.verify method to verify the access token
      //throws an error if the token has expired or has a invalid signature
      payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
      next()
  }
  catch(e){
      //if an error occured return request unauthorized error
      return res.status(401).send()
  }
}
*/



/**
 * 
 * post /login
 * get /pools (userid) -> list<poolid>
 * get /pool (poolid)  -> poolinfo
 * post /joinpool (start, end, optional: time to reach) -> status(201).send(poolid)
 * post /createpool (start, end, times, maybe: preferred card)
 * 
 * 
 */

export default router
