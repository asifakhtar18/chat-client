
import Avatar from "./avatar"


export default function Contact({id , onClick , selected  , online , username}){
    return(
        <div key={id} onClick={() => onClick(id)} 
            className={ " border-b border-gray-100  flex items-center gap-2  cursor-pointer "+(id === selected? 'bg-blue-50' : '')}>
            { selected &&(
                <div className="w-1 bg-blue-500 h-12"> </div>
            )}

            <div className="flex gap-2 py-2 pl-4 items-center">
                <Avatar online={online} username={username} userId={id} />
                <span className="text-gray-800">
                    {username}
                </span>
            </div>
        </div>
    )
}