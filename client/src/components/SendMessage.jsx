import React, {useState, useEffect } from "react";
import { sendMessageSocket } from "../../sockets/sockets"


function SendMessage({receiverid , AccessToken , SetMessage  , SenderId }) {
    const [message, setMessage] = useState("");


        const SendMessageValue = async () => {
          sendMessageSocket( SetMessage ,  message , receiverid , SenderId);
          setMessage("");
            try {
            const response = await fetch(
                `http://localhost:3000/api/message/sendmessage/${receiverid}`,
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${AccessToken}`,
    
                },
    
                body: JSON.stringify({
                    message,
                }),
                }
            );
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
            
            console.log("Message sent:", data);
            } catch (error) {
            console.error("Error sending message:", error);
            }
        };


  return (
    <div className="h-[10%] pt-2 bg-transparent backdrop-blur-sm  flex justify-between items-center">
      <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
        type="text"
        className="w-[90%] h-11 rounded-lg bg-gray-800 text-white px-4 outline-none border-none"
        placeholder="Type a message"
      />
      <button onClick={SendMessageValue}  className="w-[10%] h-11 rounded-lg bg-green-500 text-white">
        Send
      </button>
    </div>
  );
}

export default SendMessage;
