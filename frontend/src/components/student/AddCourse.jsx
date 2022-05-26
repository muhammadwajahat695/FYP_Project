import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import MainMenu from "./MainMenu";
import TopMenu from "./TopMenu";
import "./../../css/AddCourse.css";
import deleteicon from "./../../icons/deleteicon.png";
import DeleteAddedCoursePopup from "./DeleteAddedCoursePopup";
import { Link } from "react-router-dom";

const AddCourse = () => {
  const [buttonPopup, setButtonPopup] = useState(false);
  //fetch credits hours
  const [creditHours, setCreditHours] = useState("");
  const getCreditsHour = async () => {
    try {
      const res = await fetch("/credit_hour", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      setCreditHours(data);
      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCreditsHour();
  }, []);
  //get all courses that student can add
  const [getCourses, setGetCourses] = useState([]);
  const getAddCourses = async () => {
    try {
      const res = await fetch("/courses_that_added", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      setGetCourses(data);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAddCourses();
  }, []);

  //course that student want to add
  const [addcourse, setAddcourse] = useState({
    courseName: "",
  });
  //Timetable clashes
  const [timetableClash, setTimetableClash] = useState([]);

  const TimeTableClash = async () => {
    try {
      const subject = addcourse;
      const res = await fetch(`/TimetableClashes/${subject}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      setTimetableClash(data);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (addcourse.courseName !== "") {
      TimeTableClash();
    }
  }, [addcourse]);
  //get all(sos or elective) courses to check what is coursecode and credits hours
  const [allCourses, setAllCourses] = useState([]);
  const getAllCourses = async () => {
    try {
      const res = await fetch("/AllCourses", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      // console.log(data);
      setAllCourses(data);
      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllCourses();
  }, []);
  //credit hours and course code of course that student want to add
  const [courseDetail, setCourseDetail] = useState({
    courseCode: "",
    credits: "",
    courseName: "",
  });
  if (addcourse !== "") {
    if (addcourse !== courseDetail.courseName) {
      for (let i = 0; i < allCourses.length; i++) {
        if (allCourses[i].courseName === addcourse) {
          let courseCode = allCourses[i].courseCode;
          let credits = allCourses[i].credits;
          let courseName = allCourses[i].courseName;
          setCourseDetail({ ...courseDetail, courseCode, credits, courseName });
        }
      }
    }
  }

  //store reason in usestate
  const [reasons, setReasons] = useState("");
  //store section in useState
  const [sections, setSections] = useState("");
  //onclick add button
  const add = async () => {
    try {
      // let credit = courseDetail.credits + creditHours;
      // if (credit <= 21) {
      if (
        addcourse !== "" &&
        courseDetail.courseCode !== "" &&
        reasons !== ""
      ) {
        const courseCode = courseDetail.courseCode;
        const courseName = courseDetail.courseName;
        const credits = courseDetail.credits;
        const section = sections;
        const reason = reasons;
        let preTest = "";
        let preReqCourse = "";
        for (let i = 0; i < allCourses.length; i++) {
          if (allCourses[i].courseCode === courseCode) {
            if (allCourses[i].prerequisite.length === 0) {
              preTest = "N/A";
              preReqCourse = "N/A";
            } else {
              preTest = "Available";
              for (let j = 0; j < allCourses[i].prerequisite.length; j++) {
                if (allCourses[i].prerequisite.length === 1) {
                  for (let k = 0; k < allCourses.length; k++) {
                    if (
                      allCourses[k].courseCode ===
                      allCourses[i].prerequisite[j].course
                    ) {
                      preReqCourse = allCourses[k].courseName;
                    }
                  }
                } else {
                  for (let k = 0; k < allCourses.length; k++) {
                    if (
                      allCourses[k].courseCode ===
                      allCourses[i].prerequisite[j].course
                    ) {
                      preReqCourse = allCourses[k].courseName;
                    }
                  }
                }
              }
            }
          }
        }
        // window.alert(preReqCourse);
        const res = await fetch("/AddpendingCourses", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseCode,
            courseName,
            section,
            credits,
            reason,
            preTest,
            preReqCourse,
          }),
        });
        const data = await res.json();
        if (data.status === 200) {
          Window.alert("data Added");
        } else {
          Window.alert("Not added");
        }
      }

      //  else {
      //   console.log("do not add");
      // }
    } catch (error) {
      console.log(error);
    }
  };
  //get all the pending courses
  const [detail, setDetail] = useState([]);
  const getPendingCourses = async () => {
    try {
      const res = await fetch("/AddCourses", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      setDetail(data);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPendingCourses();
  }, []);

  //click on delete button
  const dele1 = async (courseName) => {
    console.log(courseName);
    try {
      const res = await fetch(`/DeleteSpecificRecord/${courseName}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      if (res.status === 200 || data) {
        window.alert("deleted");
      } else {
        const error = new Error(res.error);
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [fileName, setFileName] = useState();
  const ChangeFile = (e) => {
    setFileName(e.target.files[0]);
  };
  const changeonClick = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fee", fileName);
    setFileName("");
    const res = await fetch("/submit_AddForm", {
      method: "POST",
      body: formData,
    });
    const data = res.json();
    console.log(data);
    if (!data || res.status === 400 || res.status === 500) {
      window.alert("request not submitted");
    } else {
      window.alert("uploaded");
    }
  };

  return (
    <div className="container">
      <TopMenu />
      <MainMenu />
      <div className="freezesemesterdiv">
        <h2 className="freezesemestertitle">Add Course</h2>
      </div>
      <div className="AddCourseFormContainer">
        <form action="">
          <h3 className="CreditHours">
            Current Credit Hours:
            <span className="credits">{creditHours}</span>
          </h3>
          <select
            className="CourseTitleandReasonInput"
            name="courseName"
            value={addcourse.courseName}
            onChange={(e) => setAddcourse(e.target.value)}
            id=""
            placeholder=""
            required
          >
            <option value="" disabled selected hidden>
              Course Title
            </option>
            {getCourses.length === 0 ? (
              <option>No course Available for add</option>
            ) : (
              getCourses.map((course) => <option>{course.courseName}</option>)
            )}
          </select>
          <input
            className="CourseCodeandCreditsInput"
            type="text"
            name="courseCode"
            value={courseDetail.courseCode}
            id=""
            placeholder="Course Code"
            readOnly
          />
          <input
            className="CourseCodeandCreditsInput"
            type="text"
            name="credits"
            value={courseDetail.credits}
            placeholder="Credits"
            readOnly
          />
          <select
            className="SectionInput"
            name="section"
            value={sections.section}
            onChange={(e) => setSections(e.target.value)}
            id=""
            placeholder=""
            required
          >
            <option value="" disabled selected hidden required>
              Concerned Section
            </option>
            {timetableClash.length === 0 ? (
              <option>clashes in all section</option>
            ) : (
              timetableClash.map((timtable) => <option>{timtable}</option>)
            )}
          </select>
          <textarea
            className="AddReasonInput"
            name="reason"
            value={reasons.reason}
            onChange={(e) => setReasons(e.target.value)}
            id=""
            cols="36.5"
            rows="3"
            placeholder="Enter Valid Reason"
            required
          ></textarea>
          {creditHours + courseDetail.credits <= 21 ? (
            <button className="Addbutton" onClick={add}>
              Add
            </button>
          ) : (
            <button className="Addbutton" disabled="true">
              Add
            </button>
          )}
        </form>
      </div>
      <div className="AddCourseTableContainer">
        {detail.length === 0 ? (
          ""
        ) : (
          <form action="">
            <table className="AddCourseTable">
              <tr>
                <th className="CourseCodeColumn">Course Code</th>
                <th className="CourseTitleColumn">Course Title</th>
                <th className="CreditsColumn">Credits</th>
                <th className="SectionColumn">Section</th>
                <th className="PrereqCourseColumn">Pre-req Course</th>
                <th className="PretestColumn">Pre-test</th>
                <th className="DeleteColumn">Delete</th>
              </tr>
              {detail.map((add) => (
                <tr>
                  <td className="CourseCodeColumn">{add.courseCode}</td>
                  <td className="CourseTitleColumn">{add.courseName}</td>
                  <td className="CreditsColumn">{add.credits}</td>
                  <td className="SectionColumn">{add.section}</td>
                  {/* {add.preReqCourse.map((cui) => ( */}
                  {/* <tr> */}
                  <td className="PrereqCourseColumn">{add.preReqCourse}</td>
                  {/* </tr> */}
                  {/* ))} */}
                  {add.preTest === "N/A" ? (
                    <td className="PretestColumn">{add.preTest}</td>
                  ) : add.preTest === "Available" ? (
                    <td className="PretestColumn">
                      <Link
                        to={"/PretestInstructions"}
                        state={add.preReqCourse}
                      >
                        {add.preTest}
                      </Link>
                    </td>
                  ) : (
                    <td className="PretestColumn">{add.preTest}</td>
                  )}
                  <td className="DeleteColumn">
                    <img
                      src={deleteicon}
                      alt=""
                      className="AddedCourseDelBtn"
                      onClick={
                        () => dele1(add.courseName)
                        // setButtonPopup(true)
                      }
                    />
                  </td>
                </tr>
              ))}
            </table>
            <br />
            <label className="FeeChallanLabel">
              Upload Copy of Paid Fee Challan:{" "}
            </label>
            <input
              type="file"
              id=""
              filename="fee"
              onChange={ChangeFile}
              accept="image/*"
              className="upload"
              required
            />
            <br />
            {detail.length === 1 && detail[0].preTest === "Available" ? (
              <button className="AddCourseSubmitButton">Submit</button>
            ) : detail.length === 2 &&
              (detail[0].preTest === "Available" ||
                detail[0].preTest === "Available") ? (
              <button className="AddCourseSubmitButton">Submit</button>
            ) : (
              <button className="AddCourseSubmitButton" onClick={changeonClick}>
                Submit
              </button>
            )}
          </form>
        )}
      </div>
      <DeleteAddedCoursePopup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <form action="">
          <h3 className="DeleteConfirmation">
            Are you sure you want to delete this course?
          </h3>
          <button className="DeleteAddedCourseButton ">Delete</button>
        </form>
      </DeleteAddedCoursePopup>
      <Footer />
    </div>
  );
};

export default AddCourse;
// import React, { useEffect, useState } from "react";
// import Footer from "./Footer";
// import MainMenu from "./MainMenu";
// import TopMenu from "./TopMenu";
// import "./../../css/AddCourse.css";
// import deleteicon from "./../../icons/deleteicon.png";
// import { Link } from "react-router-dom";
// // import DeleteAddedCoursePopup from "./DeleteAddedCoursePopup";

// const AddCourse = () => {
//   // const [buttonPopup, setButtonPopup] = useState(false);
//   const [addcourse, setAddcourse] = useState({
//     courseName: "",
//   });
//   let name, value;
//   const handleInputs = (e) => {
//     console.log(e);
//     name = e.target.name;
//     value = e.target.value;
//     setAddcourse({ ...addcourse, [name]: value });
//   };
//   //onclick on Add button
//   const [addcourses, setAddcourses] = useState([]);
//   const add = async (e) => {
//     e.preventDefault();
//     let j = "";
//     for (let i = 0; i < addcourses.length; i++) {
//       if (addcourses[i].courseName === addcourse.courseName) {
//         j = i;
//         window.alert("course already added");
//       }
//     }
//     if (j === "") {
//       setAddcourses([...addcourses, abc]);
//     }
//   };
//   //Delete Button
//   const delete1 = async (courseName) => {
//     for (let i = 0; i < addcourses.length; i++) {
//       if (addcourses[i].courseName === courseName) {
//         console.log("dsdsadsa", addcourses[i].courseName);
//         await addcourses.splice(i, 1);
//         setAddcourses([...addcourses]);
//       }
//     }
//   };
//   //Get all courses of SOS
//   // const [getCourses, setGetCourses] = useState([]);
//   // const S_get_Courses = async () => {
//   //   try {
//   //     const res = await fetch("/sos_courses", {
//   //       method: "GET",
//   //       headers: {
//   //         Accept: "application/json",
//   //         "Content-Type": "application/json",
//   //       },
//   //       credentials: "include",
//   //     });
//   //     const data = await res.json();
//   //     // console.log(data);
//   //     setGetCourses(data);
//   //     if (!res.status === 200) {
//   //       const error = new Error(res.error);
//   //       throw error;
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };
//   //get courses that student can add
//   const [courses, setcourses] = useState([]);
//   const S_courses = async () => {
//     try {
//       const res = await fetch("/courses_that_added", {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });
//       const data = await res.json();
//       console.log(data, "sadsadsa");
//       setcourses(data);
//       if (!res.status === 200) {
//         const error = new Error(res.error);
//         throw error;
//       }
//     } catch (error) {
//       console.log(error);
//       // navigate("/StudentLogin");
//     }
//   };
//   // all data of form
//   const [abc, setCredit] = useState({
//     credits: "",
//     courseCode: "",
//     courseName: "",
//     pretest: "",
//     Pre_req_Course: "",
//   });
//   // const [courseCode, setCourseCode] = useState("")
//   if (addcourse.courseName !== false) {
//     if (
//       abc.credits === false ||
//       abc.courseCode === false ||
//       abc.courseName !== addcourse.courseName
//     ) {
//       for (let i = 0; i < courses.length; i++) {
//         //   if (addcourse.courseName === courses[i].courseName) {
//         //     if (courses[i].prerequisite.length === 1) {
//         //       if (courses[i].prerequisite[0].course === "N/A") {
//         //         let Pretest = "N/A";
//         //         let Pre_req_Course = "N/A";
//         //         let credits = courses[i].credits;
//         //         let courseCode = courses[i].courseCode;
//         //         let courseName = courses[i].courseName;
//         //         setCredit({
//         //           ...abc,
//         //           credits,
//         //           courseCode,
//         //           courseName,
//         //           Pretest,
//         //           Pre_req_Course,
//         //         });
//         //       } else {
//         //         let Pre_req_Course = "";
//         //         for (let j = 0; j < getCourses.length; j++) {
//         //           if (
//         //             getCourses[j].courseCode === courses[i].prerequisite[0].course
//         //           ) {
//         //             Pre_req_Course = getCourses[j].courseName;
//         //           }
//         //           // console.log(Pre_req_Course, "fdhbdshbfdsbcbs");
//         //           let Pretest = "Available";
//         //           let credits = courses[i].credits;
//         //           let courseCode = courses[i].courseCode;
//         //           let courseName = courses[i].courseName;
//         //           setCredit({
//         //             ...abc,
//         //             credits,
//         //             courseCode,
//         //             courseName,
//         //             Pretest,
//         //             Pre_req_Course,
//         //           });
//         //         }
//         //       }
//         for (let j = 0; j < courses[i].prerequisite.length; j++) {
//           if (courses[i].prerequisite[j].course === "N/A") {
//             // }
//             if (
//               addcourse.courseName === "Introduction to ICT" ||
//               addcourse.courseName ===
//                 "English Comprehension and Composition" ||
//               addcourse.courseName === "Islamic Studies" ||
//               addcourse.courseName === "Calculus and Analytic Geometry" ||
//               addcourse.courseName === "Applied Physics for Engineers" ||
//               addcourse.courseName === "Discrete Structures" ||
//               addcourse.courseName === "Programming Fundamentals" ||
//               addcourse.courseName === "Professional Practices for IT" ||
//               addcourse.courseName === "Electricity, Magnetism and Optics" ||
//               addcourse.courseName === "Digital Logic Design" ||
//               addcourse.courseName === "Pakistan Studies" ||
//               addcourse.courseName === "Linear Algebra" ||
//               addcourse.courseName === "Statistics and Probability Theory" ||
//               addcourse.courseName === "Software Engineering Concepts" ||
//               addcourse.courseName ===
//                 "Data Communications and Computer Networks" ||
//               addcourse.courseName === "Human Computer Interaction" ||
//               addcourse.courseName === "Introduction to Management" ||
//               addcourse.courseName === "Introduction to Psychology"
//             ) {
//               let Pretest = "N/A";
//               let Pre_req_Course = "N/A";
//               let credits = courses[i].credits;
//               let courseCode = courses[i].courseCode;
//               let courseName = courses[i].courseName;
//               setCredit({
//                 ...abc,
//                 credits,
//                 courseCode,
//                 courseName,
//                 Pretest,
//                 Pre_req_Course,
//               });
//             } else {
//               let Pretest = "Available";
//               let Pre_req_Course = "";
//               let credits = courses[i].credits;
//               let courseCode = courses[i].courseCode;
//               let courseName = courses[i].courseName;
//               setCredit({
//                 ...abc,
//                 credits,
//                 courseCode,
//                 courseName,
//                 Pretest,
//                 Pre_req_Course,
//               });
//             }
//           }
//         }
//       }
//     }
//   }
//   useEffect(() => {
//     //we can not use async function in useEffect
//     S_courses();
//     // S_get_Courses();
//   }, []);

//   return (
//     <div className="container">
//       <TopMenu />
//       <MainMenu />
//       <div className="freezesemesterdiv">
//         <h2 className="freezesemestertitle">Add Course</h2>
//       </div>
//       <div className="AddCourseFormContainer">
//         <form action="">
//           <select
//             className="CourseTitleandReasonInput"
//             name="courseName"
//             value={addcourse.courseName}
//             onChange={handleInputs}
//             id=""
//             placeholder=""
//             required
//           >
//             <option value="" disabled selected hidden>
//               Course Title
//             </option>
//             {courses.map((course1) => (
//               <option>{course1.courseName}</option>
//             ))}
//             {/* <option>Human Computer Interaction</option>
//             <option>Game Development</option>
//             <option>Software Project Management</option>
//             <option>Compiler Construction</option> */}
//           </select>
//           <input
//             className="CourseCodeandCreditsInput"
//             type="text"
//             name="courseCode"
//             value={abc.courseCode}
//             onChange={handleInputs}
//             id=""
//             placeholder="Course Code"
//             readOnly
//           />
//           <input
//             className="CourseCodeandCreditsInput"
//             name="credits"
//             value={abc.credits}
//             onChange={handleInputs}
//             type="text"
//             placeholder="Credits"
//             readOnly
//           />
//           <select
//             className="CourseTitleandReasonInput"
//             name="section_to"
//             value={addcourse.section_to}
//             onChange={handleInputs}
//             id=""
//             placeholder=""
//             required
//           >
//             <option value="" disabled selected hidden required>
//               Concerned Section
//             </option>
//             <option>FA18-BCS-A</option>
//             <option>FA18-BCS-B</option>
//           </select>
//           <textarea
//             className="AddReasonInput"
//             name="reason"
//             value={addcourse.reason}
//             onChange={handleInputs}
//             id=""
//             cols="36.5"
//             rows="4"
//             placeholder="Enter Valid Reason"
//             required
//           ></textarea>
//           <button className="Addbutton" onClick={add}>
//             Add
//           </button>
//         </form>
//       </div>

//       <div className="AddCourseTableContainer">
//         {addcourses == false ? (
//           "no courses registered"
//         ) : (
//           <form action="">
//             <table className="AddCourseTable">
//               <tr>
//                 <th className="CourseCodeColumn">Course Code</th>
//                 <th className="CourseTitleColumn">Course Title</th>
//                 <th className="CreditsColumn">Credits</th>
//                 <th className="SectionColumn">Section</th>
//                 <th className="PrereqCourseColumn">Pre-req Course</th>
//                 <th className="PretestColumn">Pre-test</th>
//                 <th className="DeleteColumn">Delete</th>
//               </tr>
//               {addcourses.map((add) => (
//                 <tr>
//                   <td>{add.courseCode}</td>
//                   <td>{add.courseName}</td>
//                   <td>{add.credits}</td>
//                   <td>{add.section_to}</td>
//                   <td>{add.Pre_req_Course}</td>
//                   {add.Pretest === "N/A" ? (
//                     <td>{add.Pretest}</td>
//                   ) : (
//                     <td>
//                       <Link to="/PretestInstructions">{add.Pretest}</Link>
//                     </td>
//                   )}
//                   <td>
//                     <img
//                       src={deleteicon}
//                       alt=""
//                       className="AddedCourseDelBtn"
//                       onClick={
//                         () =>
//                           // {setButtonPopup(true);
//                           delete1(add.courseName)
//                         // }
//                       }
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </table>
//             <br />
//             <label className="FeeChallanLabel">Paid Fee Challan: </label>
//             <input type="file" name="" id="" accept="image/*" />
//             <br />
//             <button className="AddCourseSubmitButton">Submit</button>
//           </form>
//         )}
//       </div>

//       {/* <DeleteAddedCoursePopup trigger={buttonPopup} setTrigger={setButtonPopup}>
//         <form action="">
//           <h3 className="DeleteConfirmation">
//             Are you sure you want to delete this course?
//           </h3>
//           <button className="DeleteAddedCourseButton ">Delete</button>
//         </form>
//       </DeleteAddedCoursePopup> */}
//       <Footer />
//     </div>
//   );
// };
// export default AddCourse;
