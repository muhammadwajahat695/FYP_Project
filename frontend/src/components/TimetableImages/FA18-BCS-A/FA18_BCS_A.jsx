import React from "react";
import FA18A from "./FA18_BCS_A.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/Timetable.css";

const FA18_BCS_A = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={FA18A} alt="" />
      </Zoom>
    </div>
  );
};

export default FA18_BCS_A;
