import React from "react";
import SP22B from "./SP22_BCS_B.png";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const SP22_BCS_B = () => {
  return (
    <div>
      <Zoom>
        <img className="imageheight" src={SP22B} alt="" />
      </Zoom>
    </div>
  );
};

export default SP22_BCS_B;
