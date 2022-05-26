import React from "react";
import SP19A from "./SP19_BCS_A.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/Timetable.css";

const SP19_BCS_A = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={SP19A} alt="" />
      </Zoom>
    </div>
  );
};

export default SP19_BCS_A;
