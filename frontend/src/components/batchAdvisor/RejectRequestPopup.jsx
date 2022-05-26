import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "./../../css/AddCourse.css";

const RejectRequestPopup = (props) => {
  return props.trigger ? (
    <div className="popupbg">
      <div className="mainpopup">
        <FontAwesomeIcon
          icon={faTimesCircle}
          className="closebtn"
          onClick={() => props.setTrigger(false)}
        />
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
};

export default RejectRequestPopup;
