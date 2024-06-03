import { useDispatch, useSelector } from "react-redux"
import LeftHome from "../components/LeftHome"
import Navbar from "../components/Navbar"
import Button from "../components/Button"
import { FaLock } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { HiMiniPencilSquare } from "react-icons/hi2";
import Input from "../components/Input";
import { login } from "../toolkit/user";

type Props = {}

function Profile({ }: Props) {
    const { data, loading } = useQuery(GETMYVIDEOS)
    const {data:userS}=useQuery(USER_ID)
    const user = useSelector((state: any) => state.user)
    const [toggleText, setToggleText] = useState<String>('Videos')
    const { data: liked, loading: load } = useQuery(GETLIKEDVIDEOS)
    const { userId } = useParams()
    const [toggle, setToggle] = useState(false)
    const [img, setImg] = useState('')
    const [url, setUrl] = useState('')
    const dispatch = useDispatch()
    const [myProfile, setMyProfile] = useState({
        'name': '',
        'username': '',
        'Bio': '',
    })
    const HandleProfile = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setMyProfile({ ...myProfile, [e.target.name]: e.target.value })
        setMyProfile({ ...myProfile, [e.target.name]: e.target.value })
    }
    const [UpdateImage] = useMutation(UPDATE_PHOTO, {
        update(proxy, result) {
            console.log(proxy)
            if (result?.data) setUrl(result.data)
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2))
        }
    })
    const [UpdateProfile] = useMutation(UPDATE_UESER, {
        variables: {
            Bio: myProfile.Bio?myProfile.Bio:user?.user?.UpdateUser?.Bio, username: myProfile.username?myProfile.username:user?.user?.UpdateUser?.username, name: myProfile.name?myProfile.name:user?.user?.UpdateUser?.name, imgUrl:url?.singleUpload?.filename?url?.singleUpload?.filename :user?.user?.UpdateUser?.imgUrl 
        },
        update(proxy, result) {
            console.log(proxy)
            if (result?.data) {dispatch(login(result?.data));setToggle(!toggle)}
        },
        onError(err) {
            console.log(JSON.stringify(err, null, 2))
        }
    })
    useEffect(() => {
        UpdateImage({ variables: { file: img } })
    }, [img])
    return (
        <div className="flex flex-1 flex-col relative text-white">
            <Navbar />
            <div className="w-full flex flex-col items-center relative top-28  justify-between  ">
                <LeftHome />
                <div className="flex  flex-row justify-center items-center">
                    <img className="md:w-40 object-cover  mr-20 md:h-40 w-20 h-20 rounded-full" src={user?.user?.UpdateUser?.imgUrl || user?.user?.Login?.imgUrl ? `http://localhost:5000/images/${user?.user?.UpdateUser?.imgUrl || user?.user?.Login?.imgUrl}` : "https://th.bing.com/th/id/OIP.yWfJt9URUJy-XFt2wpb-tAHaHa?rs=1&pid=ImgDetMain"} alt="logo" />
                    <div className="p-2 space-y-3">
                        <h3 className="font-semibold text-xl">{user?.Login?.name || user?.user?.UpdateUser?.name}</h3>
                        <h4 className="text-gray-300">{user?.Login?.email || user?.user?.UpdateUser?.email}</h4>
                        <Button textcolor="white" type="outline" title="Edit Profile" onClick={() => { setToggle(!toggle) }} />
                    </div>
                </div>
                {toggle && <div className="absolute w-full h-full  shadow-md shadow-zinc-500 z-40 flex flex-col items-center justify-start bg-[#000000a7]">
                    <div className="shadow-md relative shadow-zinc-500 rounded-2xl bg-zinc-700 w-[140vh] h-[150vh]">
                        <div className="flex flex-col justify-between items-start p-4 border-b-[1px] border-b-gray-300 w-full">
                            <h2 className="text-3xl">Edit Profile</h2>
                            <IoIosClose onClick={() => setToggle(!toggle)} size={50} color="white" className="absolute  right-0" />
                        </div>
                        <div className="flex flex-row  items-start p-4 border-b-[1px] border-b-gray-300">
                            <h2 className="text-xl w-fit">Edit Photo</h2>
                            <input type="file" name="imgUrl" id="user" onChange={(e: React.ChangeEvent<HTMLInputElement | any>) => setImg(e.target.files[0])} className="hidden" />
                            <label htmlFor="user" className="flex ">
                                <div className="flex items-center relative justify-center ml-40">
                                    <img className="md:w-40  cursor-pointer md:h-40 w-20 h-20 rounded-full" src={user?.user?.UpdateUser?.imgUrl || user?.user?.Login?.imgUrl ? `http://localhost:5000/images/${user?.user?.UpdateUser?.imgUrl || user?.user?.Login?.imgUrl}` : "https://th.bing.com/th/id/OIP.yWfJt9URUJy-XFt2wpb-tAHaHa?rs=1&pid=ImgDetMain"} alt="logo" />
                                    <HiMiniPencilSquare size={30} color="black" className="bg-white absolute rounded-full right-1 bottom-3 cursor-pointer" />
                                </div>
                            </label>
                        </div>
                        <div className="flex flex-row  space-x-9 justify-start items-center p-4 border-b-[1px] border-b-gray-300">
                            <h2 className="text-xl w-32">Username</h2>
                            <Input textarea={false} name="username" onChange={HandleProfile} placeholder="Username" type="text" />
                        </div>
                        <div className="flex flex-row space-x-9 justify-start w-full items-center p-4 border-b-[1px] border-b-gray-300">
                            <h2 className="text-xl w-32">name</h2>
                            <Input textarea={false} name="name" onChange={HandleProfile} placeholder="name" type="text" />
                        </div>
                        <div className="flex flex-row space-x-9 justify-start w-full items-center p-4 border-b-[1px] border-b-gray-300">
                            <h2 className="text-xl w-32">Bio</h2>
                            <Input textarea={true} name="Bio" onChange={HandleProfile} placeholder="Bio" type="text" />
                        </div>
                        <div className="w-full flex items-center justify-center p-4">
                            <Button onClick={UpdateProfile} textcolor="white" title="Submit" type="normal" />
                        </div>

                    </div>
                </div>}
                <div className="flex items-start  justify-start md:-translate-x-16 m-3 flex-row space-x-7">
                    <h4>{user?.user?.UpdateUser?.following.length || user?.user?.Login?.following.length} Following</h4>
                    <h4>{user?.user?.UpdateUser?.followers.length || user?.user?.Login?.followers.length}  Followers</h4>
                    <h4>{userS?.getUser?.likes}  Likes</h4>
                </div>
                <h4 className="w-96 translate-x-4 md:-translate-x-4 m-3 ">{user?.user?.UpdateUser?.Bio || user?.user?.Login?.Bio} </h4>
                <div className="w-full translate-x-3 md:w-[600px] md:translate-x-20 flex flex-row justify-start p-1 m-5 space-x-10 items-center border-b-[1px] border-gray-300">
                    <h4 onClick={() => setToggleText('Videos')} className={`cursor-pointer  border-b-2 text-xl hover:border-white border-transparent ${toggleText === 'Videos' ? 'text-white border-white' : 'text-gray-300 '}`}>Videos</h4>
                    <div onClick={() => setToggleText('Favorites')} className={`flex border-b-2 hover:border-white border-transparent flex-row items-center space-x-2 cursor-pointer text-xl  ${toggleText === 'Favorites' ? 'text-white border-white' : 'text-gray-300'}`}><FaLock size={20} className='text-gray-300' /> <h4 >Favorite</h4></div>
                    <div onClick={() => setToggleText('Licked')} className={`flex border-b-2 hover:border-white border-transparent flex-row items-center space-x-2 cursor-pointer text-xl  ${toggleText === 'Licked' ? 'text-white border-white' : 'text-gray-300'}`}><FaLock size={20} className='text-gray-300' /> <h4 >Licked</h4></div>
                </div>
                {loading ? <h1>Loading</h1> :
                    <div className="">
                        {data?.length == 0 &&
                            <div className="m-4 ml-20 flex flex-col justify-center items-center">
                                <img src="https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png" className="w-60 h-60 rounded-full" alt="user" />
                                <h3 className="text-xl font-bold">Upload Your First Video</h3>
                                <h5 className="text-sm text-gray-300">Your Video will appear hire</h5>
                            </div>}
                        {toggleText === "Videos" &&
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                                {data?.GetMyVideos?.map((vid: any, key: number) => (
                                    <div className=" md:translate-x-20 w-48  md:w-52" key={key}>
                                        <ReactPlayer
                                            width='100%'
                                            url={`http://localhost:5000/videos/${vid?.url}`}
                                            height='100%'
                                            loop={true}
                                            playing={false}
                                            controls={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                }

                {load ? <h1>Loading</h1> :
                    <div className="">
                        {liked?.length == 0 &&
                            <div className="m-4 ml-20 flex flex-col justify-center items-center">
                                <img src="https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png" className="w-60 h-60 rounded-full" alt="user" />
                                <h3 className="text-xl font-bold">Upload Your First Video</h3>
                                <h5 className="text-sm text-gray-300">Your Video will appear hire</h5>
                            </div>}
                        {toggleText === "Licked" &&
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                                {liked?.GetLikedVideos?.map((vid: any, key: number) => (
                                    <div className="md:translate-x-20  w-48 md:w-52" key={key}>
                                        <ReactPlayer
                                            width='100%'
                                            url={`http://localhost:5000/videos/${vid?.url}`}
                                            height='100%'
                                            loop={true}
                                            playing={false}
                                            controls={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                }

            </div>
        </div>
    )
}

export default Profile

const GETMYVIDEOS = gql`
    query GETMYVIDEOS{
  GetMyVideos {
    likesID,title,hashtags,id,url,userId,
  }
    
}
`
export const GETLIKEDVIDEOS = gql`
    query GETMYVIDEOS{
  GetLikedVideos {
    likesID,title,hashtags,id,url,userId
  } 
    
}
`

const UPDATE_PHOTO = gql`
    mutation UploadImage($file: Upload!){
  singleUpload(file: $file) {
    filename
  }
}
`
const UPDATE_UESER = gql`
mutation UpdateUser($Bio:String!,$name:String!,$imgUrl:String!,$username:String!) {
  UpdateUser(
    update: {
      Bio:$Bio
      name: $name
      imgUrl: $imgUrl
      username: $username
    }
  ){name,email,imgUrl,createdAt,token,Bio,username,likes,createdAt,followers,following}
}
`
const USER_ID=gql`
    query Getuser{
  getUser{
    Bio,createdAt,email,followers,following,imgUrl,likes,name,username,id
  }
}
`