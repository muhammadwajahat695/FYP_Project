import React from "react";
import SP20B from "./SP20_BCS_B.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/Timetable.css";

const SP20_BCS_B = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={SP20B} alt="" />
      </Zoom>
    </div>
  );
};

export default SP20_BCS_B;
