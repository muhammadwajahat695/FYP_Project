import React from "react";
import FA20A from "./FA20_BCS_A.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/Timetable.css";

const FA20_BCS_A = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={FA20A} alt="" />
      </Zoom>
    </div>
  );
};

export default FA20_BCS_A;
