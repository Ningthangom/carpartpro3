
export const initialState = null

export const reducer = (state,action) => {
    if (action.type === "USER"){
        return action.payload
    }
    // logging out
    if (action.type === "CLEAR"){
        return null
    }
    // UPDATING USER WHEN FOLLOWING
    if(action.type === "UPDATE"){
        return{
            ...state,
            followers:action.payload.followers,
            following: action.payload.following
        }
    }
    return state
}