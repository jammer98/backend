import app from "./app.js";
import connectDB from "./DB/index.js"
import dotenv from "dotenv"

dotenv.config()

console.log(`database uri value ${process.env.DATABASE_URI}`);

connectDB()
.then(()=>{
    app.on("error" ,(error)=>{
        console.log(" SERVER ERRORR: ",error)
        throw error
    })
    app.listen(process.env.PORT || 8000,() =>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("DB connection failed  !!!! ",error)
})















































// import mongoose from "mongoose"
// import { DB_NAME } from "./constants";

// (async() =>{
//     try {
//         mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`)
        
//     } catch (error) {
//         console.error("ERROR",error)
//         throw error;
//     }
// })()

