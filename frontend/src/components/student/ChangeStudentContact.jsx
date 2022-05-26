import React from "react";
import "./../../css/ChangeStudentContact.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
const ChangeStudentContact = (props) => {
  return props.trigger ? (
    <div className="popupbg">
      <div className="popup">
        <FontAwesomeIcon
          icon={faTimesCircle}
          className="close-btn"
          onClick={() => props.setTrigger(false)}
        />
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
};

export default ChangeStudentContact;