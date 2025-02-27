
import React, { useState } from "react";

const SignupForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();

        const userData = { email, password };
        try {
            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify(userData),
                credentials: "include",
            });
            const data = await response.json();

            if (response.ok) {
                setMessage("Sign-up successful! Please log in.");
            } else {
                setMessage(data.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            setMessage("Error during signup. Please try again.");
        }
    };


    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default SignupForm;