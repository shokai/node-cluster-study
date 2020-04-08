const cluster = require('cluster')
const express = require('express')
const { Server } = require('http')
const morgan = require('morgan')

if (cluster.isMaster){
  console.log(`start master(${process.pid})`)
  for (let i = 0; i < 4; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })
} else {
  const app = express()
  const server = Server(app)

  app.use(morgan('dev'))

  app.get('/', (req, res) => {
    res.send(`hello from worker(${process.pid})`)
  })

  const port = process.env.PORT || 3000
  server.listen(port)
  console.log(`start worker(${process.pid}): port ${port}`)
}
