import React from "react";
import SP22A from "./SP22_BCS_A.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./../../../css/Timetable.css";

const SP22_BCS_A = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={SP22A} alt="" />
      </Zoom>
    </div>
  );
};

export default SP22_BCS_A;
