import { gql } from 'apollo-server'
const typeDef = gql`
 scalar Upload
type User{
    id:ID!
    name:String!,
    email:String!,
    password:String!,
    imgUrl:String!,
    likes:String!,
    followers:[ID!],
    following:[ID!],
    token:String!,
    createdAt:String!
    Bio:String!
    username:String!
}
type Video{
    id:ID!
    userId:String!
    title:String!,
    url:String,
    time:String!,
    hashtags:[String!],
    likesID:[String!],
    createdAt:String!
}
type Comment{
    userId:String!
    comment:String!
    videoId:String!
    createdAt:String!
    id:String!,
    likes:[String!],
    
}
type FieldUpload{
    url:String!
}
input VideoInput{
    title:String!,
    url:String,
    hashtags:[String!],
}
input RegisterInput{
    email:String!,
    name:String!,
    password:String!,
}
input LoginInput{
    email:String!,
    password:String!,
}
type File {
    filename: String!
    mimetype: String!
    encoding: String
}
type VideosWithUser{
    video:Video,
    user:User
}
type CommentWithUser{
    user:User!,
    comment:Comment!
}
input UpdateUser{
    username:String,
    name:String,
    imgUrl:String,
    Bio:String
}
input addComment{
    comment:String!
    vidId:String!
}
type Query{
getUser:User!
GetVideosRandom:[VideosWithUser!]
GetMyVideos:[Video!]
GetLikedVideos:[Video!]
getComments(vidId:String!):[CommentWithUser!]
getFile(fileId:String!):String!
}
type Mutation{
Register(register:RegisterInput!):User!
Login(login:LoginInput!):User!
CreateVideo(vid:VideoInput):Video!
singleUpload(file: Upload!): File!
uploadVideo(file:Upload!): File!
likeVideo(id:String!): String!
dislikeVideo(id:String!): String!
UpdateUser(update:UpdateUser!):User!
follows(Id:String!):User!
disallowing(Id:String!):User!
addComment(comm:addComment!): String!
likeComment(Id:String!):String!
DislikeComment(Id:String!):String!
}
`
export default typeDef