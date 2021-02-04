import React, {useState,useEffect,useContext} from 'react'

// to acces the user for hiding interested button
import {UserContext} from '../../App'
//  import link for making view profile of the account that posted that post
import {Link} from 'react-router-dom'

const Home = () => {

    const [data,setData] = useState([ ])

    //state has login user details
    const {state,dispatch} = useContext(UserContext)
    console.log("this is for user checking for interested array", state)

    useEffect(() => {
        fetch('/allpost', {
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt')
            }
        }).then (res => res.json())
        .then(result => {
         console.log(result) 
            // update data
            setData(result.posts)
        })
        // this emty array will stop the app from updating itself 
    },[])

    const interestedPost = (id)=> {
        fetch('/interested',{
            method:"put",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                //postId is from router.put('/interested') req.body.postId
                postId:id
            })
        }).then(res=> res.json())
        .then(result=> {
         /*    console.log(result) */
                      // logic for number of  interested/uninterested 
                      const newData = data.map(item => {
                        if(item._id===result._id){
                            return result
                        }else {
                            return item
                        }
                   })
                   setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const uninterestedPost = (id)=> {
        fetch('/uninterested',{
            method:"put",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                //postId is from router.put('/interested') req.body.postId
                postId:id
            })
        }).then(res=> res.json())
        .then(result=> {
          /*   console.log(result) */
              // logic for number of  interested/uninterested 
         const newData = data.map(item => {
             if(item._id ===result._id){
                 return result
             }else {
                 return item
             }
        })
        setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }
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
              const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData) 
        }).catch(err=>{
            console.log(err)
        }) 
}
    return (
      <div className="home">
          {
              data.map(item => {
                  console.log(state)
                  console.log("items from home",item)
                  console.log(state._id)
                  console.log(item.interested)

                return(
                    <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"8px"}}>
                                <Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}>
                                <img alt = ""  src={item.postedBy.pic}
                                 style= {{width:"40px", height: "40px",
                                                 borderRadius: "80px",
                                                 margin:"",
                                                 /* position:"relative",
                                                left:"50%" */}} 
                                />
                                    {item.postedBy.name}</Link>  {item.postedBy._id === state._id
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
                                    <i className="material-icons" style={{color:"red"}}>favorite</i>
                                  {/* dot includes is not working or it's not functioning */}
                                  {/* The ternary operator in React */}
                                    {item.interested.includes(state._id)
                                    ? 
                                         <i className="material-icons" style={{margin:"10px"}} 
                                         onClick={()=>{
                                         uninterestedPost(item._id)
                                         }}
                                             >thumb_down</i>
                                            
                                    :
                                        <i className="material-icons" style={{margin:"10px"}}
                                                    onClick={()=>{
                                                        interestedPost(item._id)
                                                    }}
                                                
                                        >thumb_up</i>
                                    }
                                   
                                    <h6>{item.interested.length} interested</h6>
                                    <h6>{item.title}</h6>
                                    <h8>${item.price}</h8>
                                    <p>{item.body}</p>
                                   {/*  <input type="text" placeholder="add a comment"/> */}
                                   <a href="https://www.paypal.com/paypalme/ningthangom"> <button  className="btn waves-light #2196f3 blue" style={{
                                        margin:"10px"
                                    }}>buy</button></a>
                                    <button className="btn waves-light #2196f3 blue"  style={{
                                        margin:"10px"
                                    }}>contact the seller</button>
                            </div> 
                  </div>

                )
              })
          }
      </div>
    )
}


export default Home