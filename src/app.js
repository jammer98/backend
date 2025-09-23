import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()

// app.use  this app.use is for middelwares and configurations 

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: '20kb'}))
app.use(express.urlencoded({extended: true,limit:'20kb'}))
app.use(express.static('public'))
app.use(cookieParser())

// this above three are the configuration of the backend which will be 
// used in the backend and these are middelwares used by app.use(functions (via npm packages ))


export default app;