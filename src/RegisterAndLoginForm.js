import axios from 'axios';
import React , {useContext, useState} from 'react';
import { userContext } from './userContext';
import Logo from './logo';


export default function RegisterAndLoginForm(){
    const [username , setUsername] = useState('');
    const [password , setPassword] = useState('');
    const [isLoginOrRegister , setIsLoginOrRegister] = useState('register')

    const {setLoggedInUsername , setId  } = useContext(userContext)
    
    async function handleSubmit(e){
        e.preventDefault();
        const url = isLoginOrRegister === 'register' ? 'register' : 'login'
        try{
            const {data} = await axios.post(url , {username , password});
        setLoggedInUsername(username);
        setId(data.id);
        }
        catch(err){
            //console.log("error happened error");
            alert(err.response.data.err);
        }
    }

   return(
    
    <div className="bg-blue-50 h-screen flex items-center ">
        <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
            
           <div className="px-14" >
                <Logo  />
           </div>
           

            <input
                value = {username} 
                type="text" 
                placeholder="username"
                onChange={ e => setUsername(e.target.value)}
                className="block w-full rounded-sm p-2 mb-2"/>
            <input 
                value={password}
                onChange={ e => setPassword(e.target.value)}
                type="password" 
                placeholder="password" 
                className="block w-full rounded-sm p-2 mb-2" />
            
            <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
                {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
            </button>
           

            <div className='text-center mt-2'>
            {
                isLoginOrRegister === 'register' && (
                    <div>
                        Already a member ?  
                        <button onClick={()=>setIsLoginOrRegister('login')}>
                            Login here
                        </button>
                    </div>

)}
            {
                isLoginOrRegister === 'login' && (
                    <div>
                        Don't have an account ? 
                        <button onClick={()=>setIsLoginOrRegister('register')}>
                            Register
                        </button>
                    </div>

)}
               
            </div>
        </form>
    </div>
   ) 
}