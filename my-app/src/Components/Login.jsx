import React, { useState } from 'react';
import "./Login.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RiAdminFill } from "react-icons/ri";


function login() {

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [useMessage, setUseMessage] = useState("");
  const nevigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      if (!userName || !password) {
        setUseMessage("plz fill the feils !...");
        return;
      }

      const params = new URLSearchParams();
      params.append("userName", userName);
      params.append("password", password);

      const response = await axios.post(
        "http://localhost:8080/api/user/login",
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      alert("login successful!");
      nevigate("/home");

      // setUseMessage(response.data);

    } catch (error) {
      if (error.response && error.response.data) {
        setUseMessage(
          error.response.data.message || JSON.stringify(error.response.data)
        );
      } else {
        setUseMessage("Server error");
      }
      console.error(error);
    }
  };

  const goToRegister = () => {
    nevigate("/registration")
  };

  // const goToHome = () => {
  //   nevigate("/home")
  // };

  return (
    <>
      <div className="login">
  <div className="container">
    <div className="loginPanel">
      <h1><RiAdminFill size={35} /> Admin Panel</h1>
      <form onSubmit={handleLogin}>
        
        <div className="form-group">
          <input
            type="text"
            name="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <label>User Name</label>
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Password</label>
        </div>

        <button type="submit" className="login-btn">Login</button>
        <a href="/registration">Register</a>
      </form>

      {/* Display server message */}
      {useMessage && <h2>{useMessage}</h2>}
    </div>
  </div>
</div>


    </>
  )
}

export default login



