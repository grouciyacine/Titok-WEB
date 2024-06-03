import Button from "./Button"
import moment from 'moment'
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";




type Props = {
    video: any
}

function ReightHome({ video }: Props) {
    const date = new Date(parseInt(video?.video?.createdAt));
    const { data: userId,refetch:ReftetchUser } = useQuery(USER_ID)
    const [following] = useMutation(Following, {
        variables: { Id: video?.video.userId },
        onError(err) {
            console.log(JSON.stringify(err))
        },
        onCompleted(){
            ReftetchUser();
        }
    })
    const [disallowing] = useMutation(DISALLOWING, {
        variables: { Id: video?.video.userId },
        onError(err) {
            console.log(JSON.stringify(err))
        },
        onCompleted(){
            ReftetchUser();
        }
    })
    const handleFollowing = () => {
        let followings = userId?.getUser?.followers
        followings?.includes(video?.video.userId) ? disallowing() : following()
    }
    const timeAgo = moment(date).fromNow()
    return (
        <div className="hidden md:flex flex-col items-start justify-start w-1/3 h-[425px] absolute -z-10  top-10 -right-14 lg:right-0  ">
            <h1 className="text-base m-1 lg:text-4xl">{video?.video?.title}</h1>
            <h4 className="text-base m-1 lg:text-2xl lg:mx-2">{timeAgo}</h4>
            {video?.video?.hashtags?.map((hash: any, key: number) => (
                <h3 key={key} className="text-cyan-400 m-1 lg:ml-4">{hash}</h3>
            ))}
            {userId?.getUser?.id   === video?.video.userId ? <span></span> : <div className="m-1 lg:m-0 w-1/2 cursor-pointer">
                {userId?.getUser?.followers.includes(video?.video.userId)  ? <Button onClick={() => { handleFollowing() }} textcolor="white" title="DisFollow" type="outline" />
                    : <Button onClick={() => { handleFollowing() }} textcolor="white" title="Follow" type="normal" />
                }
            </div>
            }
        </div>
    )
}

export default ReightHome

const USER_ID = gql`
    query Getuser{
  getUser{
    Bio,createdAt,email,followers,following,imgUrl,likes,name,username,id
  }
}
`
const Following = gql`
    mutation follows($Id:String!){
        follows(Id:$Id){
    Bio,createdAt,email,followers,following,imgUrl,likes,name,token,username,
  }
}
`
const DISALLOWING = gql`
    mutation disallowing($Id:String!){
        disallowing(Id:$Id){
    Bio,createdAt,email,followers,following,imgUrl,likes,name,token,username,
  }
    }`