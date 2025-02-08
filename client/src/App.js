import React, { useState, useEffect } from "react";
import api from "./api";
import LoginPage from "./components/Login";
import Groups from "./components/Groups";
import Notes from "./components/Notes";
import Subjects from "./components/Subjects";
import Header from "./components/Header"; 
import Home from "./components/Home";

const App = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState("home");
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get("/subjects"); 
        setSubjects(response.data);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };
    fetchSubjects();
  }, []);

  // Function to handle login
  const handleLogin = async (email, password) => {
    try {
      const response = await api.post("/users/login", { email, password });

      console.log("Login successful:", response.data); 

      if (response.data && response.data.user) {
        setUser(response.data.user); 
        setErrorMessage(""); 
      } else {
        setErrorMessage("User data not found in the response"); 
      }
    } catch (err) {
      console.log("Login failed:", err);
      setErrorMessage(err.response?.data?.message || "Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      window.location.reload();  
      await api.post("/users/logout");
      setUser(null); 
    } catch (err) {
      console.log("Logout failed:", err);
    }
  };

  let currentComponent = <Home></Home>;
  switch (page) {
    case "home":
      currentComponent = <Home></Home>;
      break;
    case "notes":
      currentComponent = <Notes subjects={subjects}></Notes>;
      break;
    case "groups":
      currentComponent = <Groups></Groups>;
      break;
    case "subjects":
      currentComponent = (
        <Subjects subjects={subjects} setSubjects={setSubjects}></Subjects>
      );
      break;

    default:
      currentComponent = (
        <LoginPage handleLogin={handleLogin} errorMessage={errorMessage} />
      );
      break;
  }
  
  if (!user) {
    return <LoginPage handleLogin={handleLogin} errorMessage={errorMessage} />;
  }
  return (
    <>
      <Header page={page} setPage={setPage} handleLogout={handleLogout}></Header>
      {currentComponent}
    </>
  );
}


export default App;
