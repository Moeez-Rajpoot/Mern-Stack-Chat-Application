import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function ChatsPersons({ setChatPerson, isActive, setIsActive , Data  }) {
  
  const handleClick = () => {
    setIsActive();
    setChatPerson({
      id: Data._id,
      name: Data.Username,
      Image: Data.Image,
      isActive: true,
    }); 

  };

  return (
    <>
      <div
        onClick={handleClick} 
        className={`${
          isActive
            ? "bg-[#1c1f2b] transform scale-[102%] transition ease-linear"
            : "bg-gray-900 backdrop-blur-3xl"
        } py-2 px-3 rounded-2xl hover:bg-[#1c1f2b99] border-[1px] border-opacity-15 border-white flex items-center hover:cursor-pointer`}
      >
        <div className="avatar online">
          <div className="w-12 rounded-full">
            <img src={Data.Image} />
          </div>
        </div>
        <div className="ml-5 w-3/4 text-white">{Data.Username}</div>

        <div className="w-fit">
          <FontAwesomeIcon icon={faMessage} className="h-6 w-6 text-white" />
        </div>
      </div>
      <hr className="mt-2 mb-2 opacity-75" />
    </>
  );
}

export default ChatsPersons;
