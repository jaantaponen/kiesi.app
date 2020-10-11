import express from 'express'
const router = express.Router()
import kiesi_service from '../services/kiesi_service'
const jwt = require('jsonwebtoken')
require('dotenv').config()
import distance from '@turf/distance'
import {point} from '@turf/helpers'

var jwtmiddleware = require('express-jwt')

router.get('/', async (_request, response) => {
  await kiesi_service.testConnection()
  response.status(200).send("pistetaan pojalle pipo paalle")
})

router.post('/login', async (req, res) => {
  const reqq = JSON.parse(req.body)
  let username = reqq.username
  let password = reqq.password

  const id = await kiesi_service.getUser(username, password)

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
  //res.cookie("jwt", accessToken, { secure: true, httpOnly: true })
  res.status(200).send({"bearer":accessToken})
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

router.get('/pools',
  jwtmiddleware({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    console.log((<any>req).user)
    if (!(<any>req).user) return res.sendStatus(401);
    res.setHeader('Content-Type', 'application/json');

    console.log((<any>req).user.user.id)
    const pools = await kiesi_service.getPoolsForUser((<any>req).user.user.id)

    return res.status(200).send(pools)
  });

  router.get('/pool-locations/:poolid',
  jwtmiddleware({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    console.log((<any>req).user)
    if (!(<any>req).user) return res.sendStatus(401);
    res.setHeader('Content-Type', 'application/json');

    const poolId = req.params.poolid;
    console.log(poolId);
    const pools = await kiesi_service.getPoolWithAllLocations(poolId);
    const poolsWithDistances = pools.map((i: { startlon: number; startlat: number; endlon: number; endlat: number }) => {
      const startpoint = point([i.startlon, i.startlat]);
      const endpoint = point([i.endlon, i.endlat]);
      return {
        "startlat": i.startlat,
        "startlon": i.startlon,
        "endlat": i.endlat,
        "endlon": i.endlon,
        "dist": distance(startpoint, endpoint),
        "isdriver": false
      }
    });
    const maxvalue = poolsWithDistances.reduce((prev: { dist: number }, current: { dist: number }) => (prev.dist > current.dist) ? prev : current);
    poolsWithDistances[poolsWithDistances.indexOf(maxvalue)].isdriver = true;


    return res.status(200).send(poolsWithDistances)
  });


//post joinpool(userid (jwt), poolid) -> userid added to pool
router.post('/joinpool',
  jwtmiddleware({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    if (!(<any>req).user) return res.sendStatus(401);

    const reqq = JSON.parse(req.body)
    const poolid = reqq.poolid
    const startpoint = reqq.startpoint
    const endpoint = reqq.endpoint
    const id = (<any>req).user.user.id
    const ret = await kiesi_service.joinPool(id, poolid, startpoint, endpoint)
    //console.log(ret)
    return res.status(200).send(ret)
  });

//post joinpool(userid (jwt), poolid) -> userid added to pool
router.post('/createpool',
  jwtmiddleware({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    if (!(<any>req).user) return res.sendStatus(401);
    const reqq = JSON.parse(req.body)
    const startpoint = reqq.startpoint
    const endpoint = reqq.endpoint
    const poolname = reqq.poolname
    const id = (<any>req).user.user.id
    const ret = await kiesi_service.createPool(id, startpoint, endpoint, poolname)
    //console.log(ret)
    return res.status(200).send(ret)
});

router.post('/search',
  jwtmiddleware({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ['HS256'] }),
  async (req, res) => {
    if (!(<any>req).user) return res.sendStatus(401);
    const pools = await kiesi_service.getPoolsWithLocations()
    
    const reqq = JSON.parse(req.body)
    const startpoint = point(reqq.startpoint)
    const endpoint = point(reqq.endpoint)
    //console.log("distance between params " + distance(startpoint, endpoint))
    
    const makePoints = pools.map((i: { userid: any; id: any; startlat: any; startlon: any; endlat: any; endlon: any; poolname: any; poolid: any }) => {
      return {
        "userid": i.userid,
        "poolid": i.poolid,
        "startpoint": point([i.startlon, i.startlat]),
        "endpoint": point([i.endlon, i.endlat]),
        "name": i.poolname
      }
    })
    const userId = (<any>req).user.user.id
    const userPools = await kiesi_service.getPoolsForUser(userId)
    const userPoolId = userPools.map((i: { poolid: any }) => {
      return i.poolid;
    });
    const filtered = makePoints.filter((i: { startpoint: any; endpoint: any }) => {
      return distance(i.startpoint, startpoint) <= 20 && distance(i.endpoint, endpoint) <= 20
    })
    const foundId: number[] = [];
    const ret = [];
    for (let i = 0; i < filtered.length; i++) {
      let id = filtered[i].poolid;
      if (!foundId.includes(id)) {
        foundId.push(id);
        console.log(!userPoolId.includes(id));
        if(!userPoolId.includes(id)) {
          ret.push(filtered[i]);
        }
      }
    };
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(ret)
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
