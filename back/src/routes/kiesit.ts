import express from 'express'
const router = express.Router()
import kiesi_service from '../services/kiesi_service'


router.get('/', async (_request, response) => {
  await kiesi_service.testConnection()
  response.status(200).send("nauraaaaa")
})


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
