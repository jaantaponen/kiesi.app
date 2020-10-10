import express from 'express'
const router = express.Router()
import kiesi_service from '../services/kiesi_service'
const jwt = require('jsonwebtoken')
require('dotenv').config()


var jwtmiddleware = require('express-jwt')

router.get('/', async (_request, response) => {
  await kiesi_service.testConnection()
  response.status(200).send("nauraaaaa")
})

router.post('/login', async (req, res) => {
  const reqq = JSON.parse(req.body)
  let username = reqq.username
  let password = reqq.password

  const id = await kiesi_service.getUser(username, password)

  // Neither do this!
  if (!id) {
    return res.status(401).send()
  }
  //use the payload to store information about the user such as username, user role, etc.
  let payload = { user: id }

  console.log(process.env.ACCESS_TOKEN_LIFE)
  //create the access token with the shorter lifespan
  let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: parseInt(<any>process.env.ACCESS_TOKEN_LIFE)
  })
 
  //send the access token to the client inside a cookie
  res.cookie("jwt", accessToken, { secure: true, httpOnly: true })
  res.send()
  return ""
})

router.get('/protected',
  jwtmiddleware({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ['HS256'] }),
  (req, res) => {
    console.log((<any>req).user)
    if (!(<any>req).user) return res.sendStatus(401);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send((<any>req).user.user)
});


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
