import React from "react";
import "../style/Header.css";

const Header = ({ page, setPage, handleLogout }) => {

  return (
    <header className="header">
      <nav>
        <div onClick={() => setPage("home")}>Home</div>
        <div onClick={() => setPage("notes")}>Notes</div>
        <div onClick={() => setPage("groups")}>Groups</div>
        <div onClick={() => setPage("subjects")}>Subjects</div>
      </nav>
      <button
        onClick={handleLogout}
        className="logout-button"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
