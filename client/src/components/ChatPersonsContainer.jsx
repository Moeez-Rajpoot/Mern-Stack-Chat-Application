import React, { useState, useEffect } from 'react';
import ChatsPersons from './ChatsPersons';
import { useSelector } from 'react-redux';
import { LogOutState } from '../Redux/Reducers/Loginstate';
import { clearUserData } from '../Redux/Reducers/UserData';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ChatPersonsContainer({ setChatPerson }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const AccessToken = useSelector((state) => state.UserData.userData);
  const [activeIndex, setActiveIndex] = useState(null);
  const [users, setUsers] = useState([]);

  const handleLogOut = () => {
    dispatch(clearUserData());
    dispatch(LogOutState());
    navigate("/");
  };

  useEffect(() => {
    const FetchUsers = async () => {
      try {
        const accessToken = AccessToken.accesstoken; 
        console.log(accessToken);
        const response = await fetch('http://localhost:3000/api/auth/getallusers', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        setUsers(data);
      } catch (error) {
        console.log('Error:', error);
      }
    };
    FetchUsers();
  }, [AccessToken]);

  const handleSetActive = (index) => {
    setActiveIndex(index);
  };

  return (
    <>
      <div className='px-2 mt-2 w-[96%] h-[72%] hide-scrollbar rounded-lg py-2 flex flex-col mx-auto overflow-scroll'>
        {users.map((user) => (
          <ChatsPersons
            key={user._id}
            setChatPerson={setChatPerson}
            Data={user}
            isActive={activeIndex === user._id}
            setIsActive={() => handleSetActive(user._id)} 
          />
        ))}
      </div>
      <button onClick={handleLogOut} className="flex w-[90%] mx-auto btn btn-outline btn-error mt-2">Log Out</button>
    </>
  );
}

export default ChatPersonsContainer;