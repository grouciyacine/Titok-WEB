import gql from "graphql-tag"
import LeftHome from "../components/LeftHome"
import Navbar from "../components/Navbar"

import Video from "../components/Video"
import { useQuery } from "@apollo/client"

type Props = {}

function Home({ }: Props) {
  const { data } = useQuery(GET_RANDOM_VIDEOS)
  return (
    <div className="w-full ">
      <Navbar />
      <div className="w-full flex flex-col items-center relative top-28  justify-between  ">
        <LeftHome />
        <div className="app_videos ">
          {data?.GetVideosRandom?.map((video: any, key: number) => (
            <Video key={key} video={video} />
          ))}
        </div>
        
      </div>
    </div>

  )
}

export default Home

export const GET_RANDOM_VIDEOS = gql`
  query GETRANDOMVIDEO{
    GetVideosRandom {
    user {
      email,followers,name,followers,imgUrl,createdAt
    },video {
      title,likesID,url,hashtags,id,createdAt,userId
    }
  }
}
`