import mongoose from "mongoose";
const Comment=new mongoose.Schema({
    userId:{type:String, required:true},
    comment:{type:String, required:true},
    videoId:{type:String, required:true},
    likes:[String],
    replay:{type:String}
},{timestamps:true})

export default  mongoose.model("Comment", Comment)