import React from "react";
import SP21B from "./SP21_BCS_B.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/Timetable.css";

const SP21_BCS_B = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={SP21B} alt="" />
      </Zoom>
    </div>
  );
};

export default SP21_BCS_B;
