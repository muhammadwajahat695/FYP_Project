import React from "react";
import SP21A from "./SP21_BCS_A.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/Timetable.css";

const SP21_BCS_A = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={SP21A} alt="" />
      </Zoom>
    </div>
  );
};

export default SP21_BCS_A;
