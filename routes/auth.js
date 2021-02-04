const express = require('express');

const router = express.Router();

const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
/* require('dotenv').config();  */
process.env.JWT_SECRET
/* const {process.env.JWT_SECRET} = require('../config/keys') */
const requiredLogin = require('../middleware/requireLogin')

// testing if requiredLogin works or not    
router.get('/protected',requiredLogin, (req,res)=>{
    res.send("hello User")
})

router.post('/signup', (req,res)=> {
   const {name, email, password,pic} = req.body 
   // checking if all the input field are filed
   if (!email || !password || !name) {
       return res.status(422).json({error: "please file all the inboxes"})
   }
  /*  res.json({message: "successfuilly posted"}) */
  User.findOne({email:email})
   .then((savedUser) => {
       // check if the user email is already existed in the database
       if(savedUser){
           return res.sendStatus(422).json({error: "user already exists with that email"})
       }
       bcrypt.hash(password, 15)
       .then(hashedpassword => {
                const user = new User ({
                  
                    email,
                    password:hashedpassword,
                    name,
                    // profilepic is from model and 
                    // profileimage is from front-end
                    pic:pic
                  
                })
                user.save()
                .then (user=> {
                    res.json({ message: " sing up successfully"})
                })
                .catch (err => {
                    console.log(err)
                })
       })

   })
   .catch(err => {
       console.log(err)
   })
})


router.post('/signin', (req,res)=> {
    const {email,password} = req.body
    if (!email || !password ){
        res.status(422).json({error: "Please add email or password"})
    }
    User.findOne({email:email})
        .then(savedUser=>{
            if (!savedUser){
                res.status(422).json({error: "Invalid email or password"})
            }
            bcrypt.compare(password, savedUser.password)
                .then (doMatch => {
                    if (doMatch) {
                      /*   res.json({message: "Successfully signed in"}) */
                        //  giving user a tokent to access protected resources
                        const token = jwt.sign({_id: savedUser._id},process.env.JWT_SECRET)
                        // destructuring the objects
                        const {_id,name,email,followers,following,pic} = savedUser
                        res.json({token,_id,name,email,followers,following,pic})
                        console.log(savedUser)
                    }else {
                        res.status(422).json({error: "Invalid email or password"})
                    }
                })
                .catch(err =>{
                    console.log(err)
                })
            
        })
})


module.exports = router;