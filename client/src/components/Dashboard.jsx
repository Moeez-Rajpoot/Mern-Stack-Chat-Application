import react, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import ChatPersonContainer from "./ChatPersonsContainer";
import MessageContainer from "./MessageContainer";
import ChatHeader from "./ChatHeader";
import { useSelector } from "react-redux";
import {
  initializeSocket,
  receiveMessageSocket,
  closeSocket,
} from "../../sockets/sockets";

function Dashboard() {
  const userData = useSelector((state) => state.UserData.userData);
  const [messages, setMessages] = useState([]);
  const [chatPerson, setChatPerson] = useState([
    {
      id: "",
      name: "",
      Image: "",
      isActive: false,
    },
  ]);

  useEffect(() => {

    console.log("Sockets are Running")
    if (userData) {
      initializeSocket( userData.id , userData); 
      receiveMessageSocket(setMessages);
    }

    return () => {
      closeSocket();
    };
  }, [userData]);

  return (
    <div>
      <div className="bg-gray-600 flex  w-screen h-screen overflow-hidden">
        <div className="flex flex-col mt-2 ml-3 border-2 border-black border-opacity-15 bg-gray-900  rounded-3xl w-[30%] max-h-[97.5%] ">
          <h2 className="w-full h-12 text-3xl font-mono pl-5 mt-2 text-green-600 ">
            Chats
          </h2>
          <ChatPersonContainer setChatPerson={setChatPerson} />
        </div>

        <div className="flex flex-col bg-gray-600 w-[70%] min-h-screen ">
          {chatPerson.isActive ? (
            <div className="min-h-screen">
              <ChatHeader chatPerson={chatPerson} />
              <MessageContainer
                selecteduser={chatPerson}
                messages={messages}
                setMessages={setMessages}
              />
            </div>
          ) : (
            <div className="w-[98%] h-[97.5%] mt-2 flex flex-col g  justify-center items-center mx-auto rounded-lg bg-gray-900 backdrop-blur-3xl px-5 py-3">
              <p className="text-center text-lg">
                Select a chat to start messaging ... <br />
                Chat Application Screen
                <br />
              </p>

              <p className="absolute bottom-10 right-auto text-center text-gray-500">
                End To End Encrypted Messaging. <br />
                But Still ISI will be able to See EveryThing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
