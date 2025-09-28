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
app.use(express.urlencoded({extended: true,limit:'20kb'})) // this is for the data we get from the url and how we can access url data 
app.use(express.static('public')) // this is for the static files like images ,css files and js files
app.use(cookieParser()) // via this we can perform curd opertions on cookies

// this above three are the configuration of the backend which will be 
// used in the backend and these are middelwares used by app.use(functions (via npm packages ))


// ********************************************************
// we will create routes here
import userRouter from "./routes/user.route.js"
app.use("/api/v1/users", userRouter) // this is the main route for the user
// the url will look like this http://localhost:5000/api/v1/users/register
// after the api/v1/user this will give the route to userrouter menthod which have a /register route
export default app;