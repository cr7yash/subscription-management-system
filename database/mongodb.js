import {mongoose} from "mongoose";
import{DB_URI,NODE_ENV} from "../config/env.js"

if(!DB_URI){
    throw new Error("Please provide DB_URI in the environment variables")
}

const connectToDatabase = async () =>{
    try {
        await mongoose.connect(DB_URI)
        console.log("Connected to MongoDB")
        console.log(`Environment: ${NODE_ENV}`)
    } catch (error) {
        console.error("Failed to connect to the database",error)
        process.exit(1)
    }
}

export default connectToDatabase