import { AiFillHome } from "react-icons/ai";
import { RiUserFollowLine } from "react-icons/ri";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { MdOutlineExplore } from "react-icons/md";
import { RiLiveLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import Button from "./Button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


type Props = {}

function LeftHome({}: Props) {
  const user=useSelector((state:any)=>state.user)

  return (
    <div className="w-1/3 h-[425px] hidden md:flex md:fixed left-0 z-20">
        <div className="flex flex-col items-start justify-center border-b-[1px] border-gray-200 w-1/2">
            <Link to={`/home`} className="flex flex-row cursor-pointer items-center justify-center mx-3 p-3">    
                    <AiFillHome size={24} color='white'/>
            <h3 className="text-lg text-white font-semibold translate-y-1 mx-3">For You</h3>
            </Link>
          <div className="flex flex-row cursor-pointer items-center justify-center mx-3 p-3">
            <RiUserFollowLine size={24} color='white'/>
            <h3 className="text-lg font-semibold translate-y-1 mx-3">Following</h3>
          </div>
          <div className="flex flex-row cursor-pointer items-center justify-center mx-3 p-3">
            <LiaUserFriendsSolid size={24} color='white'/>
            <h3 className="text-lg font-semibold translate-y-1 mx-3">Friends</h3>
          </div>
          <div className="flex flex-row cursor-pointer items-center justify-center mx-3 p-3">
            <MdOutlineExplore size={24} color='white'/>
            <h3 className="text-lg font-semibold translate-y-1 mx-3">Explore</h3>
          </div>
          <div  className="flex flex-row cursor-pointer items-center justify-center mx-3 p-3">
            <RiLiveLine size={24} color='white'/>
            <h3 className="text-lg font-semibold translate-y-1 mx-3">Live</h3>
          </div>
          <Link  to={`/Profile/@${user?.user?.Login?.name?user?.user?.Login?.name:user?.user?.UpdateUser?.name}`} className="flex   flex-row cursor-pointer items-center justify-center mx-3 p-3">
            <CgProfile size={24} color='white'/>
            <h3 className="text-white cursor-pointer text-lg font-semibold translate-y-1 mx-3">Profile</h3>
          </Link>
        </div>
        {user?.user?.Login?.name || user?.user?.UpdateUser?.name?'':      
          <div className="w-1/2 p-3 mx-3">
            <h4 className="text-gray-300 ">Log in to follow creators, like videos, and view comments.</h4>
            <Button onClick={()=>{}} title="Log in" type="outline" textcolor="white"/>
        </div>
        }

    </div>
  )
}

export default LeftHome