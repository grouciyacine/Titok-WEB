import { CiHeart } from "react-icons/ci";
import moment from "moment";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { useCallback } from "react";
import { GET_COMMENTS } from "./LeftSide";
import { useDispatch } from "react-redux";
import { replay } from "../toolkit/user";
type Props = {
    comm: any
    myID: string
}

function Comments({ comm, myID }: Props) {
    const dispatch=useDispatch()
    const [LikeComment] = useMutation(LIKE_COMMENT, {
        variables: { Id: comm?.comment?.id },
        onError: (err) => {
            console.log(JSON.stringify(err, null, 2))
        },
        refetchQueries: [GET_COMMENTS]
    })
    const [DislikeComment] = useMutation(DISLIKE_COMMENT, {
        variables: { Id: comm?.comment?.id },
        onError: (err) => {
            console.log(JSON.stringify(err, null, 2))
        },
        refetchQueries: [GET_COMMENTS]
    })
    const handleLikes = useCallback(() => {
        if (comm?.comment?.likes?.includes(myID)) {
            DislikeComment()
        } else {
            LikeComment()
        }
    }, [comm?.comment?.likes, comm?.comment?.id])
    return (
        <div className="flex w-full flex-col items-start justify-between ">
            <div className="flex w-full flex-row items-center justify-between">
                <div>
                    <div className="flex flex-row items-center justify-start p-3 space-x-4">
                        <img className="w-10 h-10 rounded-full object-cover" src={comm?.user?.imgUrl ? `http://localhost:5000/images/${comm?.user?.imgUrl}` : "https://necolebitchie.com/wp-content/uploads/2017/06/profile-photograph.jpg"} alt="logo" />
                        <div className="flex flex-col items-start justify-center">
                            <h5>@{comm?.user?.username}</h5>
                            <h3>{comm?.comment?.comment}</h3>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    {comm?.comment?.likes?.includes(myID)
                        ? <CiHeart onClick={handleLikes} size={24} color='red' className='cursor-pointer' />
                        : <CiHeart onClick={handleLikes} size={24} color='white ' className='cursor-pointer' />
                    }
                    <span>{comm?.comment?.likes?.length}</span>
                </div>
            </div>
            <div className="flex flex-row items-start justify-center mx-4 space-x-6">
                <h6 className="text-gray-400 cursor-pointer">{moment(new Date(parseInt(comm?.comment?.createdAt))).fromNow()}</h6>
                <h6 className="text-gray-400 cursor-pointer" onClick={()=>{dispatch(replay(`@${comm?.user?.username}`))}}>Replay</h6>
            </div>
        </div>
    )
}

export default Comments

const LIKE_COMMENT = gql`
    mutation LikeComment($Id:String!){
  likeComment(Id: $Id)
}
`
const DISLIKE_COMMENT = gql`
    mutation DislikeComment($Id:String!){
  DislikeComment(Id: $Id)
}
`
