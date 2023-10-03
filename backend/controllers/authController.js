import userModel from '../models/userModel.js'
import {comaparePassword, hashPassword} from '../helpers/authHelp.js'
import JWT from 'jsonwebtoken'

export const registerCont = async(req, res) =>{
    try {
        const {name, username, password} = req.body
        // validation
        if(!name){
            return res.send({message:'Name is Required'})
        }
        if(!username){
            return res.send({message:'Username is Required'})
        }
        if(!password){
            return res.send({message:'Password is Required'})
        }
        const existuser = await userModel.findOne({username})
        // check for existing user 
        if(existuser){
            return res.status(200).send({
                success: false,
                message: 'Already existing user'
            })
        }
        // register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({name, username, password: hashedPassword, role:0}).save()

        res.status(201).send({
            success: true,
            message:'User registered successfully',
            user 
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false, 
            message: 'Error in Registration',
            error
        })
    }
}
//LOGIN
export const loginCont = async(req, res)=>{
    try {
        const {username, password, role} = req.body
        //VALIDATION
        if(!username || !password){
            return res.send({
                success: false,
                message: 'Invalid username/password'
            })
        }
        const user = await userModel.findOne({username})

        if(!user){
            return res.send({
                success:false,
                message:'User not registered'
            })
        }
        const match = await comaparePassword(password, user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Invalid password'
            })
        } 
        //TOKEN 
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn:'7d'})
        res.status(201).send({
            success:true,
            message:'Login successfully',
            user:{ 
                _id: user._id,
                name: user.name,
                username: user.username,
                role: user.role
            },
            token,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Login',
            error
        })
    }
}
export const adminCont = async(req, res)=>{
    try {
        res.send("Welcome to Admin page")

    } catch (error) {
        console.log(error);
        res.send({error})
    }
}