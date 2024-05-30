import mongoose from 'mongoose'

///creating user schema
const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
        }, 
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
    }, 
    {timestamps:true} /// we want to save 2 things while creating the user the time of creationa nd the time of update
)

const User =  mongoose.model('User', userSchema)


export default User;