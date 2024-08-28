import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faSearch,
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";
function ChatHeader({ chatPerson }) {
  return (
    <div className="w-[95%] mt-5 flex mx-auto rounded-lg bg-gray-900 backdrop-blur-3xl px-5 py-3">
             <div className="avatar">
               <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring ring-offset-2">
                 <img src={chatPerson.Image }/>
               </div>
             </div>
 
             <div className="ml-5 w-full text-xl mt-1 font-semibold text-white">{chatPerson.name}</div>
 
             <div className="w-fit h-full flex justify-center mt-3 items-center gap-6">
               <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-white hover:cursor-pointer" />
 
               <FontAwesomeIcon icon={faGear} className="h-5 w-5 text-white hover:cursor-pointer" />
 
               <FontAwesomeIcon
                 icon={faVideoCamera}
                 className="h-5 w-5 text-white hover:cursor-pointer"
               />
             </div>
 
             <div></div>
           </div>
  )
}

export default ChatHeader
