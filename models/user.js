const mongoose= require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/ningthangom/image/upload/v1611996257/carparts_main/codingboyedited_lacdpc.png"
    },
    // objectId is used here to connect the ids from User (this model self)
    followers: [{
        type:ObjectId,ref:"User"
    }],
    following: [{
        type:ObjectId,ref:"User"
    }]
})

mongoose.model("User", userSchema);