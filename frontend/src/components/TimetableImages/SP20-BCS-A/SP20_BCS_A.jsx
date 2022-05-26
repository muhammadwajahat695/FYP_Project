import React from "react";
import SP20A from "./SP20_BCS_A.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/Timetable.css";

const SP20_BCS_A = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={SP20A} alt="" />
      </Zoom>
    </div>
  );
};

export default SP20_BCS_A;
