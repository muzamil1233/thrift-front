import React, { useState } from "react";
import "./Sidebar.css";
import {
  FaHome,
  FaTshirt,
  FaUsers,
  FaCog,
  FaBars,
  FaChevronRight,
  FaChevronLeft,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };
 

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/home" },
    { name: "Clothes", icon: <FaTshirt />, path: "/category/All" },
   { name: "Users", icon: <FaUsers />, path: "/profile" },
   { name: "Sign Out", icon: <FaSignOutAlt />, path: "/login" },
  ];

  return (
    <>
      {/* Mobile floating toggle button */}
      <div className="mobile-sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </div>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>}

      <div className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isOpen ? "open" : ""}`}>
        <div className="top-section">
          <h2 className="logo">
            {(!isCollapsed || window.innerWidth <= 768) && "MyApp"}
          </h2>

          <FaBars className="toggle-btn" onClick={toggleSidebar} />
        </div>

        <ul className="menu">
          {menuItems.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                navigate(item.path);
                if (window.innerWidth <= 768) setIsOpen(false);
              }}
              className="menu-item"
            >
              <span className="icon">{item.icon}</span>
              {(!isCollapsed || window.innerWidth <= 768) && (
                <span className="text">{item.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
