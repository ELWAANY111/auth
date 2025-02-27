
import React, { useState } from "react";
import SignupForm from "./Sign-Up";  // Import your signup form
import LoginForm from "./login";    // Import your login form

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track if the user is logged in
    const [showSignup, setShowSignup] = useState(true);    // Track whether to show the sign-up form or login form
    const [message, setMessage] = useState(""); // Handle messages

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);  // When the user logs in, change the state
    };

    const handleLogout = () => {
        setIsLoggedIn(false);  // When the user logs out, change the state
    };

    const toggleForm = () => {
        setShowSignup(!showSignup); // Toggle between Sign Up and Login forms
    };

    return (
        <div>
            <h1>My Application</h1>

            {/* If user is logged in, show a logout button */}
            {isLoggedIn ? (
                <div>
                    <p>Welcome back!</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <h2>{isLoggedIn ? "Welcome" : "Please log in or sign up"}</h2>

                    {/* Toggle between Sign Up and Login forms */}
                    {showSignup ? (
                        <div>
                            <SignupForm />
                            <p>Already have an account? <button onClick={toggleForm}>Login</button></p>
                        </div>
                    ) : (
                        <div>
                            <LoginForm onLoginSuccess={handleLoginSuccess} />
                            <p>Don't have an account? <button onClick={toggleForm}>Sign Up</button></p>
                        </div>
                    )}
                </div>
            )}

            {message && <p>{message}</p>}
        </div>
    );
};
export default App;