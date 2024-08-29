import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignupForm from './components/signUp';
import Dashboard from './components/Dashboard';
import { useSelector } from 'react-redux';

function App() {
  const user = useSelector((state) => state.Login.value);
  
  useEffect(() => {
    console.log("User", user);
  }, [user]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupForm / >} />
        <Route path="/dashboard" element={user ? <Dashboard/> : <Navigate replace to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;