import React from "react";
import FA19A from "./FA19_BCS_A.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/Timetable.css";

const FA19_BCS_A = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={FA19A} alt="" />
      </Zoom>
    </div>
  );
};

export default FA19_BCS_A;
