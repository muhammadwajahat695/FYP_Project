import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import "./../../css/DropReasonPopup.css";
import "./../../css/AddCourse.css";

const DeleteMessagePopup = (props) => {
  return props.trigger ? (
    <div className="popupbg">
      <div className="AddCourseMainPopup">
        <FontAwesomeIcon
          icon={faTimesCircle}
          className="closebutton"
          onClick={() => props.setTrigger(false)}
        />
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
};

export default DeleteMessagePopup;
