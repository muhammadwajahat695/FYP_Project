import React from "react";
import "./../../css/MainMenu.css";
import home from "./../../icons/home.png";
import addcourse from "./../../icons/addcourse.png";
import repeatcourse from "./../../icons/repeatcourse.png";
import freezesemester from "./../../icons/freezesemester.png";
import degreeplanner from "./../../icons/degreeplanner.png";
import guidancebox from "./../../icons/guidancebox.png";
import pastpapers from "./../../icons/pastpapers.png";
import officehours from "./../../icons/officehours.png";
import mailbox from "./../../icons/mailbox.png";
import { NavLink } from "react-router-dom";
const MainMenu = () => {
  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
    };
  };

  return (
    <div className="mainmenudiv">
      <nav>
        <NavLink to="/Home">
          <div className="homemenu" id="homeId">
            <img className="menuicon" src={home} alt="" />
            <NavLink to="/Home" className="menuname" style={navLinkStyles}>
              Home
            </NavLink>
          </div>
        </NavLink>

        <NavLink to="/AddCourse">
          <div className="addcoursemenu" id="addId">
            <img className="menuicon" src={addcourse} alt="" />
            <NavLink to="/AddCourse" className="menuname" style={navLinkStyles}>
              Add <br /> Course
            </NavLink>
          </div>
        </NavLink>
        <NavLink to="/RepeatCourse">
          <div className="repeatcoursemenu" id="repeatId">
            <img className="menuicon" src={repeatcourse} alt="" />
            <NavLink
              to="/RepeatCourse"
              className="menuname"
              style={navLinkStyles}
            >
              Repeat <br /> Course
            </NavLink>
          </div>
        </NavLink>
        <NavLink to="/FreezeSemester">
          <div className="freezesemestermenu">
            <img className="menuicon" src={freezesemester} alt="" />
            <NavLink
              to="/FreezeSemester"
              className="menuname"
              style={navLinkStyles}
            >
              Freeze <br /> Semester
            </NavLink>
          </div>
        </NavLink>
        <NavLink to="/DegreePlanner">
          <div className="degreeplannermenu">
            <img className="menuicon" src={degreeplanner} alt="" />
            <NavLink
              to="/DegreePlanner"
              className="menuname"
              style={navLinkStyles}
            >
              Degree <br /> Planner
            </NavLink>
          </div>
        </NavLink>
        <NavLink to="/GuidanceBox">
          <div className="guidanceboxmenu">
            <img className="menuicon" src={guidancebox} alt="" />
            <NavLink
              to="/GuidanceBox"
              className="menuname"
              style={navLinkStyles}
            >
              Guidance <br /> Box
            </NavLink>
          </div>
        </NavLink>
        <NavLink to="/PastPapers">
          <div className="pastpapersmenu">
            <img className="menuicon" src={pastpapers} alt="" />
            <NavLink
              to="/PastPapers"
              className="menuname"
              style={navLinkStyles}
            >
              Past <br /> Papers
            </NavLink>
          </div>
        </NavLink>
        <NavLink to="/OfficeHours">
          <div className="officehoursmenu">
            <img className="menuicon" src={officehours} alt="" />
            <NavLink
              to="/OfficeHours"
              className="menuname"
              style={navLinkStyles}
            >
              Office <br /> Hours
            </NavLink>
          </div>
        </NavLink>
        <NavLink to="/MailBox">
          <div className="mailboxmenu">
            <img className="menuicon" src={mailbox} alt="" />
            <NavLink to="/MailBox" className="menuname" style={navLinkStyles}>
              Query <br /> Box
            </NavLink>
          </div>
        </NavLink>
      </nav>
    </div>
  );
};

export default MainMenu;
