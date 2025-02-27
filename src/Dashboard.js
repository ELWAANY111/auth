import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);  // Store user info after login
  const navigate = useNavigate();  // Use the navigate function for routing

  useEffect(() => {
    // Check if the user is logged in by checking the session or token
    const checkUserLogin = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/check", {
          method: "GET",
          credentials: "include",  // Include cookies (sessions)
        });

        const data = await response.json();
        if (data.loggedIn) {
          setUser(data.user);  // Set the user info if logged in
        } else {
          navigate("/login");  // Redirect to login if not logged in
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        navigate("/login");  // Redirect to login if there's an error
      }
    };

    checkUserLogin();  // Run the check when the component mounts
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",  // Include cookies (sessions)
      });

      const data = await response.json();
      console.log(data.message);  // Log out message from the server
      navigate("/login");  // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
