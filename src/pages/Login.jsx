import React, {useState} from 'react'
import Header from '../components/Header'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast';
import { useAuth } from '../context/auth';

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [auth, setAuth] = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            const res = await axios.post('/api/v1/auth/login', { username, password})
            if(res && res.data.success){
                toast.success(res.data.message)
                await new Promise(resolve => setTimeout(resolve, 1000));
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                })
                localStorage.setItem('auth',JSON.stringify(res.data))
                navigate("/")
            }else{
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')

        }
    }

  return (
    <div>
        <Header/>
        {/* <Toaster/> */}
        <div className='regis'>
            <h1>Login</h1>
            <div >
                <form className='form' onSubmit={handleSubmit}>
                    <input type="text" value={username}  onChange={(e)=> setUsername(e.target.value)} placeholder='Userame'/>
                    <input type="password" value={password}  onChange={(e)=> setPassword(e.target.value)} placeholder='Password'/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>

    </div>
  )
}

export default Login