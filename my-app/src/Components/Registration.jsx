import React, { useState } from 'react';
import axios from "axios";
import "./Registration.css";
import { Navigate, useNavigate } from 'react-router-dom';
import { RiAdminFill } from "react-icons/ri";


function Registration() {

    const [userFullName, setUserFullName] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [contact, setContact] = useState("");
    const [useMessage, setUseMessage] = useState("");
    const nevigate = useNavigate()


    const handleRegister = async (e) => {
        e.preventDefault();
        try {

            if (!userFullName || !userAddress || !userEmail || !userName || !password || !contact) {
                setUseMessage("⚠️ Please fill in all fields.");
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
                setUseMessage("⚠️ Please enter a valid email.");
                return;
            }

            if (password.length < 6) {
                setUseMessage("⚠️ Password must be at least 6 characters.");
                return;
            }

            if (!/^\d{10}$/.test(contact)) {
                setUseMessage("⚠️ Contact must be a 10-digit number.");
                return;
            }
            const params = new URLSearchParams();
            params.append("userFullName", userFullName);
            params.append("userAddress", userAddress);
            params.append("userEmail", userEmail);
            params.append("userName", userName);
            params.append("password", password);
            params.append("contact", contact);

            const response = await axios.post(
                "http://localhost:8080/api/user/register",
                params, // send as form params
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                }
            );
            alert("Registration successful!");
            nevigate("/");
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

    // const goToLog = () => {
    //     nevigate("/login");
    // };

    return (
        <>
        <div className="sign_up">
        <div classNAme="container">  
        <div className="registerPanel">
            <h1><RiAdminFill size={35} />Registration Admin Panel</h1>
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <input type="text" value={userFullName} onChange={(e) => setUserFullName(e.target.value)}required />
                    <label>User Full Name</label>
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                        required
                    />
                    <label>User Address</label>
                </div>

                <div className="form-group">
                    <input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        required
                    />
                    <label>User Email</label>
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                    <label>User Name</label>
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label>Password</label>
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                    />
                    <label>Contact</label>
                </div>

                <button type="submit" className="register-btn" > Register</button>
                <a href="/">login</a>
            </form>

            {/* Display server message */}
            {useMessage && <h2>{useMessage}</h2>}
        </div>
        </div>
        </div>
        </>
    );
}

export default Registration;



