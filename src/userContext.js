import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const userContext = createContext({});

export function UserContextProvider({children}){

    const [LoggedInUsername , setLoggedInUsername] = useState(null);
    const [id , setId] = useState(null);
   
    

    useEffect(() =>{
            
            axios.get('/profile').then(response => {
                setId(response.data.userId)
                setLoggedInUsername(response.data.username)
            }).catch((err) => {
                console.log("here");
                // alert("User not exist");
            })
        
    
    } ,[ LoggedInUsername])

    return(
        <userContext.Provider value={{LoggedInUsername , setLoggedInUsername , id , setId  }}>
            {children}
        </userContext.Provider>
    )
}