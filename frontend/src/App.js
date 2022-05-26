import React from "react";
import StudentLogin from "./components/student/StudentLogin";
import ResetPassword from "./components/student/ResetPassword";
import AddCourse from "./components/student/AddCourse";
import Home from "./components/student/Home";
import FreezeSemester from "./components/student/FreezeSemester";
import StudentProfile from "./components/student/StudentProfile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MailBox from "./components/student/MailBox";
import OfficeHours from "./components/student/OfficeHours";
import PastPapers from "./components/student/PastPapers";
import GuidanceBox from "./components/student/GuidanceBox";
import DegreePlanner from "./components/student/DegreePlanner";
import DropForm from "./components/batchAdvisor/DropForm";
import RepeatCourse from "./components/student/RepeatCourse";
import BatchAdvisorLogin from "./components/batchAdvisor/BatchAdvisorLogin";
import BatchAdvisorResetPassword from "./components/batchAdvisor/BatchAdvisorResetPassword";
import LandingPage from "./components/LandingPage";
import BatchAdvisorProfile from "./components/batchAdvisor/BatchAdvisorProfile";
import PendingRequests from "./components/batchAdvisor/PendingRequests";
import Timetable from "./components/batchAdvisor/Timetable";
import BatchAdvisorOfficeHours from "./components/batchAdvisor/BatchAdvisorOfficeHours";
import StudentsInformation from "./components/batchAdvisor/StudentsInformation";
import QueryThread from "./components/student/QueryThread";
import BatchAdvisorMailBox from "./components/batchAdvisor/BatchAdvisorMailBox";
import BatchAdvisorQueryThread from "./components/batchAdvisor/BatchAdvisorQueryThread";
import ChangeStudentPassword from "./components/student/ChangeStudentPassword";
import AddForm from "./components/batchAdvisor/AddForm";
import ChangeBatchAdvisorPassword from "./components/batchAdvisor/ChangeBatchAdvisorPassword";
import NewMessage from "./components/student/NewMessage";
import NeedGuidance from "./components/student/NeedGuidance";
import WantToGuide from "./components/student/WantToGuide";
import ViewPastPapers from "./components/student/ViewPastPapers";
import UploadPastPapers from "./components/student/UploadPastPapers";
import FreezeSemesterForm from "./components/batchAdvisor/FreezeSemesterForm";
import NewStudentPassword from "./components/student/NewStudentPassword";
import NewBatchAdvisorPassword from "./components/batchAdvisor/NewBatchAdvisorPassword";
import StudentTranscript from "./components/batchAdvisor/StudentTranscript";
import ApprovedRequests from "./components/batchAdvisor/ApprovedRequests";
import PretestInstructions from "./components/student/PretestInstructions";
import PretestQuestions from "./components/student/PretestQuestions";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" exact element={<LandingPage />} />{" "}
          <Route path="/StudentLogin" element={<StudentLogin />} />{" "}
          <Route path="/Home" element={<Home />} />{" "}
          <Route path="/ResetPassword" element={<ResetPassword />} />{" "}
          <Route
            path="/NewStudentPassword/:token"
            element={<NewStudentPassword />}
          />{" "}
          <Route path="/AddCourse" element={<AddCourse />} />{" "}
          <Route path="/FreezeSemester" element={<FreezeSemester />} />{" "}
          <Route path="/RepeatCourse" element={<RepeatCourse />} />{" "}
          <Route path="/DegreePlanner" element={<DegreePlanner />} />{" "}
          <Route path="/GuidanceBox" element={<GuidanceBox />} />{" "}
          <Route path="/NeedGuidance" element={<NeedGuidance />} />{" "}
          <Route path="/WantToGuide" element={<WantToGuide />} />{" "}
          <Route path="/PastPapers" element={<PastPapers />} />{" "}
          <Route path="/ViewPastPapers" element={<ViewPastPapers />} />{" "}
          <Route path="/UploadPastPapers" element={<UploadPastPapers />} />{" "}
          <Route path="/QueryThread" element={<QueryThread />} />
          <Route path="/OfficeHours" element={<OfficeHours />} />{" "}
          <Route path="/MailBox" element={<MailBox />} />{" "}
          <Route path="/NewMessage" element={<NewMessage />} />{" "}
          <Route path="/StudentProfile" element={<StudentProfile />} />{" "}
          <Route
            path="/ChangeStudentPassword"
            element={<ChangeStudentPassword />}
          />{" "}
          <Route path="/BatchAdvisorLogin" element={<BatchAdvisorLogin />} />{" "}
          <Route
            path="/BatchAdvisorResetPassword"
            element={<BatchAdvisorResetPassword />}
          />{" "}
          <Route
            path="/NewBatchAdvisorPassword/:token"
            element={<NewBatchAdvisorPassword />}
          />{" "}
          <Route
            path="/BatchAdvisorProfile"
            element={<BatchAdvisorProfile />}
          />{" "}
          <Route
            path="/ChangeBatchAdvisorPassword"
            element={<ChangeBatchAdvisorPassword />}
          />{" "}
          <Route path="/PendingRequests" element={<PendingRequests />} />{" "}
          <Route
            path="/ApprovedRequests"
            element={<ApprovedRequests />}
          ></Route>
          <Route path="/AddForm" element={<AddForm />} />
          <Route path="/DropForm" element={<DropForm />} />
          <Route path="/Timetable" element={<Timetable />} />{" "}
          <Route
            path="/BatchAdvisorOfficeHours"
            element={<BatchAdvisorOfficeHours />}
          />{" "}
          <Route
            path="/StudentsInformation"
            element={<StudentsInformation />}
          />{" "}
          <Route
            path="/BatchAdvisorMailBox"
            element={<BatchAdvisorMailBox />}
          />{" "}
          <Route path="/FreezeSemesterForm" element={<FreezeSemesterForm />} />
          <Route path="/StudentTranscript" element={<StudentTranscript />} />
          <Route
            path="/BatchAdvisorQueryThread"
            element={<BatchAdvisorQueryThread />}
          />
          <Route
            path="/PretestInstructions"
            element={<PretestInstructions />}
          />
          <Route path="/PretestQuestions" element={<PretestQuestions />} />
        </Routes>{" "}
      </div>{" "}
    </Router>
  );
}

export default App;
