import express from 'express'
const app = express()
require('dotenv')
require('express-async-errors')
import kiesiRouter from './routes/kiesit'
import bodyParser from 'body-parser'
const cookieParser = require('cookie-parser')
const cors = require('cors');
app.use(cors());
app.use(bodyParser.text({type:"*/*"}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true })) //https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
app.use(express.json())
//app.use(morgan('dev'))
app.use('/', kiesiRouter)
export default app
