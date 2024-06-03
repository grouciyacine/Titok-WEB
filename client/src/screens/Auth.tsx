
import Spline from '@splinetool/react-spline';
import Input from '../components/Input';
import React, { useState } from 'react';
import Button from '../components/Button';
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { login } from '../toolkit/user';
import { useNavigate } from 'react-router-dom';

type Props = {}

function Auth({}: Props) {
  const navigate=useNavigate()
  const [toggle,setToggle]=useState(false)
    const [input,setInput]=useState({
      name:"",email:'',password:''
    })
    const dispatch=useDispatch()
    const inputhandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }
    const [Register] = useMutation(REGISTER_USER, {
      update(proxy, result) {
          console.log(proxy)
          if (result.data) { dispatch(login(result.data.Register));navigate("/home")}
      },
      onError(err) {
        console.log(JSON.stringify(err, null, 2));
      },
      variables: { email: input.email, name: input.name, password: input.password }
  })
  const [Login]=useMutation(LOGIN_USER,{
    update(proxy,result){
      console.log(proxy)
      if(result.data) {dispatch(login(result.data));navigate("/home")}
    },
    onError(err){
      console.log(JSON.stringify(err,null,2))
    },
    variables:{email:input.email,password:input.password}
  })//
  if(toggle){
      return (
        <div 
        className='w-full h-full relative '
        >
          <Spline scene="https://prod.spline.design/VX136GTKHCsYAeQc/scene.splinecode" className='w-full h-full lg:flex hidden'/>
        <div className='bg-white absolute top-10 lg:right-5  w-full h-[440px] lg:w-2/5 mt-5 lg:m-0 rounded-lg flex flex-col justify-center items-center '>
            <h1 className='text-zinc-800 font-display m-3 p-2 text-center'>Sign'up</h1>
            <Input textarea={false} type='email' name='email' placeholder='Email' onChange={inputhandler}/>
            <Input textarea={false} type='text' name='name' placeholder='Username' onChange={inputhandler}/>
            <Input textarea={false} type='password' name='password' placeholder='password' onChange={inputhandler}/>
            <h5 className='text-black'>If you have account <span className='text-red-500 cursor-pointer' onClick={()=>setToggle(!toggle)}>sign'in</span></h5>
            <Button onClick={Register} title='register' textcolor='white'  type='normal' />
        </div>
        </div>

  )
  }else{
    return(
      <div className='w-full h-full  '>
<Spline scene="https://prod.spline.design/VX136GTKHCsYAeQc/scene.splinecode" className='h-full w-full lg:flex hidden'/>
      <div className='bg-white w-fit absolute top-10  w-full lg:right-5 h-[400px] mt-5 lg:m-0 lg:w-2/5 rounded-lg flex flex-col justify-start items-center '>
          <h1 className='text-zinc-800 font-display m-3 p-2 text-center'>Sign'up</h1>
          <Input textarea={false} type='email' name='email' placeholder='Email' onChange={inputhandler}/>
          <Input textarea={false} type='password' name='password' placeholder='password' onChange={inputhandler}/>
          <h5 className='text-black'>If you Don't have account <span className='text-red-500 cursor-pointer' onClick={()=>setToggle(!toggle)}>sign'up</span></h5>
          <Button onClick={Login} title='Login' type='normal' textcolor='white'/>
      </div>
      </div>
    )
  }

}

export default Auth

const REGISTER_USER=gql`
  mutation Register($email:String!,$password:String!,$name:String!){
  Register(register:{
    name:$name,
    password:$password,
    email:$email
  }){
    name,
    token,
    email,
    createdAt
  }
}
`

const LOGIN_USER=gql`
  mutation Login($email:String!,$password:String!){
  Login(login:{
    password:$password,
    email:$email
  }){
    name,email,imgUrl,createdAt,token,Bio,username,likes,createdAt,followers,following
  }
}
`