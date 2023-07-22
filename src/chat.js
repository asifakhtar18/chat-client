import React, { useContext, useEffect, useRef, useState } from "react"
import {uniqBy} from 'lodash'

import Logo from "./logo";
import { userContext } from "./userContext";
import axios from "axios";
import Contact from "./contact";

export default function Chat(){

    const [ws , setWs] = useState(null);
    const [onlinePeople , setOnlinePeople] = useState({})
    const [selectedUserId ,setSelectedUserId] = useState(null)
    const [newMessageText , setNewMessageText] = useState('') 
    const [messages , setMessages] = useState([])
    const [offlinePeople , setOfflinePeople] = useState({})

    
    
    const { LoggedInUsername , id ,setId ,setUsername } = useContext(userContext);

    const divUnderMessages = useRef();


    useEffect(() =>{
        connectToWs();    
    },[]);


    function connectToWs(){
        const ws = new WebSocket('ws://localhost:4000')
        setWs(ws)
        ws.addEventListener('message', handleMessage );
        ws.addEventListener('close' , () => {
            setTimeout(() => {
                console.log('Disconeected. Trying to reconnect ')
                connectToWs();
            } , 1000);  
        })

    }

    function showOnlinePeople(peopleArray){
        const people = {}
        peopleArray.forEach(({userId , username}) => {
            people[userId] = username;
        });
       setOnlinePeople(people)
       
    }

    function handleMessage(ev){
        const messageData = JSON.parse (ev.data)
        if('online' in messageData){
            showOnlinePeople(messageData.online)
        }else if('text' in messageData) {
            setMessages( prev => ([...prev , { ...messageData}]))
        }

    }

    function logout(){

    }


  

   

    function sendMesaage(e){
        e.preventDefault();
        ws.send(JSON.stringify({
                recipient: selectedUserId,
                text : newMessageText,
        }))
        setNewMessageText('')
        setMessages(prev => ([...prev , {
            sender:id,
            recipient:selectedUserId,
            text:newMessageText , 
            _id: Date.now(),
        }]))
        
    }

    useEffect(() =>{
        const div = divUnderMessages.current;
        if(div){

            div.scrollIntoView({behavior:'smooth' , block :'end'});
        }
    }, [messages]);

    useEffect(() => {
        axios.get('/people').then(res => {
            const offlinePeopleArr = res.data
            .filter(p => p._id !== id)
            .filter(p => !Object.keys(onlinePeople).includes(p._id))
            const offlinePeople = {};
            offlinePeopleArr.forEach(p => {
                offlinePeople[p._id] = p;
            })
            setOfflinePeople(offlinePeople);
        })
    },[onlinePeople])


    useEffect(() => {
        if(selectedUserId){

            axios.get('/messages/'+selectedUserId )
            .then(res => {
                setMessages(res.data)
            })
           
        }
    },[selectedUserId])


    const onlinePeopleExUser = {...onlinePeople}
   
    delete onlinePeopleExUser[id]

    const messagesWithoutDupes = uniqBy(messages , '_id');

    
    return(
        <div className="flex h-screen">
             
            <div className="w-1/3 flex flex-col ">  
            
            <div className="flex-grow">
                
                <Logo />
                    {Object.keys(onlinePeopleExUser).map(userId => (
                    <Contact 
                        key={userId}
                        id={userId} 
                        online={true}
                        username={onlinePeopleExUser[userId]} 
                        onClick={ () => setSelectedUserId(userId)}
                        selected={userId === selectedUserId}
                    />
                ))}   

                {Object.keys(offlinePeople).map(userId => (
                    <Contact 
                        key={userId}
                        id={userId} 
                        online={false}
                        username={offlinePeople[userId].username} 
                        onClick={ () => setSelectedUserId(userId)}
                        selected={userId === selectedUserId}
                    />
                ))}   


            </div>

            <div className="p-2 text-center">
                <button className="text-sm bg-blue-100 py-1 px-3 text-gray-500 rounded-sm" 
                        onClick={logout}
                >
                    logout
                </button>
            </div>
              
            </div>
            
           
            
            <div className="flex flex-col bg-blue-50 w-2/3 p-2 ">

                <div className="flex-grow">
                    {!selectedUserId && (
                        <div className="flex h-full items-center justify-center">
                               <div className="text-gray-400"> &larr; select a chat </div>
                        </div>
                    )}
                </div>

                {!!selectedUserId && (

                    <div className="relative h-full">
                        <div className=" overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                            {messagesWithoutDupes.map( message => (
                            <div key={message._id} className={(message.sender === id ? 'text-right' : 'text-left')}  >
                                <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " +(message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-blue-500')}>
                                    {message.text}
                                </div>
                            </div>
                            ))}

                            <div ref={divUnderMessages}></div>
                        </div>
                    </div>
                )}

                

                

                {!!selectedUserId && (

                    <form className="flex gap-2 " onSubmit={sendMesaage}>
                        <input 

                    
                            value={ newMessageText }
                            onChange={(e) => setNewMessageText(e.target.value)}
                            type="text" 
                            className="bg-white flex-grow border rounded-sm p-2"
                            placeholder="Type your message here.."
                        />

                        <button disabled={!newMessageText} className="bg-blue-500 p-2 text-white rounded-sm">
                            
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>

                    </form>
                )}

            </div>
        
        </div>
    )
}