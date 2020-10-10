import express from 'express'
const router = express.Router()
import kiesi_service from '../services/kiesi_service'


router.get('/', async (_request, response) => {
  await kiesi_service.testConnection()
  response.status(200).send("nauraaaaa")
})

export default router
