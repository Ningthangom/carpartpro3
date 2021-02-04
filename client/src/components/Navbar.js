import React,{useContext,useEffect} from 'react'

import {Link,useHistory} from 'react-router-dom'
import {UserContext } from '../App'
const Navbar = () => {
  const {state,dispatch} = useContext(UserContext)
  console.log("first state", state)
  const history = useHistory()
  useEffect(() => {
    // Update the document title using the browser API
   /*  document.title = `You clicked ${count} times`; */
   console.log(state)

  },[state]);
  const renderList = () => {
  /*   window.location.reload() */
    if (state) {
     /*   console.log(state) 
 */
      // reuturn the array as more than one is needed as output
      return (
        <>
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/create">Create Post</Link></li>,
        <li><Link to="/postsfromfollowing">Posts from Following</Link></li>,
        <li>
        <button className="btn waves-effect waves-light #2196f3 blue darken-1" onClick={()=>{
             localStorage.clear()
             dispatch({type:"CLEAR"})
             // redirect the app to Login page when logout 
             history.push('/signin')
        /*     window.location.reload() */
           }}>Log Out</button>
        </li>
        </>
      )
      }else {
        return[
          <li><Link to="/signin">Login</Link></li>,
            <li><Link to="/signup">Sign Up</Link></li>
        ]
      }
    }
  
   return (
        <nav>
        <div className="nav-wrapper white" >
          {/*   to stop access home without loggin in put conditon with (state present or not)   */}
          <Link to={state? "/": "/signin"} className="brand-logo left">CarParts</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav>
    )
}

export default Navbar