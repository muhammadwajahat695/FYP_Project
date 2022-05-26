import React from "react";
import SD from "./SoftwareDevelopment.png";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/DegreePlanner.css";

const SoftwareDevelopment = () => {
  return (
    <div>
      <img className="trackImg" src={SD} alt="" />
    </div>
  );
};

export default SoftwareDevelopment;
