import React,{useState, useContext}from 'react'
import {Link,useHistory} from 'react-router-dom'
//import from App js
import {UserContext} from '../../App'
import M from 'materialize-css'



const SignIn = () => {
    const {dispatch} = useContext(UserContext)
    const history = useHistory();
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const PostData = () => {
        // checking email address
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email address",classes:"#d50000 red accent-4"})
            return
        }
        console.log("postdata firing")
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:"#d50000 red accent-4"})
            }else {
                // save the token to local storage
                const user = {}
                user["email"] = data.email
                user["id"] = data._id
                user["name"]=data.name
                user["pic"]=data.pic
                
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(user))
                //the dispatch will go to userReducer
                dispatch({type:"USER", payload:data.user})

                M.toast({html: "You have successfully signed in",classes:"#00c853 green accent-4"})
                // why isn't this happening when sigin in
                history.push('/')
         window.location.reload()  

            }
           
        }).catch(error=> {
            console.log(error)
        })
     
    }

    return (
        <div className="mycard">
                <div className="card auth-card input-field ">
                       <h2>CarParts</h2>
                       <p>handing you the part</p>
                       <input 
                       type="text"
                       placeholder="email"
                       value={email}
                       onChange={(e)=>setEmail(e.target.value) }
                       />
                       <input 
                       type="password"
                       placeholder="password"
                       value={password}
                       onChange={(e)=>setPassword(e.target.value) }
                       />
                         <button className="btn waves-effect waves-light #2196f3 blue darken-1" onClick={PostData}>Login</button>
                         <h6>
                             <Link to="/signup">Don't Have an account?</Link>
                         </h6>
                </div>   
        </div>
    )
}


export default SignIn