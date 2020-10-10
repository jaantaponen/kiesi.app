import app from './src/app' // the actual Express application
import http from 'http'
//const config = require('./src/utils/config')
const server = http.createServer(app)
const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
