
import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = ()=> {
    const history = useHistory();
    
    const [title,setTitle] = useState("")
    const [price,setPrice] = useState("")
    const [body,setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    // this useEffect is to make sure that Nodejs is run after the ImagePost is done executing
    useEffect(()=>{
        if(url){
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": "Bearer "+localStorage.getItem("jwt")
    
                },
                body:JSON.stringify({
                    title,
                    price,
                    body,
                    imageurl:url
                })
            }).then(res=>res.json())
            .then(data=>{
             /*    console.log(data) */
                if(data.error){
                    M.toast({html: data.error,classes:"#d50000 red accent-4"})
                }else {
                    M.toast({html: "You have successfully uploaded the post",classes:"#00c853 green accent-4"})
                    history.push('/')
    
                }
               
            }).catch(error=> {
                console.log(error)
            }) 
        }

    },[url])

    const ImagePostDetails = () => {
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

    return(
        <div className="card input-filed"
        style={{
            margin:"30px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"

        }}
        >
            <input type="text"
             placeholder="make year model part" 
             value={title}
             onChange={(e) => setTitle(e.target.value)}
             />
            <input type="text"
             placeholder="price" 
             value={price}
             onChange={(e) => setPrice(e.target.value)}
             />
            <input type="text"
             placeholder="detail"
             value={body}
             onChange={(e) => setBody(e.target.value)}

              />
            <div className="file-field input-field">
                    <div className="btn #3949ab indigo darken-1">
                        <span>Uplaod Image</span>
                        <input type="file"
                        onChange = {(e)=>setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light #2196f3 blue darken-1"
                onClick={ImagePostDetails}
                >Submit Post</button>
                        

        </div>
    )
}

export default CreatePost