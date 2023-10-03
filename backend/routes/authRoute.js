import express  from "express";
import {registerCont, loginCont, adminCont} from "../controllers/authController.js"
import { isAdmin, requiredSignin } from "../middlewares/authMid.js";


const router = express.Router()


//REGISTER || METHOD=POST   
router.post('/register', registerCont)


//LOGIN 
router.post('/login', loginCont)

//ADMIN
router.post('/admin', requiredSignin, isAdmin, adminCont)

//PRIVATE ROUTE
router.get('/user-auth', requiredSignin, (req, res)=>{
    res.status(200).send({ok:true})
})
router.get('/admin-auth', requiredSignin, isAdmin, (req, res)=>{
    res.status(200).send({ok:true})
})


export default router
