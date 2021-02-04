import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

//  import link for making view profile of the account that posted that post
import {Link} from 'react-router-dom'


/* const deletePost = (postid) => {
    console.log("deletePost is firing")
    fetch(`/deletepost/${postid}`,{
        method: "delete",
        headers: {
            Authorization: "Bearer "+localStorage.getItem('jwt')
        }
    }).then(res=> res.json())
    .then(result=> {
        console.log(result)
    })
} */
const Profile = () => {
    const [myposts, setMyPosts] = useState([])
    // const [data,setData] = useState([ ])
    // for getting the user info
    const {state,dispatch} = useContext(UserContext)
    console.log("this is state",state)

    useEffect(()=> {
        fetch('/mypost',{
            headers: {
                "Authorization": "Bearer "+ localStorage.getItem('jwt')
            }
        }).then(res=>res.json())
        .then(result=> {
            console.log(result)
            setMyPosts(result.mypost)
        })

    },[])
    const deletePost = (postid) => {
        // console log will not show in dev tool for long as the page is reloaded 
        // its believe to be due to onclick function
        console.log("deletePost is firing")
        fetch(`/deletepost/${postid}`,{
            method: "delete",
            headers: {
                Authorization: "Bearer "+localStorage.getItem('jwt')
            }
        }).then(res=> res.json())
        .then(result=> {
            console.log(result)
              const newData = myposts.filter(item=>{
                return item._id !== result._id
            })
            setMyPosts(newData) 
        }).catch(err=>{
            console.log(err)
        }) 
}


    return ( 
        <div style={{
            maxWidth:"550px",
            margin:"0px auto"
             }}>
                <div style= {{
                    display:"flex",
                    // ask how to move the tex to the left
                    justifyContent:"space-around",
                    margin:"18px 0",
                    borderBottom: "1px solid grey"
                }} >
                        <div>
                                <img alt = ""  src={state?state.pic:"loading"}
                                 style= {{width:"160px", height: "160px",
                                                 borderRadius: "80px",
                                                 margin:"20px",
                                                 /* position:"relative",
                                                left:"50%" */}} 
                                />
                        </div>
                        <div>
                            <h4>{state?state.name:"loading"}</h4>
                            <h6>{state?state.email:"loading"}</h6>
                            <div style ={{display:"flex",justifyContent:"space-between", width:"108%"}}>
                                <h5>{myposts.length} posts </h5>
                                <h5> {state?state?.followers?.length: "0"} followers</h5>
                                <h5>{state?state?.following?.length: "0"} following</h5>
                            </div>
                            {/* <button className="btn waves-effect waves-light #2196f3 blue darken-1"
                         onClick={followUser}>follow</button> */}
                        </div>
                </div>
                    <div className="home">
                    {
                        myposts.map(item => {
                            console.log(state)
                            console.log("items from home",item)
                            console.log(state._id)
                            console.log(item.interested)

                            return(
                                <div className="card home-card" key={item._id}>
                                        <h5 style={{padding:"8px"}}> {item.postedBy._id === state._id
                                        && <i className="material-icons" style={{
                                            float:"right"
                                        }}
                                        onClick={()=>deletePost(item._id)}
                                        >delete</i>
                                        } </h5>
                                        <div className="card-mage">
                                            <img alt="" src ={item.image} 
                                            style= {{
                                                maxWidth :"500px",

                                            } } />
                                        </div>
                                        <div className="card-content">
                                                <h6>{item.interested.length} interested</h6>
                                                <h6>{item.title}</h6>
                                                <h8>${item.price}</h8>
                                                <p>{item.body}</p>
                                            {/*  <input type="text" placeholder="add a comment"/> */}
                                            
                                        </div>
                            </div>

                            )
                        })
                    }
            </div>
            </div>
    )
 }

export default Profile
