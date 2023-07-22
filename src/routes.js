import { useContext } from "react";
import RegisterAndLoginForm from "./RegisterAndLoginForm";
import { userContext } from "./userContext";
import Chat from "./chat";


export default function Routes(){
    
    const {LoggedInUsername } = useContext(userContext);
    
    if(LoggedInUsername ){
        return (
            <Chat />
        )
    }

    
    return(
        <RegisterAndLoginForm />
    )
}