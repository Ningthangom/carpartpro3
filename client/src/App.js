
import React,{useEffect,createContext,useReducer,useContext}  from 'react'
import Navbar from './components/Navbar'
import "./App.css"
import {BrowserRouter, Route, Switch,useHistory} from 'react-router-dom'
import Home from "./components/pages/Home"
import Signin from "./components/pages/SignIn"
import Profile from "./components/pages/Profile"
import Signup from "./components/pages/Signup"
import CreatePost from "./components/pages/CreatePost"
import UserProfile from "./components/pages/UserProfile"
import PostsFromFollowing from "./components/pages/PostsFromFollowing"

import {reducer,initialState} from "./reducers/userReducer"



// export this, to import in Signin page
export const UserContext = createContext()

//routing componet to wrap all the routing
const Routing =() => {

      const history= useHistory();

      // this is for when user close the application but did not log in
      const {state,dispatch} = useContext(UserContext)

      useEffect( ()=> {
            // user in localstorage is string it needs to be changed into objects
            // to do that use json.parse
            const user =JSON.parse(localStorage.getItem("user")) 
            /* console.log(typeof(user),user) */
            // if the user has account then direct it to home 
            // if not , direct it to login page
            if (user) {
                  console.log("user detail",user)
                  dispatch({type: "USER", payload:user})
                 /*  history.push('/') */
            }else {
                  history.push('/signin')
            }
      },[])
      return (
      <Switch>
                  <Route exact path="/">
                              <Home />
                  </Route>
                  <Route path= "/signin">
                        <Signin/>
                  </Route>
                  {/* exact is used to make sure the profile is not shown in Userprofile */}
                  <Route  exact path="/profile">
                        <Profile/>
                  </Route>
                  <Route path="/signup">
                        <Signup/>
                  </Route>
                  <Route path="/create">
                        <CreatePost/>
                  </Route>
                  <Route path="/profile/:userid">
                        <UserProfile/>
                  </Route>
                  <Route path="/postsfromfollowing">
                        <PostsFromFollowing/>
                  </Route>
       </Switch>
      )
}

function App() {
      const [state,dispatch] = useReducer(reducer,initialState)

  return (
        <UserContext.Provider value= {{state,dispatch}}>

                  
                  <BrowserRouter>
                        <Navbar/>
                        <Routing/>
                  </BrowserRouter>

    </UserContext.Provider>
  
   

  );
}

export default App;
