import connectDB from "./DB/index.js"
import dotenv from "dotenv"

dotenv.config()

console.log(`database uri value ${process.env.DATABASE_URI}`);

connectDB()
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

