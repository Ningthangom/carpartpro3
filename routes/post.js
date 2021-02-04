const express = require('express');

const router = express.Router();

const mongoose = require('mongoose')
const requiredLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")


router.get('/allpost',requiredLogin,(req,res) => {
    Post.find()
        .populate("postedBy","_id name pic")
        .then(posts => {
            res.json({posts})
        })
        .catch(err => [
            console.log(err)
        ])
})

router.get('/postsfromfollowing',requiredLogin,(req,res) => {
    // if postedBy are in follwing array, return Post
    Post.find({postedBy:{$in:req.user.following}})
        .populate("postedBy","_id name")
        .then(posts => {
            res.json({posts})
        })
        .catch(err => [
            console.log(err)
        ])
})


router.post('/createpost',requiredLogin, (req,res) => {
    const {title,price,body,imageurl} = req.body
    console.log(title,price,body,imageurl);
    if (!title ||  !price || !body || !imageurl ) {
        res.status.apply(422).json({error: "Please file all the boxes"})

    }
/*    console.log(req.user) */
  /*   res.send("ok")  */

  // make the password from user info undefine (not to show the password)
  req.user.password = undefined
    const post = new Post ({
        title,
        price,
        body,
       image: imageurl,
        postedBy: req.user
    })
    post.save()
        .then(result =>{
            res.json({post:result})
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/mypost',requiredLogin,(req,res) => {
    Post.find({postedBy: req.user._id})
    .populate("postedBy", "_id name")
    .then(mypost => {
        res.json({mypost})
    })
    .catch(err=> {
        console.log(err)
    })
})

// use put for updating 
router.put('/interested',requiredLogin,(req,res)=>{
    // postId is comig from the front end
    Post.findByIdAndUpdate(req.body.postId, {
        // this is the id of the user who is interested in the product
        $push: {interested:req.user._id}
    }, {
        // updated post
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }

    })
 
})
router.put('/uninterested',requiredLogin,(req,res)=>{
    // postId is comig from the front end
    Post.findByIdAndUpdate(req.body.postId, {
        // this is the id of the user who is interested in the product
        $pull: {interested:req.user._id}
    }, {
        // updated post
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }

    })
 
})

router.delete('/deletepost/:postId',requiredLogin,(req,res)=> {
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err, post)=> {
        if(err || !post) {
            return res.status(422).json({error:err})
        }
        // in order to change objects into string use toString function
        if(post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove()
                .then(result => {
                    res.json(result)
                }).catch(err => {
                    console.log(err)
                })
        }
    })
})
module.exports = router