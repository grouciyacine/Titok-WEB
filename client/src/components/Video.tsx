import ReactPlayer from 'react-player';
import LeftSide from './LeftSide';
import { useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { saveVideo } from '../toolkit/videos';
import ReightHome from './ReightHome';
import { useInView } from 'react-intersection-observer';

type Props = {
    video: any
}

function Video({ video }: Props) {
    const dispatch = useDispatch()
    const [ref, inView] = useInView({
        threshold: 0.2, // Adjust this value based on your needs
    });
    const playerRef = useRef<any>(null);
    const [playing, setPlaying] = useState(false);
    const handlePlay = () => {
        setPlaying(true);
        if (playerRef.current && inView) {
            (playerRef.current as any).seekTo(0);
        }
    };
    const handlePause = () => {
        setPlaying(false);
    };
    useEffect(() => {
        dispatch(saveVideo(video))
    }, [video])
    return (
        <div className="relative bg-[#000000a7 ] w-full h-full snap-start">
            <div ref={ref} style={{ objectFit: 'fill' }} className="relative lg:translate-x-80 md:translate-x-36  md:w-[400px]  w-full h-full">
                <ReactPlayer
                    ref={(ref) => (playerRef.current = ref)}
                    width='100%'
                    url={`http://localhost:5000/videos/${video?.video?.url}.m3u8`}
                    height='100%'
                    loop={true}
                    playing={inView}
                    controls={true}
                    onPause={handlePause}
                    onPlay={handlePlay}
                    config={{
                        file: {
                            attributes: {
                                controlsList: 'nodownload' // Example of setting additional attributes
                            },
                            hlsOptions: {
                                // hls.js specific options
                                debug: true
                            }
                        }
                    }}
                />
                <LeftSide video={video} />
            </div>
            <ReightHome video={video} />
        </div>
    )
}

export default Video