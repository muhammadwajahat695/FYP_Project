import React from "react";
import FA21B from "./FA21_BCS_B.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/Timetable.css";

const FA21_BCS_B = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={FA21B} alt="" />
      </Zoom>
    </div>
  );
};

export default FA21_BCS_B;
