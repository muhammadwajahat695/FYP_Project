import React from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import needGuidance from "./../../icons/needGuidance.png";
import wanttoGuide from "./../../icons/wanttoGuide.png";
import { Link } from "react-router-dom";
import "./../../css/GuidanceBox.css";
const GuidanceBox = () => {
  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">Guidance Box</h2>
      </div>
      <Link to="/NeedGuidance">
        <div className="needguidancediv">
          <img className="LPicon" src={needGuidance} alt="" />
          <h2 className="student">Need Guidance</h2>
        </div>
      </Link>
      <Link to="/WantToGuide">
        <div className="wanttoguidediv">
          <img className="LPicon" src={wanttoGuide} alt="" />
          <h2 className="student">Want to Guide?</h2>
        </div>
      </Link>
      <Footer />
    </div>
  );
};

export default GuidanceBox;
