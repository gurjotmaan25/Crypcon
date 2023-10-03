import {useEffect, useState} from 'react'
import {Outlet} from 'react-router-dom'
import { useAuth } from '../../context/auth'
import axios from 'axios'

export default function PrivateRoute(){
    const [ok, setOk] = useState(false)
    const [auth, setAuth] = useAuth()

    useEffect(()=>{
        const authCheck = async()=>{
            const res = await axios.get('/api/v1/auth/user-auth')
            if(res.data.ok){
                setOk(true)
            }else{setOk(false)}
        }
        if(auth?.token) authCheck()
    },[auth?.token])
    return ok ? <Outlet/> :<><h1>Not Authorized</h1></>
}