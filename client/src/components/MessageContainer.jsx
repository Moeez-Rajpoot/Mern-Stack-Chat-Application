import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import SendMessage from "./SendMessage";

function MessageContainer({ selecteduser }) {
  
  const userData = useSelector((state) => state.UserData.userData);
  const [messages, setMessages] = useState([]);
  const [updated, setUpdated] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const GetMessages = async () => {
      try {
        console.log("New User selected:", selecteduser);
        const accessToken = userData.accesstoken;

        console.log("Fetching messages for user:", selecteduser);

        const response = await fetch(
          `http://localhost:3000/api/message/getmessage/${selecteduser.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Messages fetched:", data);
        setMessages(data); 
      } catch (error) {
        console.error("Error fetching messages:", error);
      
      }
    };

    GetMessages();
  }, [selecteduser, updated]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="w-[95%] h-[85.5%] mt-2 flex flex-col mx-auto rounded-lg overflow-hidden bg-gray-900 backdrop-blur-3xl px-5 py-5">
      <div className="h-[90%] overflow-scroll hide-scrollbar">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`chat ${
                message.SenderId === userData.id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt={`${message.SenderId}'s avatar`}
                    src={
                      message.SenderId === userData.id
                        ? userData.Image
                        : selecteduser.Image
                    }
                  />
                </div>
              </div>
              <div className="chat-header">
                {message.SenderId === userData.id ? "You" : selecteduser.name}
                <time className="text-xs opacity-50 ml-2 ">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </time>
              </div>
              <div className="chat-bubble">{message.Message}</div>
            </div>
          ))
        ) : (
          <p className="text-white w-full text-center">
            No messages available.
            <br /> Send a Message to start a Conversation.
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <SendMessage
        receiverid={selecteduser.id}
        AccessToken={userData.accesstoken}
        setUpdated={setUpdated}
      />
    </div>
  );
}

export default MessageContainer;
