import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../../models/User.js'
import Comment from '../../models/Comments.js'
import { UserInputError } from 'apollo-server'
import verify from '../../verify.js'
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import path from 'path'
import fs from 'fs'
export default {
    Query: {
        async getUser(_, { }, context, info) {
            const userId = verify(context)
            let id;
            await userId.then((value) => {
                id = value;
            })
            const user = await User.findById(id)
            return user
        },
        async getComments(parent,{vidId},context,info){
            const comments= await Comment.find({videoId:vidId})
            const ids=comments.map((id)=>id.userId)
            const users=await User.find({_id:{$in:ids}});
            const userMap={}
            users.forEach((user)=>{
                userMap[user._id] = user
            })
            const commentsWithUsers=await comments.map((comment)=>({
                comment:comment,
                user:userMap[comment?.userId]?userMap[comment?.userId]:null
            }))
            return commentsWithUsers
        }
    },
    Mutation: {
        async Register(_, { register: { email, name, password } }, context, info) {
            const user = await User.findOne({ email: email })
            console.log(user)
            if (user) {
                throw new UserInputError('User already registered'), {
                    errors: {
                        name: "User already exists",
                    }
                }
            }
            const hashPassword = bcrypt.hashSync(password, 12);
            const newUser = await User.create({ email: email, password: hashPassword, name: name })
            newUser.save()
            const token = jwt.sign({ id: newUser._id }, process.env.JWT)
            return {
                name: newUser.name, email: newUser.email, token: token, createdAt: newUser.createdAt,
                likes: newUser.likes, followers: newUser.followers, following: newUser.following, imgUrl: newUser.imgUrl
            }
        },
        async Login(_, { login: { email, password } }, context, info) {
            const user = await User.findOne({ email: email })
            if (!user) {
                throw new UserInputError('User Not Exist'), {
                    errors: {
                        name: "User Not exist",
                    }
                }
            }
            const passwordCompar = bcrypt.compareSync(password, user.password);
            if (!passwordCompar) {
                throw new UserInputError('Wrong Password'), {
                    errors: {
                        password: "Wrong Password",
                    }
                }
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT)
            return {
                name: user.name, email: user.email, token: token,
                createdAt: user.createdAt,
                likes: user.likes, followers: user.followers, following: user.following, imgUrl: user.imgUrl, Bio: user.Bio, username: user.username
            }
        },
        async follows(_, { Id }, context, info) {
            const userId = verify(context)
            let id;
            await userId.then((value) => {
                id = value;
            })
            const user = await User.findByIdAndUpdate(id, { $push: { followers: Id } })
            const token = jwt.sign({ id: user._id }, process.env.JWT)
            return {
                name: user.name, email: user.email, token: token,
                createdAt: user.createdAt,
                likes: user.likes, followers: user.followers, following: user.following, imgUrl: user.imgUrl, Bio: user.Bio, username: user.username
            }
        },
        async disallowing(_, { Id }, context, info) {
            const userId = verify(context)
            let id;
            await userId.then((value) => {
                id = value;
            })
            const user = await User.findByIdAndUpdate(id, { $pull: { followers: Id } })
            const token = jwt.sign({ id: user._id }, process.env.JWT)
            return {
                name: user.name, email: user.email, token: token,
                createdAt: user.createdAt,
                likes: user.likes, followers: user.followers, following: user.following, imgUrl: user.imgUrl, Bio: user.Bio, username: user.username
            }
        },
        async UpdateUser(_, { update: { username, name, imgUrl, Bio } }, context, info) {
            const userId = verify(context)
            let id;
            await userId.then((value) => {
                id = value;
            })
            const user = await User.findByIdAndUpdate(id, { username: username, name: name, imgUrl: imgUrl, Bio: Bio }, { new: true })
            const token = jwt.sign({ id: user._id }, process.env.JWT)
            return {
                name: user.name,
                username: user.username,
                email: user.email,
                imgUrl: user?.imgUrl,
                Bio: user?.Bio,
                likes: user?.likes,
                token: token,
                createdAt: user?.createdAt,
                followers: user?.followers,
                following: user?.following,

            }
        },
        async singleUpload(parent, { file }) {
            try {
                const { createReadStream, filename, mimetype } = await file;
                const uniqueFilename = `${uuidv4()}-${filename}`;
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);
                const uploadPath = path.join(__dirname, 'public', 'images', uniqueFilename);
                const stream = createReadStream();
                await new Promise((resolve, reject) => {
                    stream
                        .pipe(fs.createWriteStream(uploadPath))
                        .on('finish', () => resolve())
                        .on('error', (error) => {
                            unlinkSync(uploadPath); // Delete the file if an error occurs
                            reject(error);
                        });
                });
                return {
                    filename: uniqueFilename,
                    mimetype,
                    url: `http://localhost:4000/images/${uniqueFilename}`
                };
            } catch (error) {
                console.error(error);
                throw new Error('Failed to upload the file');
            }
        },
        async addComment(parent, { comm: { comment, vidId } }, context, info) {
            try {
                const userId = verify(context)
                let id;
                await userId.then((value) => {
                    id = value;
                })
                if(comment){
                    await new Comment({ userId: id, videoId: vidId, comment: comment }).save()
                    return 'add comment'
                }else{
                    return 'no comment added'
                }
            } catch (error) {
                console.log(error)
            }
        },
        async likeComment(parent,{Id},context,info){
            const userId = verify(context)
            let id;
            await userId.then((value) => {
                id = value;
            })
            await Comment.findByIdAndUpdate(Id,{$push:{likes:id}})
            return 'like comment'
        },
        async DislikeComment(parent,{Id},context,info){
            const userId = verify(context)
            let id;
            await userId.then((value) => {
                id = value;
            })
            const comment=await Comment.findByIdAndUpdate(Id,{$pull:{likes:id}})
            return 'disLike comment'
        }
    }
}