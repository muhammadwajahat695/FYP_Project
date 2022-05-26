import React from "react";
import "./../../css/MainMenu.css";
import { NavLink } from "react-router-dom";

const BatchAdvisorMainMenu = () => {
  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
      textDecoration: isActive ? "none" : "none",
      color: isActive ? "rgb(235, 141, 0)" : "black",
    };
  };
  return (
    <div className="mainmenudiv">
      <nav>
        <NavLink
          to="/PendingRequests"
          className="BAmenusNavLink"
          style={navLinkStyles}
        >
          <h3 className="BAmenus">Pending Requests</h3>
        </NavLink>
        <NavLink
          to="/ApprovedRequests"
          className="BAmenusNavLink"
          style={navLinkStyles}
        >
          <h3 className="BAmenus">Approved Requests</h3>
        </NavLink>
        <NavLink
          to="/Timetable"
          className="BAmenusNavLink"
          style={navLinkStyles}
        >
          <h3 className="BAmenus">Timetable</h3>
        </NavLink>
        <NavLink
          to="/BatchAdvisorOfficeHours"
          className="BAmenusNavLink"
          style={navLinkStyles}
        >
          <h3 className="BAmenus">Office Hours</h3>
        </NavLink>
        <NavLink
          to="/StudentsInformation"
          className="BAmenusNavLink"
          style={navLinkStyles}
        >
          <h3 className="BAmenus">My Batch Students</h3>
        </NavLink>
        <NavLink
          to="/BatchAdvisorMailBox"
          className="BAmenusNavLink"
          style={navLinkStyles}
        >
          <h3 className="BAmailboxmenu">Query Box</h3>
        </NavLink>
      </nav>
    </div>
  );
};

export default BatchAdvisorMainMenu;
