import React from "react";
import FA19B from "./FA19_BCS_B.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/Timetable.css";

const FA19_BCS_B = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={FA19B} alt="" />
      </Zoom>
    </div>
  );
};

export default FA19_BCS_B;
