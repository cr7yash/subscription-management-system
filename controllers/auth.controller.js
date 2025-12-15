import mongoose from "mongoose"
import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js"

export const signUp = async(req,res,next)=>{
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {email,password,name} = req.body
        console.log(email,password,name)
        const user = await User.findOne({email})
        if(user){
            const error = new Error("User already exists")
            error.statusCode = 409
            throw error
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await User.create([{email,password: hashedPassword,name}], {session})
        const token = jwt.sign({userId:newUser[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})
        await session.commitTransaction()
        session.endSession()
        res.status(201).json({
            success:true,
            message:"User created successfully",
            data:{
                user:newUser[0],
                token
            }
        })
        } catch (error) {
            session.abortTransaction()
            session.endSession()
            next(error)
        }
}

export const signIn = async(req,res,next)=>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email})
        if(!user){
            const error = new Error('User not found')
            error.statusCode = 404
            throw error
        }

        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(!isPasswordValid){
            const error = new Error('Invalid credentials')
            error.statusCode = 401
            throw error
        }
        const token = jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})

        res.status(200).json({
            success:true,
            message:"User signed in successfully",
            data:{
                user:user,
                token
            }
        })
    } catch (error) {
        next(error)
    }
}

export const signOut = async(req,res,next)=>{
    try {
        res.json({message:"Sign Out"})
    } catch (error) {
        next(error)
    }
}

