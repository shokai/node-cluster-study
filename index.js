const cluster = require('cluster')
const express = require('express')
const { Server } = require('http')
const morgan = require('morgan')

const workerNum = Number.parseInt(process.env.CLUSTER)

if (cluster.isMaster && workerNum > 1){
  console.log(`start master(${process.pid})`)
  for (let i = 0; i < 4; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
    cluster.fork()
  })
} else {
  startWorker()
}

function startWorker () {
  const app = express()
  const server = Server(app)

  app.use(morgan(`worker(${process.pid}) :method :url :status :response-time ms`))

  app.get('/', (req, res) => {
    res.send(`hello from worker(${process.pid})`)
  })

  const port = process.env.PORT || 3000
  server.listen(port)
  console.log(`start worker(${process.pid}): port ${port}`)
}
