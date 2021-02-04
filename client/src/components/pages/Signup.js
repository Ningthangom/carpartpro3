import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
    const history = useHistory();

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")
    
    useEffect(()=> {
        if(url){
            uplaodFields()
        }
    },[url])

    const uploadImage = ()=> {
                    // Formdata for fileuploading
                    const data = new FormData()
                    data.append("file",image)
                    data.append("upload_preset","carparts_main")
                    data.append("cloud_name","ningthangom")
                    fetch("	https://api.cloudinary.com/v1_1/ningthangom/image/upload",{
                        method:"post",
                        body:data
                    })
                    .then(res=> res.json())
                    .then(data=>{
                        setUrl(data.url)
                    }).catch(err=>{
                        console.log(err)
                    })
        }
    const uplaodFields = () => {
        // checking email address
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email address",classes:"#d50000 red accent-4"})
            return
        }
        console.log("postdata firing")
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes:"#d50000 red accent-4"})
            }else {
                M.toast({html: data.message,classes:"#00c853 green accent-4"})
                history.push('/signin')

            }
        
        }).catch(err=> {
            console.log(err)
        })

    }
    const PostData = () => {
            if(image) {
                uploadImage()
            }else{
                uplaodFields()   
            }     
        }

    return (
        <div className="mycard">
                <div className="card auth-card input-field ">
                       <h2>CarParts</h2>
                       <p>handing you the part</p>
                       <input 
                       type="text"
                       placeholder="Full Name"
                       value={name}
                       onChange={(e)=>setName(e.target.value) }
                       />
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
                    <div className="file-field input-field">
                            <div className="btn #3949ab indigo darken-1">
                                <span>profile Image</span>
                                <input type="file"
                                onChange = {(e)=>setImage(e.target.files[0])}
                                />
                            </div>
                            <div className="file-path-wrapper">
                                
                                <input className="file-path validate" type="text"/>
                            </div>
                    </div>
                        
                         <button className="btn waves-effect waves-light #2196f3 blue" onClick={PostData}>Sign Up</button>
                         <h6>
                             <Link to="/signin">Already Have an account?</Link>
                         </h6>
                </div>   
        </div>
    )
}


export default Signup