import React from "react";
import DT from "./DatabaseTechnologies.png";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/DegreePlanner.css";

const DatabaseTechnologies = () => {
  return (
    <div>
      <img className="trackImg" src={DT} alt="" />
    </div>
  );
};

export default DatabaseTechnologies;
