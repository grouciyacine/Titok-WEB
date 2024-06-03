import { FaHeart } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { IoMdShareAlt } from "react-icons/io";
import { FaCirclePlus } from "react-icons/fa6";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import React, { useCallback, useEffect, useState } from "react";
import { GET_RANDOM_VIDEOS } from "../screens/Home";
import {  useSelector } from "react-redux";
import { GETLIKEDVIDEOS } from "../screens/Profile";
import Input from "./Input";
import { BsEmojiSmile } from "react-icons/bs";
import { GoMention } from "react-icons/go";
import { FiSend } from "react-icons/fi";
import EmojiPicker from 'emoji-picker-react';
import Comments from "./Comments";
import {AiOutlineClose} from 'react-icons/ai'

type Props = {
    video: Object | any
}

function LeftSide({ video }: Props) {
    const replayed=useSelector((state:any)=>state.user.replay)
    const [toggleEmoji, setToggleEmoji] = useState(false)
    const { data: userId } = useQuery(USER_ID)
    const [openComments, setOpenComments] = useState<boolean>(false)
    const user = useSelector((state: any) => state.user)
    const [comment, setComment] = useState<any>('')
    const [refresh, setRefresh] = useState(false)
    const [LikeVideo] = useMutation(
        LIKE_VIDEO, {
        refetchQueries: [{ query: GET_RANDOM_VIDEOS }, { query: USER_ID }, { query: GETLIKEDVIDEOS }],
        onError(err) {
            console.log(JSON.stringify(err, null, 2))
        }
        , variables: { id: video?.video?.id }
    }
    )
    
    const [DisLikeVideo] = useMutation(
        DISLIKE_VIDEO, {
        refetchQueries: [{ query: GET_RANDOM_VIDEOS }, { query: USER_ID }, { query: GETLIKEDVIDEOS }],
        onError(err) {
            console.log(JSON.stringify(err, null, 2))
        }
        , variables: { id: video?.video?.id }
    }
    )
    const handleLikes = useCallback(() => {
        if (video?.video?.likesID?.includes(userId?.getUser.id)) {
            DisLikeVideo()
        } else {
            LikeVideo()
        }
    }, [video?.video?.likesID])
    const handleEmojiClick = (emojiObject: any) => {
        const emoji = emojiObject.emoji;
        setComment(comment ? comment + emoji : '' + emoji);
        
    };
    const { data: comments, loading, refetch } = useQuery(GET_COMMENTS, {
        variables: { vidId: video?.video?.id },
        onError(err) {
            console.log(JSON.stringify(err, null, 2))
        }
    })
    const [AddComment] = useMutation(ADD_COMMENTS, {
        variables: { vidId: video?.video?.id, comment:comment },
        onError(err) {
            console.log(JSON.stringify(err, null, 2))
        },
        refetchQueries: [{ query: GET_COMMENTS }]
    })
    useEffect(() => {
        setRefresh(true)
        comments; refetch();
    }, [refetch(),refresh])
    useEffect(()=>{
        setComment(replayed?replayed+'':''+comments)
    },[replayed])
    return (
        <div className="text-white z-40 absolute right-4 flex flex-col space-y-3 justify-between items-center  bottom-96 md:bottom-32">
            <div className="relative -translate-y-4 cursor-pointer">
                <img className="w-12 h-12  rounded-full" src={user?.user?.UpdateUser?.imgUrl || user?.user?.Login?.imgUrl ? `http://localhost:5000/images/${user?.user?.UpdateUser?.imgUrl || user?.user?.Login?.imgUrl}` : "https://th.bing.com/th/id/OIP.yWfJt9URUJy-XFt2wpb-tAHaHa?rs=1&pid=ImgDetMain"} alt="logo" />
                <FaCirclePlus size={13} color='red' className='bg-white absolute -bottom-1 rounded-full' />
            </div>
            <div className="flex flex-col items-center justify-center cursor-pointer  ">
                {video?.video?.likesID?.includes(userId?.getUser.id) ? <FaHeart onClick={handleLikes} size={24} color='red' className='' /> : <FaHeart onClick={handleLikes} size={24} color='white ' className='' />}
                <h6 className="text-sm">{video?.video?.likesID?.length}</h6>
            </div>
            <div onClick={() => { setOpenComments(!openComments) }} className="flex flex-col items-center justify-center cursor-pointer">
                <AiFillMessage size={24} color='white' />
                <h6 className="text-sm">{comments?.getComments?.length}</h6>
            </div>
            <div className="flex flex-col items-center justify-center cursor-pointer">
                <IoMdShareAlt size={25} color='white' />
                <h6 className="text-sm">500k</h6>
            </div>
            {openComments &&
                <div className="absolute right-0 md:right-0 w-[350px] h-[350px] lg:left-14 md:w-96 md:h-96  z-50 bg-zinc-900 rounded-xl bottom-10 md:bottom-0 ">
                    <AiOutlineClose size={24} color="white" className="relative left-0 m-2 cursor-pointer" onClick={()=>setOpenComments(!openComments)}/>
                    <div className="overflow-y-scroll h-80">
                        {loading ?
                            <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
                                <div className="animate-pulse flex space-x-4">
                                    <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                                    <div className="flex-1 space-y-6 py-1">
                                        <div className="h-2 bg-slate-700 rounded"></div>
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                                                <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                                            </div>
                                            <div className="h-2 bg-slate-700 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div> :
                            comments.getComments?.map((comm: any, key: number) => (
                                <Comments myID={userId?.getUser.id} comm={comm} key={key} />
                            ))}
                    </div>
                    <div className="-bottom-4 md:bottom-0 absolute    w-full h-16">
                        <div className="w-full relative flex flex-row  items-center space-x-3 justify-center h-full bg-zinc-800">
                            <Input name="comment" placeholder="Comment" type="text" textarea={false} emoji={true} value={comment} onChange={(event: React.ChangeEvent<HTMLInputElement>) => { setComment(event.target.value) }} />
                            <BsEmojiSmile onClick={() => { setToggleEmoji(!toggleEmoji) }} size={20} color={'white'} className="cursor-pointer" />
                            <GoMention size={20} color="white" className="cursor-pointer" />
                            <FiSend onClick={async () => { AddComment(); await refetch(); setComment("") }} size={20} color="white" className="-translate-x-1 cursor-pointer" />
                        </div>
                    </div>
                </div>
            }
            <div className="absolute right-20 -bottom-14">
                {toggleEmoji && <EmojiPicker className="absolute w-[500px] right-0" style={{ background: '#12121B' }} onEmojiClick={handleEmojiClick} />}
            </div>
        </div>
    )
}

export default LeftSide
const DISLIKE_VIDEO = gql`
    mutation DislikeVideo($id:String!){
  dislikeVideo(id:$id)
}
`
const LIKE_VIDEO = gql`
mutation LikeVideo($id:String!){
  likeVideo(id:$id)
}
`
const USER_ID = gql`
    query Getuser{
  getUser{
    Bio,createdAt,email,followers,following,imgUrl,likes,name,username,id
  }
}
`
const ADD_COMMENTS = gql`
    mutation ADDCOMMENT($comment:String!,$vidId:String!){
  addComment(comm:{comment:$comment,vidId:$vidId})
}
`
export const GET_COMMENTS = gql`
query GETCOMMENTS($vidId:String!){
    getComments(vidId: $vidId) {
        comment {
    comment,createdAt,likes,id
  },user {
    email,imgUrl,username
  }
    }
  }
`
