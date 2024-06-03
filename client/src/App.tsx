import './App.css'
import Auth from './screens/Auth'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './screens/Home'
import { useSelector } from 'react-redux'
import Upload from './screens/Upload'
import Profile from './screens/Profile'
function App() {
const user=useSelector((state:any)=>state.user)
if(!user){
  return(
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Auth/>}/>
        </Routes>
      </BrowserRouter>
  )
}else{
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Auth/>}/>
        <Route path='/Home' element={<Home/>}/>
        <Route path='/upload' element={<Upload/>}/>
        <Route path='/Profile/:userId' element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

}

export default App
