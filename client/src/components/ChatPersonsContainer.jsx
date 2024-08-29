import React, { useState, useEffect } from 'react';
import ChatsPersons from './ChatsPersons';
import { useSelector, useDispatch } from 'react-redux';
import { LogOutState } from '../Redux/Reducers/Loginstate';
import { clearUserData } from '../Redux/Reducers/UserData';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

function ChatPersonsContainer({ setChatPerson }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const AccessToken = useSelector((state) => state.UserData.userData);
  const [activeIndex, setActiveIndex] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users

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
        setUsers(data); // Set users fetched from API
        setFilteredUsers(data); // Initialize filtered users with all users
      } catch (error) {
        console.log('Error:', error);
      }
    };
    FetchUsers();
  }, [AccessToken]);

  // Update filtered users when the search term changes
  useEffect(() => {
    const filtered = users.filter(user =>
      user.Username.toLowerCase().includes(searchTerm.toLowerCase()) // Assuming 'name' is a field in the user object
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSetActive = (index) => {
    setActiveIndex(index);
  };

  return (
    <>
      <SearchBar setSearchTerm={setSearchTerm} /> {/* Pass setSearchTerm to SearchBar */}
      <div className='px-2 mt-2 w-[96%] h-[72%] hide-scrollbar rounded-lg py-2 flex flex-col mx-auto overflow-scroll'>
        {filteredUsers.map((user) => (
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
