import 'dotenv/config'
import express from 'express'
import nodeCleanup from 'node-cleanup'
import routes from './routes.js'
import http from "http"
import compression from 'compression'
import { init, cleanup } from './whatsapp.js'
import cors from 'cors'


const mode = process.env.NODE_ENV || "production"
const lhost = process.env.LOCAL_HOST || "localhost"
const lport = parseInt(process.env.LOCAL_PORT ?? 8000)
const rhost = process.env.REMOTE_HOST || undefined

const app = express()

app.use(cors())
app.use(compression)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/', routes)

const server = http.createServer(app)

const listenerCallback = () => {
    init()
    console.log('server running')
}

if (mode === "production") {
    server.listen('', rhost, listenerCallback)
} else {
    server.listen(lport, lhost, listenerCallback)
}

nodeCleanup(cleanup)

export default app
