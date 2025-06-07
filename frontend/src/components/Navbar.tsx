import React from "react";
import "./Navbar.css";
import Profile from "./Profile";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="brand">ToDoList</div>
      <Profile></Profile>
    </nav>
  );
};

export default Navbar;
