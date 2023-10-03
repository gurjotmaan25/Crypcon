import React, {useState} from 'react'
import Header from '../components/Header';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast';

const Signup = () => {
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            const res = await axios.post("/api/v1/auth/register", {name, username, password})
            if(res && res.data.success){
                toast.success(res.data.message)
                // await new Promise(resolve => setTimeout(resolve, 1000));
                navigate("/login")
            }else{
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong')

        }
        // console.log(process.env.REACT_APP_API);
        // toast.success('Registered Successfully')
    }

  return (
    <div>
        <Header/>
        {/* <Toaster/> */}
        <div className='regis'>
            <h1>SignIn</h1>
            <div >
                <form className='form' onSubmit={handleSubmit}>
                    <input type="text" value={name}  onChange={(e)=> setName(e.target.value)} placeholder='Name'/>
                    <input type="text" value={username} onChange={(e)=> setUsername(e.target.value)} placeholder='Userame'/>
                    <input type="password" value={password}  onChange={(e)=> setPassword(e.target.value)} placeholder='Password'/>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>

    </div>
  )
}

export default Signup