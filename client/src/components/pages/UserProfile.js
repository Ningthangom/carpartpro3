import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
// this useParams is used for accesing userid in app.js /profile/userid
import {useParams} from 'react-router-dom'
import axios from 'axios';

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
    // set the initial state as null 
    const [userProfile, setUserProfile] = useState(null)
 
   
    // for getting the user info
    const {state,dispatch} = useContext(UserContext)
    console.log("this is state",state)
    
    // this user id comes from app.js (<Route path="/profile/:userid">)
     const {userid} = useParams() 
    console.log("this is ",userid,"from userprofile")
       // if there is no id of current login user inside following which is inside state 
       // then show follow button
       // else show follow button
    //    const followingUserid = (state? !state.following.includes(userid) : true)
       const [showfollow,setShowFollow] =  useState(state?!state?.following?.includes(userid):true)
// http://localhost:5000
    useEffect(()=> {
        fetch(`/user/${userid}`,{
            method:"get",
            headers: {
                "Authorization": "Bearer "+ localStorage.getItem('jwt')
            }
        }).then(res=>res.json())
        .then(result=> {
            console.log(result)
           
            setUserProfile(result)
          /*   setImage(result.mypost) */
        })

    },[]) 

    const followUser = ()=> {
        console.log("followUser is called")
        fetch('/follow', {
            
            // put is for updating the data
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                // followId from the backend is set to current userid
                followId:userid
            })
        })
        // send the response to json
        .then(res=>res.json())
        // get the result
        .then(result => {
            console.log(result)
            // this dispatch will update user
            dispatch({type:"UPDATE",payload:{following:result.following, followers:result.followers}})
            //update local storage
            localStorage.setItem("user",JSON.stringify(result))
            //update the state
            // use a callbak to get the previous state
            setUserProfile((prevState)=> {
                return{
                    ...prevState,
                    // overwrite the user by setting it to the new result
                    user:{
                        ...prevState.user,
                        followers:[
                            // add id from result into followers array from the prevstate
                            ...prevState.user.followers,result._id
                        ]
                    }
                }
            })
            setShowFollow(false)
        })
   }
    const unfollowUser = ()=> {
        console.log("unfollowUser is called")
        fetch('/unfollow', {
            
            // put is for updating the data
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                // unfollowId from the backend is set to current userid
                ufollowId:userid
            })
        })
        // send the response to json
        .then(res=>res.json())
        // get the result
        .then(result => {
            console.log(result)
            // this dispatch will update user
            dispatch({type:"UPDATE",payload:{following:result.following, followers:result.followers}})
            //update local storage
            localStorage.setItem("user",JSON.stringify(result))
            //update the state
            // use a callbak to get the previous state
            setUserProfile((prevState)=> {
                const newFollowers = prevState.user.followers.filter(item => item !== result._id)
                return{
                    ...prevState,
                    // overwrite the user by setting it to the new result
                    user:{
                        ...prevState.user,
                        followers:newFollowers
                    }
                }
            })
            //this will reset the unfollow button to follow
            setShowFollow(true)
        })
   }


    return (
    <>
    {userProfile 
    ? 
       <div style={{
        maxWidth:"550px",
        margin:"0px auto"
         }}>
            <div style= {{
                display:"flex",  
                justifyContent:"space-around",
                margin:"18px 0",
                borderBottom: "1px solid grey"
            }} >
                    <div>
                            <img alt = ""  src={userProfile.user.pic}
                             style= {{width:"160px", height: "160px",
                                             borderRadius: "80px",
                                             margin:"20px",
                                             /* position:"relative",
                                            left:"50%" */}} 
                            />
                    </div>
                    <div>
                        <h4>{userProfile.user.name}</h4>
                        <h5>{userProfile.user.email}</h5>
                        <div style ={{display:"flex",justifyContent:"space-between", width:"108%"}}>
                            <h5> {userProfile.posts.length} posts </h5>
                            <h5> {userProfile.user.followers.length} followers</h5>
                            <h5> {userProfile.user.following.length} following</h5>         
                        </div>
                        {showfollow?
                         <button 
                         style={{
                            margin:"10px"
                         }} 
                         className="btn waves-effect waves-light #2196f3 blue darken-1"
                         onClick={followUser}>follow</button>
                         :
                         <button 
                         style={{
                            margin:"10px"
                         }} 
                         className="btn waves-effect waves-light #2196f3 blue darken-1"
                         onClick={unfollowUser}>unfollow</button>
                        }
                       
                      
                    </div>
            </div>
            <div className="gallery">
                {
                    userProfile.posts.map(item=> {
                        return(
                            <div className="card home-card" key={item._id}>
                           {/*  <h5>{item.postedBy.className}</h5> */}
                            <div className="card-mage">
                                <img alt="" src ={item.image} 
                                style= {{
                                    maxWidth :"500px"
                                } } />
                            </div>
                            <div className="card-content">
                                  {/*   <i className="material-icons" style={{color:"red"}}>favorite</i> */}
                                    <h6>{item.title}</h6>
                                    <p>{item.body}</p>
                                    {/* <input type="text" placeholder="add a comment"/> */}
                              {/*      <a href="https://www.paypal.com/paypalme/ningthangom"> <button  className="btn waves-light #2196f3 blue" style={{
                                        margin:"10px"
                                    }}>edit</button></a>
                                    <button className="btn waves-light #2196f3 blue"  style={{
                                        margin:"10px"
                                    }}>sold</button> */}
                                      {/* <button className="btn waves-light #2196f3 blue"  style={{
                                        margin:"10px"
                                    }}
                                 
                                   
                                    >cancel</button>  */}
                            </div>
                  </div>

                         /*    <img   className = "item"
                            src = {item.image} alt={item.title}/> */
                        )
                    })
                }
            </div>
         </div>
    : <h2>loading.........</h2>}
     
    </>
    )
}

export default Profile
