import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "../Header/Topbar";
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // mobile sidebar state

  return (
    <div className="layout">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className={`layout-main ${isCollapsed ? "collapsed" : ""}`}>
        <Topbar setIsOpen={setIsOpen} />
        <div className="layout-content" style = {{
          
        }}>{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
