import React from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import viewpaper from "./../../icons/viewpaper.png";
import uploadpaper from "./../../icons/uploadpaper.png";

import { Link } from "react-router-dom";
import "./../../css/PastPapers.css";
const PastPapers = () => {
  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="pastpapersdiv">
        <h2 className="pastpaperstitle">Past Papers</h2>
      </div>
      <Link to="/ViewPastPapers">
        <div className="viewdiv">
          <img className="LPicon" src={viewpaper} alt="" />
          <h2 className="student">View Past Papers</h2>
        </div>
      </Link>
      <Link to="/UploadPastPapers">
        <div className="uploaddiv">
          <img className="LPicon" src={uploadpaper} alt="" />
          <h2 className="student">Upload Past Papers</h2>
        </div>
      </Link>
      <Footer />
    </div>
  );
};

export default PastPapers;
