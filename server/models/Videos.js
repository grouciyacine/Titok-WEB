import mongoose from 'mongoose'

const Video=new mongoose.Schema({
    title:{
        type:String,
        default:''
    },
    url:{
        type:String,
        default:'',
    },
    likesID:[String],
    hashtags:[String],
    userId:{type:String,default:''}

},{timestamps:true})
export default mongoose.model('Video',Video)