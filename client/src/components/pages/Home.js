import React, {useState,useEffect,useContext} from 'react'

// to acces the user for hiding interested button
import {UserContext} from '../../App'
//  import link for making view profile of the account that posted that post
import {Link} from 'react-router-dom'

const Home = () => {
    const [data,setData] = useState([ ])
    // console.log("data before clicking likes", data)
    //state has login user details
    const {state} = useContext(UserContext)
    // console.log("this state has current login user info", state)

    useEffect(() => { 
        fetch('/allpost', {
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt')
            }
        }).then (res => res.json())
        .then(result => {
        //  console.log(result) 
            // update data
            setData(result.posts)
            // console.log(result.posts)
        })
        // this emty array will stop the app from updating itself 
    },[data])

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
            const thisisresult = [result]
            console.log(thisisresult)
         /*    console.log(result) */
                      // logic for number of  interested/uninterested 
                      console.log(data)

                      const newData = data.map(item => {
                          const thisisresult = [result]
                          console.log(thisisresult)
                        console.log("these are itmes", item)
                        if(item._id===result._id){
                            return result
                        }else {
                            return item
                        }
                   })
                   setData(newData)
               /*     window.location.reload()   */
                   console.log("this is new state when click likes", newData)
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
        // window.location.reload()  
        }).catch(err=>{
            console.log(err)
        })
    }

    return (
      <div className="home">
          {
              data.map(item => {
                //   console.log("this is state after item ", state)
                //   console.log("items from home",item)
                //   console.log(state._id)
                //   console.log(item.interested)

                return(
                    <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"8px"}}>
                            <img alt = ""  src={item.postedBy.pic} 
                                 style= {{width:"40px", height: "40px",
                                                 borderRadius: "80px",
                                                 margin:"",
                                                 /* position:"relative",
                                                left:"50%" */}} 
                                />
                                <Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}>
                              
                                      {item.postedBy.name}</Link>
                                                {/* {item.postedBy._id === state._id
                                    && <i className="material-icons" style={{
                                        float:"right"

                                    }}
                                    onClick={()=>deletePost(item._id)}
                                    >delete</i>
                                    }  */}
                            </h5> 
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