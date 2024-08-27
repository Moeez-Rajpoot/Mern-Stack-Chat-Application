import React, {useState , useEffect} from 'react'
import Navbar from './navbar'




function Course() {
  const [currentUser, setCurrentUser] = useState([]);
  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem("Userdp")));
  })
;
  return (
    <div>
      <Navbar Profile={currentUser} />
      
    </div>
  )
}

export default Course
