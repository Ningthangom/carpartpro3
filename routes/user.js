const express = require('express');

const router = express.Router();
const mongoose = require('mongoose')
const requiredLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")

// id is a parameter
router.get('/user/:id',requiredLogin,(req,res)=>{
    console.log("this is from backed ",req.params.id)
    //find the user and it's detail
    User.findOne({_id:req.params.id})
    //do not run console.log between .findOne and .select as this will break the function
    /* console.log({_id:req.params.id})
    console.log(req.params.id) */
    //selected ones here will not be shown in the front end
    // do not select password
    .select("-password")
    .then(user => {
        console.log(user)
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            //this will return the the user and its posts
            res.json({user,posts})
        })

    }).catch(err=> {
        return res.status(404).json({error:"User cannot be found"})
    })
})  

// logic for following and followers
    // when user A follows user B => 
        // firstly the following in user A shoud be incremented by 1 
        //secondly the followers in user B should be increment by 1
     
router.put('/follow',requiredLogin,(req,res) => {
    // this followId will be coming from front end and update the body
     // and this id is the id of the user that has been followed
    User.findByIdAndUpdate(req.body.followId, {
       // req.user._id: is the id of the person who is currently login inside the app
    //req.user._id: is comming from requiredLogin
        $push:{followers:req.user._id}
    },
    {
         // {new:true} will return the updated data
        new:true
    },(err,result) => {
        if(err){
            return res.status(422).json({error:err})
        }
        // this will update the current user's following by getting the id of 
        // the user that it has followed
    User.findByIdAndUpdate(req.user._id, {
        $push:{following:req.body.followId}
    },
    {
        new:true
    })
    .select("-password")
    .then(result => {
        res.json(result)
    }).catch(err => {
        return res.status(422).json({error:err})
    })
  })
})

router.put('/unfollow',requiredLogin,(req,res) => {
    // this unfollowId will be coming from front end and update the body
        // and this id is the id of the user that has been followed
    User.findByIdAndUpdate(req.body.unfollowId, {
        // use pull method to reduct from the following array 
        // req.user._id: is the id of the person who is currently login inside the app
    //req.user._id: is comming from requiredLogin
        $pull:{followers:req.user._id}
    },
    {
            // {new:true} will return the updated data
        new:true
    },(err,result) => {
        if(err){
            return res.status(422).json({error:err})
        }
        // this will update the current user's following by getting the id of 
        // the user that it has followed
    User.findByIdAndUpdate(req.user._id, {
        $push:{following:req.body.unfollowId}
    },
    {
        new:true
    })
    .select("-password")
    .then(result => {
        res.json(result)
    }).catch(err => {
        return res.status(422).json({error:err})
    })
    })
})



module.exports = router