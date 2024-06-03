import {createSlice} from '@reduxjs/toolkit'

const initialState={
    user:{},
    error:false,
    loading:false,
    commentLength:0,
    replay:''
}

const UserSlice=createSlice({
    initialState,
    name:'user',
    reducers:{
        startLogin:(state)=>{
            state.loading=true;
            state.error=false
        },
        login:(state,action)=>{
            state.user=action.payload
            state.error=false
            state.loading=false
        },
        replay:(state,action)=>{
            state.replay=action.payload
        },
        errorLogin:(state)=>{
            state.error=true;
        },
        setCommentLength:(state,deploy)=>{
            state.commentLength=deploy.payload
        },
        singOut:()=>{
            return initialState
        },
    }
})
export const {errorLogin,login,singOut,startLogin,setCommentLength,replay}=UserSlice.actions
export default UserSlice.reducer