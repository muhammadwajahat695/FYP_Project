import React from "react";
import SP19B from "./SP19_BCS_B.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/Timetable.css";

const SP19_BCS_B = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={SP19B} alt="" />
      </Zoom>
    </div>
  );
};

export default SP19_BCS_B;
