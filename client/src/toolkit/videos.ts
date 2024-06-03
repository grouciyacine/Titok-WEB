import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    video: {},
    loading: false,
    error: false
}
const videoSlice = createSlice({
    initialState,
    name: "video",
    reducers:{
        loadingVideo:(state)=>{
            state.loading=true,
            state.error=false
        },
        saveVideo:(state,payload)=>{
            state.video=payload.payload
        },
        errorVideo:(state)=>{
            state.error=true,
            state.loading=false
        }
    }
}
)
export const {errorVideo,loadingVideo,saveVideo}=videoSlice.actions
export default videoSlice.reducer