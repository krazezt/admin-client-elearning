import React from "react";
import { Dropdown } from "../dropdown/Dropdown";
import { Link } from "react-router-dom";

import "./TopNav.css";
import { ThemeMenu } from "../theme/ThemeMenu";

export const TopNav = () => {
  const logout = () => {
    localStorage.removeItem("token-admin");
    window.location.reload();
  };

  return (
    <div className="topnav">
      <div className="topnav_search">
        <input type="text" name="" id="" placeholder="Search here..." />
        <i className="bx bx-search"></i>
      </div>
      <div className="topnav_right">
        <div className="topnav_right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
};
