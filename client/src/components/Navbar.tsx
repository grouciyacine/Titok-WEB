
import { CiSearch } from "react-icons/ci";
import Button from "./Button";
import { CiMenuKebab } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { RiUserFollowLine } from "react-icons/ri";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { MdOutlineExplore } from "react-icons/md";
import { RiLiveLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
type Props = {}

function Navbar({ }: Props) {
    const navigate = useNavigate()
    const user = useSelector((state: any) => state.user)
    const [menu, setMenu] = useState<boolean>(false)

    return (
        <div className="w-full bg-white h-20 flex flex-row items-center z-50 justify-between top-0 fixed md:p-2 border-b-[1px] border-gray-500">
            <img src={"https://pngimg.com/uploads/tiktok/tiktok_PNG17.png"} alt="logo" className="w-36 h-28  " />
            <div className="bg-gray-300  hidden w-2/5 h-12 rounded-3xl md:flex flex-row items-center justify-between">
                <input placeholder="Search...." className="bg-transparent  outline-none border-none text-black p-2" />
                <CiSearch size={34} className='border-l-[1px]  m-3 pl-2 cursor-pointer border-gray-500 -translate-x-2 text-gray-500' />
            </div>
            <div className="flex flex-row justify-around -translate-x-2 md:-translate-x-10 items-center space-x-4">
                <Button type="outline" title="+ Upload" onClick={() => { navigate('/upload') }} textcolor="black" />
                {user?.user?.Login?.token || user?.user?.UpdateUser?.token ? <img onClick={() => { navigate(`/Profile/@${user?.user?.Login?.name ? user?.user?.Login?.name : user?.user?.UpdateUser?.name}`) }} className="w-10 cursor-pointer  h-10 rounded-full" src={user?.user?.UpdateUser?.imgUrl || user?.user?.Login?.imgUrl ? `http://localhost:5000/images/${user?.user?.UpdateUser?.imgUrl || user?.user?.Login?.imgUrl}` : `https://th.bing.com/th/id/R.8e2c571ff125b3531705198a15d3103c?rik=gzhbzBpXBa%2bxMA&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fuser-png-icon-big-image-png-2240.png&ehk=VeWsrun%2fvDy5QDv2Z6Xm8XnIMXyeaz2fhR3AgxlvxAc%3d&risl=&pid=ImgRaw&r=0`} alt="user" /> : <Button type='normal' title="Log in" onClick={() => { }} textcolor="white" />}
                <CiMenuKebab size={34} color='black' onClick={() => { setMenu(!menu) }} />
            </div>
            {menu && <div className="flex md:hidden flex-col items-start justify-start absolute right-2 top-20 rounded-xl w-64 h-96 z-50 bg-white">
                <div className="bg-gray-300 p-2 m-2  w-11/12 h-12 rounded-3xl flex flex-row items-center justify-between">
                    <input placeholder="Search...." className="bg-transparent  outline-none border-none text-black p-2" />
                    <CiSearch size={34} color="gray" className='border-l-[1px]  m-3 md:pl-2 cursor-pointer border-gray-500 md:-translate-x-2 text-gray-500' />
                </div>
                    <Link to={`/home`} className="flex flex-row cursor-pointer items-center justify-center mx-3 p-3">
                        <AiFillHome size={24} color='black' />
                        <h3 className="text-lg text-black font-semibold translate-y-1 mx-3 ">For You</h3>
                    </Link>
                    <div className="flex flex-row cursor-pointer items-center justify-center mx-3 p-3">
                        <RiUserFollowLine size={24} color='black' />
                        <h3 className="text-lg text-black  font-semibold translate-y-1 mx-3">Following</h3>
                    </div>
                    <div className="flex flex-row cursor-pointer items-center justify-center mx-3 p-3">
                        <LiaUserFriendsSolid size={24} color='black' />
                        <h3 className="text-lg text-black font-semibold translate-y-1 mx-3">Friends</h3>
                    </div>
                    <div className="flex flex-row cursor-pointer items-center justify-center mx-3 p-3">
                        <MdOutlineExplore size={24} color='black' />
                        <h3 className="text-lg text-black font-semibold translate-y-1 mx-3">Explore</h3>
                    </div>
                    <div className="flex flex-row cursor-pointer items-center justify-center mx-3 p-3">
                        <RiLiveLine size={24} color='black' />
                        <h3 className="text-lg text-black font-semibold translate-y-1 mx-3">Live</h3>
                    </div>
                    <Link to={`/Profile/@${user?.user?.Login?.name ? user?.user?.Login?.name : user?.user?.UpdateUser?.name}`} className="flex   flex-row cursor-pointer items-center justify-center mx-3 p-3">
                        <CgProfile size={24} color='black' />
                        <h3 className="text-black cursor-pointer text-lg font-semibold translate-y-1 mx-3">Profile</h3>
                    </Link>
                </div>}
        </div>
    )
}

export default Navbar