const express = require('express');
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
require('dotenv').config(); 
/* const {MONGOURI}= require('./config/keys') */

// mongo Atlas password: 9YjPOWVTkram4YDs
mongoose.connect(process.env.MONGOURI || 'mongdb://localhost/carparts',{
    useNewUrlParser: true,
    useUnifiedTopology: true 
}) 
mongoose.connection.on('connected', ()=> {
    console.log('connected to mongo')
})

mongoose.connection.on('error', (err)=> {
    console.log('error when connected mongo', err)
})


// did not put this in a const as schema was not exported to avoid required error
require('./models/user')
require('./models/post')

app.use(express.json())
app.use(express.urlencoded({ extended:false}))

// to pass incoming request to json
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
     const path = require ('path')
    app.get("*",(req,res)=> {
        res.sendFile(path.join(__dirname,'client','build','index.html'))
    }) 
} 

app.listen(PORT, ()=> {
    console.log("server is running on ", PORT)
})