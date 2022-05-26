import React from "react";
import FA20B from "./FA20_BCS_B.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/Timetable.css";

const FA20_BCS_B = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={FA20B} alt="" />
      </Zoom>
    </div>
  );
};

export default FA20_BCS_B;
