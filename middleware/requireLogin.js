/* const { model, plugin } = require("mongoose"); */

const jwt = require ('jsonwebtoken')
/* require('dotenv').config();  */
process.env.JWT_SECRET
/* const {JWT_SECRET} = require('../config/keys') */
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,res,next) => {
    const {authorization} = req.headers
    // authorization  === Bearer (token:akjdkfa;ksdfaksdf,asdkfasdkfjalksdjfkaj;dfslkakldsfka)
    if(!authorization) {
      return  res.status(401).json({error: "you must be logged in"})

    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token,process.env.JWT_SECRET,(err,payload)=> {
        if(err){
            return res.status(401).json({error: "you must be logged in"})
        }
        const  {_id} = payload
        User.findById(_id)
            .then(userdata => {
                req.user = userdata
                // the above code should finish executing before it gets to next()
                next()
            })
            // go to next middleware function if there is any
         
    })
}
