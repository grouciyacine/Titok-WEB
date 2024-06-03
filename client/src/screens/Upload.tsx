import React, { useCallback, useState } from 'react';
import Navbar from '../components/Navbar'
import { useDropzone } from 'react-dropzone';
import Input from '../components/Input';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Button from '../components/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
type Props = {}

function Upload({ }: Props) {
    const [text, setText] = useState<String>()
    const [hashtags, setHashtags] = useState<any | undefined>([]);
    const [url, setUrl] = useState<String>('')
    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textareaValue = event.target.value;
        const hashtagsArray = textareaValue.split('\n');
        setHashtags(hashtagsArray);
    };
    const [Upload_Vid] = useMutation(UPLOAD_VIDEO, {
        onError(err) {
            console.log(JSON.stringify(err, null, 2));
        },
    })
    const [Upload_tiktok] = useMutation(UPLAOD_TIKTOK, {
        update(proxy, result) {
            console.log(result.data, proxy)
            toast.success('🦄 wow upload with success', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        },
        onError(err) {
            console.log(JSON.stringify(err))
            toast.error('🚫 Error pleas try again!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        },
        variables: { hashtags, title: text, url }
    })
    const onDrop = useCallback(async (acceptedFiles: any) => {
        const file = acceptedFiles[0];
        try {
            const { data } = await Upload_Vid({ variables: { file } });
            console.log(data.uploadVideo.filename);
            setUrl(data.uploadVideo.filename)
        } catch (error) {
            console.error(error);
        }
    }, []);
    console.log(url)
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    return (
        <div className=''>
            <Navbar />
            <div className='bg-gray-100 rounded-lg w-full  h-[600px]    '>
                <div className='translate-y-3  md:w-full p-5   '
                    {...getRootProps()}
                    style={{
                        border: '2px dashed #ccc',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: "white",
                        marginTop: 100,
                        height: 300,
                        background: isDragActive ? '#eee' : 'inherit',
                    }}
                >
                    <input {...getInputProps()} accept="video/*" />
                    <p className='text-black text-center translate-y-20'>Drag & Drop videos here or click to select</p>
                </div>
                <div className='p-5 w-full   flex flex-col items-center justify-center'>
                    <Input textarea={false} name='Title' onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setText(e.target.value) }} placeholder='Title' type='text' />
                    <textarea value={hashtags.join('\n')}
                        onChange={handleTextareaChange} placeholder='#HASHTAGS' className='bg-zinc-800 p-2 m-2 relative rounded-md  mx-2 w-96 h-20 flex flex-row items-center justify-start' />
                    <div className=' w-96  h-20 p-2'>
                        <Button textcolor='' onClick={() => { Upload_tiktok() }} title='Upload' type='normal' />
                    </div>
                    <ToastContainer
                        position="top-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                </div>
            </div>
        </div>
    )
}
export default Upload

const UPLOAD_VIDEO = gql`
        mutation UploadVideo($file: Upload!){
    uploadVideo(file: $file) {
        filename
    }
}
`
const UPLAOD_TIKTOK = gql`
mutation UPLOADTIKTOK($hashtags:[String!],$title:String!,$url:String){
  CreateVideo(vid:{
    hashtags: $hashtags,title: $title,url: $url
  }) {
    hashtags,likesID,time,title,url,userId
  }
}
`