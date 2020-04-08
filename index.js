const express = require('express')
const { Server } = require('http')
const morgan = require('morgan')

const app = express()
const server = Server(app)

app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('hello')
})

const port = process.env.PORT || 3000
server.listen(port)
console.log(`start server: port ${port}`)
