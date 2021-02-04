
const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type:String,
        // required:true,
    },
    body: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    interested:[{type:ObjectId,ref:"User"}],
    //getting user from other schema
    postedBy: {
        type:ObjectId,
        ref:"User"
    }
})

mongoose.model("Post",postSchema);