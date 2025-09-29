import mongoose from "mongoose";
import {DB_NAME}  from "../constants.js";

const connectDB = async () =>{
    try {
        const mongodbObjectReturn = await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`)
        console.log("mongoDB is connected !!")
        console.log(`mongo DB return object is here ${mongodbObjectReturn.connection.host}`)
    } catch (error) {
        console.log("mongoDB error ",error)
        process.exit(1);
        // throw error;
        
    }
}

export default connectDB