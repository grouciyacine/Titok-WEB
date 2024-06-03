import mongoose from 'mongoose'

const User=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    imgUrl:{
        type:String,
        default:""
    },
    password:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:false,
    },
    Bio:{
        type:String,
        required:false,
    },
    likes:{
        type:Number,
        default:0
    },
    followers:[String],
    following:[String],
},{timestamps:true})
export default mongoose.model('User', User)