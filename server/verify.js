import jwt from 'jsonwebtoken';
import {AuthenticationError} from 'apollo-server'
const verify=async(context)=>{
    const header=context.req.headers.authorization
    if(!header) return  new AuthenticationError('Error No Token Exist')
    const token=header.split('Bearer ')[1]
    if (!token) return new AuthenticationError('Error Invalid Bearer')
    const user=jwt.verify(token,process.env.JWT)
    const userId=user.id
    console.log(userId)
    return userId
}
export default verify