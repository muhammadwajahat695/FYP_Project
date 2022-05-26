import React from "react";
import FA21A from "./FA21_BCS_A.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/Timetable.css";

const FA21_BCS_A = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={FA21A} alt="" />
      </Zoom>
    </div>
  );
};

export default FA21_BCS_A;
