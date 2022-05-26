const express = require("express");
const router = express.Router();
require("../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); //generate unique token
const jwt = require("jsonwebtoken");
// const User = require("../models/users");
const Student = require("../models/StudentModel");
// const Batchadvisor = require("../models/batchadvisor");
const cloudinary = require("../utils/Clodinrary");
const upload1 = require("../utils/multer");
const BatchAdvisor = require("../models/BatchAdvisorModel");
const GuidanceBox = require("../models/guidance");
const Pastpaper = require("../models/pastpaper");
const OfficeHour = require("../models/officeHours");
const SOS = require("../models/Scheme_of_StudyModel");
const ElectiveCourse = require("../models/ElectiveCoursesmodel");
const PendingAddCourse = require("../models/pendingAddCourseModel");
const ApprovedRequest = require("../models/ApprovedRequest");
const Pretest = require("../models/PretestModel");
const Timetable = require("../models/timetable");
const CourseRequest = require("../models/DropCourse");
const S_ChatBox = require("../models/S_ChatBox");
const BA_ChatBox = require("../models/BA_ChatBox");
const FreezeSemester = require("../models/FreezeSemester");
const AddCourse = require("../models/Addcourse");
const S_authenticate = require("../middleware/S_authenticate");
const BA_authenticate = require("../middleware/BA_authenticate");
const sendEmail = require("../middleware/sendemail");
const multer = require("multer");
const nodemailer = require("nodemailer");
//Student registration
router.post("/S_registration", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(200).send(student);
  } catch (error) {
    console.log(error);
  }
});
//Batch Advisor registration
router.post("/BA_registration", async (req, res) => {
  try {
    const batchadvisor = await BatchAdvisor.create(req.body);
    res.status(200).send(batchadvisor);
  } catch (error) {
    console.log(error);
  }
});
//Student Login
router.post("/Studentlogin", async (req, res) => {
  try {
    const { batch, regNo, password } = req.body;
    //filled the filed or not
    if (!batch || !regNo || !password) {
      return res.status(400).json({ error: "filled the data" });
    }
    const registrationId = batch.concat("-BCS-", regNo);
    // console.log(registrationId);
    const Studentlogin = await Student.findOne({
      registrationId: registrationId,
    });
    if (Studentlogin) {
      //check password from database
      // console.log(Studentlogin)
      const ismatch = await bcrypt.compare(password, Studentlogin.password);
      if (!ismatch) {
        return res.status(400).json({ error: "incorrect password" });
      } else {
        //toekn
        const token = await Studentlogin.generateAuthToken();
        // console.log(token);
        //add cookies
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 2443000),
          httpOnly: true,
        });
        res.status(200).json({ message: "user signin successfully" });
      }
    } else {
      res.status(400).json({ error: "INCORRECT registration no" });
    }
  } catch (error) {
    console.log(error);
  }
});
//for batch advisor login
router.post("/BatchAdvisorlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    //filled the filed or not
    if (!email || !password) {
      return res.status(400).json({ error: "filled the data" });
    }
    const Batchadvisorlogin = await BatchAdvisor.findOne({ email: email });
    if (Batchadvisorlogin) {
      //check password from database
      const ismatch = await bcrypt.compare(
        password,
        Batchadvisorlogin.password
      );
      if (!ismatch) {
        return res.status(400).json({ error: "incorrect password" });
      } else {
        //toekn
        const token = await Batchadvisorlogin.generateAuthToken();
        // console.log(token);
        //add cookies
        res.cookie("Bjwtoken", token, {
          expires: new Date(Date.now() + 244300000),
          httpOnly: true,
        });
        res.status(200).json({ message: "user signin successfully" });
      }
    } else {
      res.status(400).json({ error: "INCORRECT Email" });
    }
  } catch (error) {
    console.log(error);
  }
});
// Student Profile
router.get("/Studentprofile", S_authenticate, async (req, res) => {
  console.log("Get Student profile data");
  res.status(200).send(req.rootuser);
});

//Batch Advisor profile
router.get("/BatchAdvisorprofile", BA_authenticate, async (req, res) => {
  console.log("Get the batch advisor profile data");
  res.status(200).send(req.rootuser);
});
//------------update password
//update student password
router.put("/S_updatepassword", S_authenticate, async (req, res) => {
  const { old_password, new_password, confirm_password } = req.body;
  if (!old_password || !new_password || !confirm_password) {
    return res.status(400).json({ error: "filled the data" });
  }
  const student = await Student.findById(req.rootuser);
  //  console.log("Refeded");
  const isMatched = await bcrypt.compare(old_password, student.password);
  //  console.log("dhgafvasd");
  if (!isMatched) {
    return res.status(400).json({ error: "Old password is not Correct" });
  } else if (new_password != confirm_password) {
    return res.status(400).json({ error: "confirm password does not match" });
  }
  student.password = new_password;
  await student.save();
  //  sendToken(user, 200, res)
  res.status(200).send("Password updated successfully");
});
//update password batch advisor
router.put("/BA_updatepassword", BA_authenticate, async (req, res) => {
  const { old_password, new_password, confirm_password } = req.body;
  if (!old_password || !new_password || !confirm_password) {
    return res.status(400).json({ error: "filled the data" });
  }
  const batchadvisor = await BatchAdvisor.findById(req.rootuser);
  //  console.log("Refeded");
  const isMatched = await bcrypt.compare(old_password, batchadvisor.password);
  //  console.log("dhgafvasd");
  if (!isMatched) {
    return res.status(400).json({ error: "Old password is not Correct" });
  } else if (new_password != confirm_password) {
    return res.status(400).json({ error: "confirm password does not match" });
  }
  batchadvisor.password = new_password;
  await batchadvisor.save();
  //  sendToken(user, 200, res)
  res.status(200).send("Password updated successfully");
});
//----------------------update contact number----------------
//update student contact number
router.put("/S_updatecontact", S_authenticate, async (req, res) => {
  const student = await Student.findById(req.rootuser);
  //  console.log("Refeded");
  try {
    student.contactNo = req.body.contactNo;
    await student.save();
    res.status(200).send("phone number updated successfully");
  } catch (error) {
    return res
      .status(400)
      .json({ error: "enter the number in correct format" });
  }
});
//update batch advisor contact number
router.put("/BA_updatecontact", BA_authenticate, async (req, res) => {
  const batchadvisor = await BatchAdvisor.findById(req.rootuser);
  // console.log("Refeded");
  try {
    batchadvisor.contactNo = req.body.contactNo;
    await batchadvisor.save();
    res.status(200).send("phone number updated successfully");
  } catch (error) {
    return res
      .status(400)
      .json({ error: "enter the number in correct format" });
  }
});
//////////////////////top menu////////////
//top menu of Student
router.get("/S_Topmenu", S_authenticate, async (req, res) => {
  console.log("get top menu");
  res.status(200).send(req.rootuser);
});
//topmenu of batchadvisor
router.get("/BA_Topmenu", BA_authenticate, async (req, res) => {
  console.log("get top menu");
  res.status(200).send(req.rootuser);
});
///////////////////////////////////logout////////////////////////////////
//student logout
router.get("/Studentlogout", S_authenticate, (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("user logout");
});
//BatchAdvisor logout
router.get("/Batchadvisorlogout", BA_authenticate, (req, res) => {
  res.clearCookie("Bjwtoken", { path: "/" });
  res.status(200).send("user logout");
});
//-------------------home student--------------------
router.get("/Home", S_authenticate, async (req, res) => {
  const studentdata = req.rootuser;
  const batch = studentdata.batch;
  if ("SP22" === batch) {
    res.status(200).send(req.rootuserSemester1);
  } else if ("FA21" === batch) {
    res.status(200).send(req.rootuserSemester2);
  } else if ("SP21" === batch) {
    res.status(200).send(req.rootuserSemester3);
  } else if ("FA20" === batch) {
    res.status(200).send(req.rootuserSemester4);
  } else if ("SP20" === batch) {
    res.status(200).send(req.rootuserSemester5);
  } else if ("FA19" === batch) {
    res.status(200).send(req.rootuserSemester6);
  } else if ("SP19" === batch) {
    res.status(200).send(req.rootuserSemester7);
  } else if ("FA18" === batch) {
    res.status(200).send(req.rootuserSemester8);
  } else if ("SP18" === batch) {
    res.status(200).send(req.rootuserSemester8);
  } else if ("FA17" === batch) {
    res.status(200).send(req.rootuserSemester9);
  } else if ("SP17" === batch) {
    res.status(200).send(req.rootuserSemester10);
  } else if ("FA16" === batch) {
    res.status(200).send(req.rootuserSemester11);
  } else if ("FA16" === batch) {
    res.status(200).send(req.rootuserSemester12);
  } else {
    res.status(200).send("error");
  }
});
//Guidance Box
//need guidance
router.get("/needguidance/:course", S_authenticate, async (req, res) => {
  try {
    const course = req.params.course;
    console.log(course);
    const data = await GuidanceBox.find({
      courses: { $elemMatch: { course: course } },
    });
    if (!data) {
      res.status(400).send("error");
    } else {
      console.log(data);
      res.status(200).send(data);
    }
  } catch (error) {
    console.log(error);
  }
});
//want to guide
router.post("/want-to-guide/:course", S_authenticate, async (req, res) => {
  try {
    const course = req.params.course;
    const user = req.rootuser;
    const registrationId = user.registrationId;
    const name = user.name;
    const email = user.email;
    const contactNo = "--";
    const box = await GuidanceBox.findOne({ registrationId });
    if (!box) {
      const guide = new GuidanceBox({ registrationId, name, email, contactNo });
      await guide.save();
      await guide.add(course);
      await guide.save();
      res.send(guide);
    } else {
      const array = box.courses.length;
      // console.log(array);
      if (array === 0) {
        await box.add(course);
        await box.save();
        res.send(box);
      } else if (array === 1) {
        if (box.courses[array - 1].course === course) {
          return res.status(400).send("already present");
        } else {
          await box.add(course);
          await box.save();
          res.send(box);
        }
      } else if (array == 2) {
        if (
          box.courses[array - 1].course === course ||
          box.courses[array - 2].course === course
        ) {
          return res.status(400).send("already present");
        } else {
          await box.add(course);
          await box.save();
          res.send(box);
        }
      } else {
        res.status(400).send("limit full");
      }
    }
  } catch (error) {
    console.log(error);
  }
});
//add phone number or not
router.post("/wantToGuide_contact/:add", S_authenticate, async (req, res) => {
  const checkbox = req.params.add;
  console.log(checkbox);
  try {
    if (checkbox === "true") {
      const user = req.rootuser;
      const contactNo = user.contactNo;
      const registrationId = user.registrationId;
      console.log(registrationId);
      const data = await GuidanceBox.findOne({ registrationId });
      if (!data) {
        res.status(400).send("first add some courses");
      } else {
        await data.Contact(contactNo);
        await data.save();
        res.send(data);
      }
    } else {
      const user = req.rootuser;
      const contactNo = user.contactNo;
      const registrationId = user.registrationId;
      const data = await GuidanceBox.findOne({ registrationId });
      if (!data) {
        res.status(400).send("not show contact number");
      } else {
        if (data.contactNo === contactNo) {
          console.log(data.contactNo);
          data.contactNo = "--";
          await data.save();
          res.status(200).send(data);
        }
      }
    }
  } catch (error) {
    res.status(400).send("error");
  }
});
//delete the course that added for guide
router.delete("/delete_course/:course", S_authenticate, async (req, res) => {
  try {
    const course = req.params.course;
    const user = req.rootuser;
    const registrationId = user.registrationId;
    const record = await GuidanceBox.findOne({
      registrationId,
    });
    if (!record) {
      res.send("no record");
    } else {
      for (var i = 0; i < record.courses.length; i++) {
        if (record.courses[i].course === course) {
          await record.courses.splice(i, 1);
          await record.save();
        }
      }
      if (record.courses.length === 0) {
        await record.delete();
      }
    }
  } catch (e) {
    res.send(e);
  }
});
//GET the data
router.get("/guide_courses", S_authenticate, async (req, res) => {
  const user = req.rootuser;
  const registrationId = user.registrationId;
  const box = await GuidanceBox.findOne({ registrationId });
  if (!box) {
    res.status(200).send("no record found");
  } else {
    res.send(box);
  }
});
//reset password email for student
router.post("/S_sendresetemail", async (req, res) => {
  try {
    const { email } = req.body;
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        console.log(err);
      } else {
        const token = buffer.toString("hex");
        const student = await Student.findOne({ email });
        if (!student) {
          return res.status(422).json({ error: "user does not found" });
        } else {
          student.resettoken = token;
          student.expiretoken = Date.now() + 3600000;
          await student.save({ validateBeforeSave: false });

          var transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL_USER,
              pass: "69a6d58a2bfe93",
            },
          });
          const mailOption = {
            to: student.email,
            from: "zeeshanshabbeer2425@gmail.com",
            subject: "reset password link",
            html: `
                         <div
                           style="
                             text-align: center;
                             background-color: rgb(255, 193, 122);
                             margin-left: 00px;
                             margin-right: 00px;
                             padding-top: 1px;
                             padding-bottom: 70px;
                           "
                         >
                           <h2>Tipster</h2>
                           <h4 style="margin-top: -20px">A Digital Batch Advisor</h4>
                           <div>
                             <div
                               style="
                                 background-color: rgb(255, 255, 255);
                                 margin-left: 30px;
                                 margin-right: 30px;
                                 padding-top: 30px;
                                 padding-bottom: 30px;
                                 border-radius: 5px;
                               "
                             >
                               <form action="">
                                 <h3 style="display: inline">Hello</h3>
                                 <h3 style="display: inline">${student.name},</h3>
                                 <h2>Forgot your password?</h2>
                                 <p style="font-size: 18px; padding-top: 10px">
                                   That's okay, it happens! Click on the button <br />below to reset
                                   your password.
                                 </p>
                                 <button
                                   style="
                                     background-color: rgb(0, 30, 129);
                                     padding: 10px 10px 10px 10px;
                                     border: none;
                                     border-radius: 5px;
                                     font-weight: bold;
                                     margin-top: 10px;
                                     color: white;
                                   "
                                 ><a href="http://localhost:3000/NewStudentPassword/${token}">
                                   RESET YOUR PASSWORD
                                 </button>
                                 <h4 style="margin-top: 40px; font-size: 15px">Regards,</h4>
                                 <h4 style="margin-top: -20px; font-size: 15px">The Tipster Team</h4>
                               </form>
                             </div>
                           </div>
                         </div>
                                          
                     `,
          };
          await transport.sendMail(mailOption);
          res.status(200).send("Email Send successfully");
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});
//reset password email for batchadvisor
router.post("/BA_sendresetemail", async (req, res) => {
  try {
    const { email } = req.body;
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        console.log(err);
      } else {
        const token = buffer.toString("hex");
        const batchadvisor = await BatchAdvisor.findOne({ email });
        if (!batchadvisor) {
          return res.status(422).json({ error: "user does not found" });
        } else {
          batchadvisor.resettoken = token;
          batchadvisor.expiretoken = Date.now() + 3600000;
          await batchadvisor.save({ validateBeforeSave: false });

          var transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
              user: process.env.EMAIL_USER,
              pass: "69a6d58a2bfe93",
            },
          });

          //  console.log(batchadvisor);
          const mailOption = {
            to: batchadvisor.email,
            from: "zeeshanshabbeer2425@gmail.com",
            subject: "reset password link",
            html: `
                         <div
                           style="
                             text-align: center;
                             background-color: rgb(255, 193, 122);
                             margin-left: 00px;
                             margin-right: 00px;
                             padding-top: 1px;
                             padding-bottom: 70px;
                           "
                         >
                           <h2>Tipster</h2>
                           <h4 style="margin-top: -20px">A Digital Batch Advisor</h4>
                           <div>
                             <div
                               style="
                                 background-color: rgb(255, 255, 255);
                                 margin-left: 30px;
                                 margin-right: 30px;
                                 padding-top: 30px;
                                 padding-bottom: 30px;
                                 border-radius: 5px;
                               "
                             >
                               <form action="">
                                 <h3 style="display: inline">Hello</h3>
                                 <h3 style="display: inline">${batchadvisor.name},</h3>
                                 <h2>Forgot your password?</h2>
                                 <p style="font-size: 18px; padding-top: 10px">
                                   That's okay, it happens! Click on the button <br />below to reset
                                   your password.
                                 </p>
                                 <button
                                   style="
                                     background-color: rgb(0, 30, 129);
                                     padding: 10px 10px 10px 10px;
                                     border: none;
                                     border-radius: 5px;
                                     font-weight: bold;
                                     margin-top: 10px;
                                     color: white;
                                   "
                                 ><a href="http://localhost:3000/NewBatchAdvisorPassword/${token}">
                                   RESET YOUR PASSWORD
                                 </button>
                                 <h4 style="margin-top: 40px; font-size: 15px">Regards,</h4>
                                 <h4 style="margin-top: -20px; font-size: 15px">The Tipster Team</h4>
                               </form>
                             </div>
                           </div>
                         </div>
                                          
                     `,
          };
          await transport.sendMail(mailOption);
          res.status(200).send("email send successfully");
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});
//reset password for student
router.put("/S_resetpassword", async (req, res) => {
  try {
    const { new_password, confirm_password } = req.body;
    const sentToken = req.body.token;
    if (!new_password || !confirm_password) {
      return res.status(400).json({ error: "filled the data" });
    }
    if (new_password != confirm_password) {
      return res.status(400).json({ error: "confirm password does not match" });
    }
    // console.log(new_password);
    const student = await Student.findOne({
      resettoken: sentToken,
      expiretoken: { $gt: Date.now() },
    });
    //  console.log(user)
    if (!student) {
      res.status(422).json({ error: "token expire" });
    }
    //  const user = await User.findById(req.rootuser);
    //  console.log("Refeded");
    student.password = new_password;
    student.resettoken = undefined;
    student.expiretoken = undefined;
    await student.save();
    res.status(200).send("Password updated successfully");
  } catch (error) {
    console.log(error);
  }
});
//Drop course request
router.post("/dropCourse_Request", S_authenticate, async (req, res) => {
  const { reason, courseName } = req.body;
  try {
    const user = req.rootuser;
    const {
      name,
      email,
      contactNo,
      address,
      section,
      batch,
      semester,
      registrationId,
    } = user;
    const CGPA = user.Result[0].CGPA;
    if (semester === 1) {
      const record = req.rootuserSemester1;
      var cred = 0;
      for (var i = 0; i < record.length; i++) {
        console.log(i);
        if (record[i].status === "enrolled") {
          cred += record[i].credits;
        }
      }
      if (cred >= 15) {
        var abc = "";
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].courseName === courseName) {
            abc = i;
          }
        }
        const courseCode = record[abc].courseCode;
        const credits = record[abc].credits;
        user.Result[0].Semester1[abc].status = "Drop Pending";
        const box = await CourseRequest.findOne({ registrationId });
        if (!box) {
          const data = new CourseRequest({
            batch,
            registrationId,
            semester: semester,
            name: name,
            email: email,
            contactNo: contactNo,
            address: address,
            CGPA: CGPA,
            section: section,
          });
          await user.save();
          await data.save();
          await data.Courses1(courseCode, reason, courseName, credits);
          await data.save();
          res.send(data);
        } else {
          //check that already course will be added or  not
          var match = "";
          for (var i = 0; i < box.courses.length; i++) {
            console.log(i);
            if (box.courses[i].courseName === courseName) {
              match = i;
            }
          }
          if (match === "") {
            // console.log("first");
            await user.save();
            await box.Courses1(courseCode, reason, courseName, credits);
            await box.save();
            res.send(box);
          } else {
            console.log("first");
            res.status(400).send("this course request is already in pending");
          }
        }
      } else {
        res
          .status(400)
          .send(
            "First add some course and then drop ----your credits hours less"
          );
      }
    } else if (semester === 2) {
      const record = req.rootuserSemester2;
      var cred = 0;
      for (var i = 0; i < record.length; i++) {
        console.log(i);
        if (record[i].status === "enrolled") {
          cred += record[i].credits;
        }
      }
      //  console.log("first",cred)
      if (cred >= 15) {
        var abc = "";
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].courseName === courseName) {
            abc = i;
          }
        }
        const courseCode = record[abc].courseCode;
        const credits = record[abc].credits;
        user.Result[0].Semester2[abc].status = "Drop Pending";
        const box = await CourseRequest.findOne({ registrationId });
        if (!box) {
          const data = new CourseRequest({
            batch,
            registrationId,
            semester: semester,
            name: name,
            email: email,
            contactNo: contactNo,
            address: address,
            CGPA: CGPA,
            section: section,
          });
          await user.save();
          await data.save();
          await data.Courses1(courseCode, reason, courseName, credits);
          await data.save();
          res.send(data);
        } else {
          var match = "";
          for (var i = 0; i < box.courses.length; i++) {
            console.log(i);
            if (box.courses[i].courseName === courseName) {
              match = i;
            }
          }
          if (match === "") {
            console.log("first");
            await user.save();
            await box.Courses1(courseCode, reason, courseName, credits);
            await box.save();
            res.send(box);
          } else {
            console.log("first");
            res.status(400).send("this course request in pending");
          }
        }
      } else {
        res.status(400).send("First  add some course and then drop");
      }
    } else if (semester === 3) {
      const record = req.rootuserSemester3;
      var cred = 0;
      for (var i = 0; i < record.length; i++) {
        console.log(i);
        if (record[i].status === "enrolled") {
          cred += record[i].credits;
        }
      }
      //  console.log("first",cred)
      if (cred >= 15) {
        var abc = "";
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].courseName === courseName) {
            abc = i;
          }
        }
        const courseCode = record[abc].courseCode;
        const credits = record[abc].credits;
        user.Result[0].Semester3[abc].status = "Drop Pending";
        const box = await CourseRequest.findOne({ registrationId });
        if (!box) {
          const data = new CourseRequest({
            batch,
            registrationId,
            semester: semester,
            name: name,
            email: email,
            contactNo: contactNo,
            address: address,
            CGPA: CGPA,
            section: section,
          });
          await user.save();
          await data.save();
          await data.Courses1(courseCode, reason, courseName, credits);
          await data.save();
          res.send(data);
        } else {
          var match = "";
          for (var i = 0; i < box.courses.length; i++) {
            console.log(i);
            if (box.courses[i].courseName === courseName) {
              match = i;
            }
          }
          if (match === "") {
            console.log("first");
            await user.save();
            await box.Courses1(courseCode, reason, courseName, credits);
            await box.save();
            res.send(box);
          } else {
            console.log("first");
            res.status(400).send("this course request in pending");
          }
        }
      } else {
        res.status(400).send("First some course and then drop");
      }
    } else if (semester === 4) {
      const record = req.rootuserSemester4;
      var cred = 0;
      for (var i = 0; i < record.length; i++) {
        console.log(i);
        if (record[i].status === "enrolled") {
          cred += record[i].credits;
        }
      }
      //  console.log("first",cred)
      if (cred >= 15) {
        var abc = "";
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].courseName === courseName) {
            abc = i;
          }
        }
        const courseCode = record[abc].courseCode;
        const credits = record[abc].credits;
        user.Result[0].Semester4[abc].status = "Drop Pending";
        const box = await CourseRequest.findOne({ registrationId });
        if (!box) {
          const data = new CourseRequest({
            batch,
            registrationId,
            semester: semester,
            name: name,
            email: email,
            contactNo: contactNo,
            address: address,
            CGPA: CGPA,
            section: section,
          });
          await user.save();
          await data.save();
          await data.Courses1(courseCode, reason, courseName, credits);
          await data.save();
          res.send(data);
        } else {
          var match = "";
          for (var i = 0; i < box.courses.length; i++) {
            console.log(i);
            if (box.courses[i].courseName === courseName) {
              match = i;
            }
          }
          if (match === "") {
            console.log("first");
            await user.save();
            await box.Courses1(courseCode, reason, courseName, credits);
            await box.save();
            res.send(box);
          } else {
            console.log("first");
            res.status(400).send("this course request in pending");
          }
        }
      } else {
        res.status(400).send("First some course and then drop");
      }
    } else if (semester === 5) {
      const record = req.rootuserSemester5;
      var cred = 0;
      for (var i = 0; i < record.length; i++) {
        console.log(i);
        if (record[i].status === "enrolled") {
          cred += record[i].credits;
        }
      }
      //  console.log("first",cred)
      if (cred >= 15) {
        var abc = "";
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].courseName === courseName) {
            abc = i;
          }
        }
        const courseCode = record[abc].courseCode;
        const credits = record[abc].credits;
        user.Result[0].Semester5[abc].status = "Drop Pending";
        const box = await CourseRequest.findOne({ registrationId });
        if (!box) {
          const data = new CourseRequest({
            batch,
            registrationId,
            semester: semester,
            name: name,
            email: email,
            contactNo: contactNo,
            address: address,
            CGPA: CGPA,
            section: section,
          });
          await user.save();
          await data.save();
          await data.Courses1(courseCode, reason, courseName, credits);
          await data.save();
          res.send(data);
        } else {
          var match = "";
          for (var i = 0; i < box.courses.length; i++) {
            console.log(i);
            if (box.courses[i].courseName === courseName) {
              match = i;
            }
          }
          if (match === "") {
            console.log("first");
            await user.save();
            await box.Courses1(courseCode, reason, courseName, credits);
            await box.save();
            res.send(box);
          } else {
            console.log("first");
            res.status(400).send("this course request in pending");
          }
        }
      } else {
        res.status(400).send("First some course and then drop");
      }
    } else if (semester === 6) {
      const record = req.rootuserSemester6;
      var cred = 0;
      for (var i = 0; i < record.length; i++) {
        console.log(i);
        if (record[i].status === "enrolled") {
          cred += record[i].credits;
        }
      }
      //  console.log("first",cred)
      if (cred >= 15) {
        var abc = "";
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].courseName === courseName) {
            abc = i;
          }
        }
        const courseCode = record[abc].courseCode;
        const credits = record[abc].credits;
        user.Result[0].Semester6[abc].status = "Drop Pending";
        const box = await CourseRequest.findOne({ registrationId });
        if (!box) {
          const data = new CourseRequest({
            batch,
            registrationId,
            semester: semester,
            name: name,
            email: email,
            contactNo: contactNo,
            address: address,
            CGPA: CGPA,
            section: section,
          });
          await user.save();
          await data.save();
          await data.Courses1(courseCode, reason, courseName, credits);
          await data.save();
          res.send(data);
        } else {
          var match = "";
          for (var i = 0; i < box.courses.length; i++) {
            console.log(i);
            if (box.courses[i].courseName === courseName) {
              match = i;
            }
          }
          if (match === "") {
            console.log("first");
            await user.save();
            await box.Courses1(courseCode, reason, courseName, credits);
            await box.save();
            res.send(box);
          } else {
            console.log("first");
            res.status(400).send("this course request in pending");
          }
        }
      } else {
        res.status(400).send("First some course and then drop");
      }
    } else if (semester === 7) {
      const record = req.rootuserSemester7;
      var cred = 0;
      for (var i = 0; i < record.length; i++) {
        console.log(i);
        if (record[i].status === "enrolled") {
          cred += record[i].credits;
        }
      }
      //  console.log("first",cred)
      if (cred >= 15) {
        var abc = "";
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].courseName === courseName) {
            abc = i;
          }
        }
        const courseCode = record[abc].courseCode;
        const credits = record[abc].credits;
        user.Result[0].Semester7[abc].status = "Drop Pending";
        const box = await CourseRequest.findOne({ registrationId });
        if (!box) {
          const data = new CourseRequest({
            batch,
            registrationId,
            semester: semester,
            name: name,
            email: email,
            contactNo: contactNo,
            address: address,
            CGPA: CGPA,
            section: section,
          });
          await user.save();
          await data.save();
          await data.Courses1(courseCode, reason, courseName, credits);
          await data.save();
          res.send(data);
        } else {
          var match = "";
          for (var i = 0; i < box.courses.length; i++) {
            console.log(i);
            if (box.courses[i].courseName === courseName) {
              match = i;
            }
          }
          if (match === "") {
            console.log("first");
            await user.save();
            await box.Courses1(courseCode, reason, courseName, credits);
            await box.save();
            res.send(box);
          } else {
            console.log("first");
            res.status(400).send("this course request in pending");
          }
        }
      } else {
        res.status(400).send("First some course and then drop");
      }
    } else if (semester === 8) {
      const record = req.rootuserSemester8;
      var cred = 0;
      for (var i = 0; i < record.length; i++) {
        console.log(i);
        if (record[i].status === "enrolled") {
          cred += record[i].credits;
        }
      }
      if (cred >= 15) {
        var abc = "";
        for (var i = 0; i < record.length; i++) {
          console.log(i);
          if (record[i].courseName === courseName) {
            abc = i;
          }
        }
        const courseCode = record[abc].courseCode;
        const credits = record[abc].credits;
        user.Result[0].Semester8[abc].status = "Drop Pending";
        const box = await CourseRequest.findOne({ registrationId });
        if (!box) {
          const data = new CourseRequest({
            batch,
            registrationId,
            semester: semester,
            name: name,
            email: email,
            contactNo: contactNo,
            address: address,
            CGPA: CGPA,
            section: section,
          });
          await user.save();
          await data.save();
          await data.Courses1(courseCode, reason, courseName, credits);
          await data.save();
          res.send(data);
        } else {
          var match = "";
          for (var i = 0; i < box.courses.length; i++) {
            console.log(i);
            if (box.courses[i].courseName === courseName) {
              match = i;
            }
          }
          if (match === "") {
            await user.save();
            await box.Courses1(courseCode, reason, courseName, credits);
            await box.save();
            res.send(box);
          } else {
            console.log("first");
            res.status(400).send("this course request in pending");
          }
        }
      } else {
        res.status(400).send("First some course and then drop");
      }
    } else {
      res.status(400).send("error");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//----------------------home page  batch advisor------------------
//freeze requests
//drop pending request
//add pending requets
router.get("/Add_Drop_Freeze_pending", BA_authenticate, async (req, res) => {
  const batchadvisor = req.rootuser;
  const batch = batchadvisor.batch;
  const data1 = await FreezeSemester.find({ batch });
  const data2 = await AddCourse.find({ batch });
  const data3 = await CourseRequest.find({ batch });
  if (!data3 && !data1 && !data2) {
    res.status(400).send("no record found");
  } else {
    const data = data3.concat(data1, data2);
    res.status(200).send(data);
  }
});
//drop course form on ok
router.post("/dropcoursess_submit", async (req, res) => {
  const { registrationId } = req.body;
  console.log(registrationId);
  const data = await CourseRequest.findOne({ registrationId });
  if (!data) {
    res.status(400).send("no record found");
  } else {
    const data1 = await Student.findOne({ registrationId });

    if (data.semester === 1) {
      for (var i = 0; i < data1.Result[0].Semester1.length; i++) {
        if (data1.Result[0].Semester1[i].status === "Drop Pending") {
          const action = "Drop Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester1[i].courseName,
            courseCode: data1.Result[0].Semester1[i].courseCode,
            credits: data1.Result[0].Semester1[i].credits,
            section: data1.section,
            action: action,
            semester: data1.semester,
          });
          await record.save();
          await data1.Result[0].Semester1.splice(i, 1);
        }
        await data1.save();
        await data.delete();
        res.send("dleeted");
      }
    } else if (data.semester === 2) {
      for (var i = 0; i < data1.Result[0].Semester2.length; i++) {
        if (data1.Result[0].Semester2[i].status === "Drop Pending") {
          const action = "Drop Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester2[i].courseName,
            courseCode: data1.Result[0].Semester2[i].courseCode,
            credits: data1.Result[0].Semester2[i].credits,
            section: data1.section,
            action: action,
            semester: data1.semester,
          });
          await record.save();
          await data1.Result[0].Semester2.splice(i, 1);
        }
      }
      await data1.save();
      await data.delete();
      res.send("dleeted");
    } else if (data.semester === 3) {
      for (var i = 0; i < data1.Result[0].Semester3.length; i++) {
        if (data1.Result[0].Semester3[i].status === "Drop Pending") {
          const action = "Drop Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester3[i].courseName,
            courseCode: data1.Result[0].Semester3[i].courseCode,
            credits: data1.Result[0].Semester3[i].credits,
            section: data1.section,
            action: action,
            semester: data1.semester,
          });
          await record.save();
          await data1.Result[0].Semester3.splice(i, 1);
        }
      }
      await data1.save();
      await data.delete();
      res.send("dleeted");
    } else if (data.semester === 4) {
      for (var i = 0; i < data1.Result[0].Semester4.length; i++) {
        if (data1.Result[0].Semester4[i].status === "Drop Pending") {
          const action = "Drop Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester4[i].courseName,
            courseCode: data1.Result[0].Semester4[i].courseCode,
            credits: data1.Result[0].Semester4[i].credits,
            section: data1.section,
            action: action,
            semester: data1.semester,
          });
          await record.save();
          await data1.Result[0].Semester4.splice(i, 1);
        }
      }
      await data1.save();
      await data.delete();
      res.send("dleeted");
    } else if (data.semester === 5) {
      for (var i = 0; i < data1.Result[0].Semester5.length; i++) {
        if (data1.Result[0].Semester5[i].status === "Drop Pending") {
          const action = "Drop Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester5[i].courseName,
            courseCode: data1.Result[0].Semester5[i].courseCode,
            credits: data1.Result[0].Semester5[i].credits,
            section: data1.section,
            action: action,
            semester: data1.semester,
          });
          await record.save();
          await data1.Result[0].Semester5.splice(i, 1);
        }
      }
      await data1.save();
      await data.delete();
      res.send("dleeted");
    } else if (data.semester === 6) {
      for (var i = 0; i < data1.Result[0].Semester6.length; i++) {
        if (data1.Result[0].Semester6[i].status === "Drop Pending") {
          const action = "Drop Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester6[i].courseName,
            courseCode: data1.Result[0].Semester6[i].courseCode,
            credits: data1.Result[0].Semester6[i].credits,
            section: data1.section,
            action: action,
            semester: data1.semester,
          });
          await record.save();
          await data1.Result[0].Semester6.splice(i, 1);
        }
      }
      await data1.save();
      await data.delete();
      res.send("dleeted");
    } else if (data.semester === 7) {
      for (var i = 0; i < data1.Result[0].Semester7.length; i++) {
        if (data1.Result[0].Semester7[i].status === "Drop Pending") {
          const action = "Drop Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester7[i].courseName,
            courseCode: data1.Result[0].Semester7[i].courseCode,
            credits: data1.Result[0].Semester7[i].credits,
            section: data1.section,
            semester: data1.semester,
            action: action,
          });
          await record.save();
          await data1.Result[0].Semester7.splice(i, 1);
        }
      }
      await data1.save();
      await data.delete();
      res.send("dleeted");
    } else if (data.semester === 8) {
      for (var i = 0; i < data1.Result[0].Semester8.length; i++) {
        if (data1.Result[0].Semester8[i].status === "Drop Pending") {
          const action = "Drop Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester8[i].courseName,
            courseCode: data1.Result[0].Semester8[i].courseCode,
            credits: data1.Result[0].Semester8[i].credits,
            section: data1.section,
            action: action,
            semester: data1.semester,
          });
          await record.save();
          await data1.Result[0].Semester8.splice(i, 1);
        }
      }
      await data1.save();
      await data.delete();
      res.send("dleeted");
    }
  }
  //ok kerna per is student ka from ma jitna record sab khatam aur student ma drop pendeing student sa deletee ho jai ho jai status
  //mailsend ho jai form k
});
//reject drop course
router.delete("/delete_DropRequest", async (req, res) => {
  console.log(req.body.courseName);
  const { courseName, registrationId } = req.body;
  const data = await CourseRequest.findOne({ registrationId });
  if (!data) {
    res.status(400).send("no course found ");
  } else {
    // console.log(data.courses.length);
    for (var i = 0; i < data.courses.length; i++) {
      if (courseName === data.courses[i].courseName) {
        console.log(data.courses[i].courseName);
        await data.courses.splice(i, 1);
        await data.save();
        if (data.courses.length === 0) {
          await data.delete();
        }
        // await data.save();
        const data1 = await Student.findOne({ registrationId });
        console.log(data1);
        if (!data1) {
          res.status(400).send("no student found that request for drop course");
        } else {
          if (data.semester === 1) {
            for (var j = 0; j < data1.Result[0].Semester1.length; j++) {
              if (data1.Result[0].Semester1[j].courseName === courseName) {
                // console.log(data1.Result[0].Semester1[j].status);
                data1.Result[0].Semester1[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          } else if (data.semester === 2) {
            for (var j = 0; j < data1.Result[0].Semester2.length; j++) {
              if (data1.Result[0].Semester2[j].courseName === courseName) {
                console.log(data1.Result[0].Semester2[j].status);
                data1.Result[0].Semester2[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          } else if (data.semester === 3) {
            for (var j = 0; j < data1.Result[0].Semester3.length; j++) {
              if (data1.Result[0].Semester3[j].courseName === courseName) {
                console.log(data1.Result[0].Semester3[j].status);
                data1.Result[0].Semester3[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          } else if (data.semester === 4) {
            for (var j = 0; j < data1.Result[0].Semester4.length; j++) {
              if (data1.Result[0].Semester4[j].courseName === courseName) {
                console.log(data1.Result[0].Semester4[j].status);
                data1.Result[0].Semester4[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          } else if (data.semester === 5) {
            for (var j = 0; j < data1.Result[0].Semester5.length; j++) {
              if (data1.Result[0].Semester5[j].courseName === courseName) {
                console.log(data1.Result[0].Semester5[j].status);
                data1.Result[0].Semester5[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          } else if (data.semester === 6) {
            for (var j = 0; j < data1.Result[0].Semester6.length; j++) {
              if (data1.Result[0].Semester6[j].courseName === courseName) {
                console.log(data1.Result[0].Semester6[j].status);
                data1.Result[0].Semester6[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          } else if (data.semester === 7) {
            for (var j = 0; j < data1.Result[0].Semester7.length; j++) {
              if (data1.Result[0].Semester7[j].courseName === courseName) {
                console.log(data1.Result[0].Semester7[j].status);
                data1.Result[0].Semester7[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          } else if (data.semester === 8) {
            for (var j = 0; j < data1.Result[0].Semester8.length; j++) {
              if (data1.Result[0].Semester8[j].courseName === courseName) {
                console.log(data1.Result[0].Semester8[j].status);
                data1.Result[0].Semester8[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          }
        }
      }
    }
  }
});

//jis course ka deletee button per click kra delete ho jai
//student ka schema ma sa bi ja ka update ker da

//---------------------------------ADD DROP FORM-------------------
router.get("/Add_Form/:registrationId", async (req, res) => {
  try {
    const { registrationId } = req.params;
    const data = await AddCourse.findOne({ registrationId });
    if (!data) {
      res.status(400).send("no record found");
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    console.log(error);
  }
});
//-----------------------------DROP FORM------------------
router.get("/Drop_Form/:registrationId", async (req, res) => {
  try {
    const { registrationId } = req.params;
    const data = await CourseRequest.findOne({ registrationId });
    if (!data) {
      res.status(400).send("no record found");
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    console.log(error);
  }
});
//----------------------FREEZE FORM-------------------
router.get("/Freeze_Form/:registrationId", async (req, res) => {
  try {
    const { registrationId } = req.params;
    const data = await FreezeSemester.findOne({ registrationId });
    if (!data) {
      res.status(400).send("no record found");
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    console.log(error);
  }
});
//reset password for batchadvisor
router.put("/BA_resetpassword", async (req, res) => {
  try {
    const { new_password, confirm_password } = req.body;
    const sentToken = req.body.token;
    if (!new_password || !confirm_password) {
      return res.status(400).json({ error: "filled the data" });
    }
    if (new_password != confirm_password) {
      return res.status(400).json({ error: "confirm password does not match" });
    }
    console.log(new_password);
    const batchadvisor = await BatchAdvisor.findOne({
      resettoken: sentToken,
      expiretoken: { $gt: Date.now() },
    });
    //  console.log(user)
    if (!batchadvisor) {
      res.status(422).json({ error: "token expire" });
    }
    batchadvisor.password = new_password;
    batchadvisor.resettoken = undefined;
    batchadvisor.expiretoken = undefined;
    await batchadvisor.save();
    //  sendToken(user, 200, res)
    res.status(200).send("Password updated successfully");
  } catch (error) {
    console.log(error);
  }
});
//PAST PAPER
//view pastpaper
router.get("/papers/:course_title/:paper_type/:session", async (req, res) => {
  try {
    const searchField1 = req.params.course_title;
    const searchField2 = req.params.paper_type;
    const searchField3 = req.params.session;
    console.log(searchField1);
    const data = await Pastpaper.find({
      course_title: {
        $regex: searchField1,
        $options: "$eq",
      },
      paper_type: {
        $regex: searchField2,
        $options: "$eq",
      },
      session: {
        $regex: searchField3,
        $options: "$eq",
      },
    });
    if (!data) {
      res.status(200).send("no record found");
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//view specific file
router.get("/papers/:_id", async (req, res) => {
  try {
    const data = await Pastpaper.findById(req.params._id);
    if (!data) {
      res.status(200).send("no record found");
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../frontend/public/PastPapers");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      // res.send("only pdf alloowed")
      // return (cb(new Error('Only .pdf  format allowed!')));
    }
  },
});
//upload pastpaper
router.post(
  "/upload_pastpapers",
  upload.single("paper"),
  S_authenticate,
  async (req, res) => {
    try {
      const uploadpaper = new Pastpaper({
        course_title: req.body.course_title,
        paper_type: req.body.paper_type,
        session: req.body.session,
        paper: `/PastPapers/${req.file.filename}`,
        paper_name: req.file.filename,
      });
      //  console.log("2")
      if (!uploadpaper) {
        res.status(400).send("eroor");
      } else {
        console.log(uploadpaper);
        await uploadpaper.save();
        res.send(uploadpaper);
      }
    } catch (error) {
      res.status(400).send("erroor");
    }
  }
);
//studentsindormations
router.get("/StudentsInformations", BA_authenticate, async (req, res) => {
  try {
    const data = req.rootuser;
    console.log(data);
    const batch = data.batch;
    console.log(batch);
    const studentDetail = await Student.find({ batch: batch });
    if (!studentDetail) res.status(400).send("error");
    else {
      res.send(studentDetail);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//get student result card
router.get("/StudentResult/:_id", async (req, res) => {
  try {
    const data = await Student.findById(req.params._id);

    if (!data) {
      res.status(200).send("no record found");
    } else {
      res.status(200).send(data.Result[0]);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//view result
router.get("/student_result/:registrationId", async (req, res) => {
  const { registrationId } = req.params;
  // const { registrationId } = req.body;
  const data = await Student.findOne({ registrationId });
  if (!data) {
    res.send("no record found");
  } else {
    if (data.semester === 1) {
      const data1 = data.Result[0].Semester1;
      res.status(200).send(data1);
    } else if (data.semester === 2) {
      const data1 = data.Result[0].Semester1.concat(
        1,
        data.Result[0].Semester2
      );
      res.status(200).send(data1);
    } else if (data.semester === 3) {
      const data1 = data.Result[0].Semester1.concat(
        1,
        data.Result[0].Semester2,
        1,
        data.Result[0].Semester3,
        1
      );
      res.status(200).send(data1);
    } else if (data.semester === 4) {
      const data1 = data.Result[0].Semester1.concat(
        1,
        data.Result[0].Semester2,
        1,
        data.Result[0].Semester3,
        1,
        data.Result[0].Semester4,
        1
      );
      res.status(200).send(data1);
    } else if (data.semester === 5) {
      const data1 = data.Result[0].Semester1.concat(
        1,
        data.Result[0].Semester2,
        1,
        data.Result[0].Semester3,
        1,
        data.Result[0].Semester4,
        1,
        data.Result[0].Semester5,
        1
      );
      res.status(200).send(data1);
    } else if (data.semester === 6) {
      const data1 = data.Result[0].Semester1.concat(
        1,
        data.Result[0].Semester2,
        1,
        data.Result[0].Semester3,
        1,
        data.Result[0].Semester4,
        1,
        data.Result[0].Semester5,
        1,
        data.Result[0].Semester6,
        1
      );
      res.status(200).send(data1);
    } else if (data.semester === 7) {
      const data1 = data.Result[0].Semester1.concat(
        1,
        data.Result[0].Semester2,
        1,
        data.Result[0].Semester3,
        1,
        data.Result[0].Semester4,
        1,
        data.Result[0].Semester5,
        1,
        data.Result[0].Semester6,
        1,
        data.Result[0].Semester7,
        1
      );
      res.status(200).send(data1);
    } else if (data.semester === 8) {
      // res.status(200).json([
      //   {
      //     sem1: data.Result[0].Semester1,
      //   },
      //   {
      //     sem2: data.Result[0].Semester2,
      //   },
      // ]);
      const data1 = data.Result[0].Semester1.concat(
        1,
        data.Result[0].Semester2,
        1,
        data.Result[0].Semester3,
        1,
        data.Result[0].Semester4,
        1,
        data.Result[0].Semester5,
        1,
        data.Result[0].Semester6,
        1,
        data.Result[0].Semester7,
        1,
        data.Result[0].Semester8,
        1
      );
      res.status(200).send(data1);
    } else if (data.semester === 9) {
      const data1 = data.Result[0].Semester1.concat(
        1,
        data.Result[0].Semester2,
        1,
        data.Result[0].Semester3,
        1,
        data.Result[0].Semester4,
        1,
        data.Result[0].Semester5,
        1,
        data.Result[0].Semester6,
        1,
        data.Result[0].Semester7,
        1,
        data.Result[0].Semester8,
        1,
        data.Result[0].Semester9,
        1
      );
      res.status(200).send(data1);
    } else if (data.semester === 10) {
      const data1 = data.Result[0].Semester1.concat(
        1,
        data.Result[0].Semester2,
        1,
        data.Result[0].Semester3,
        1,
        data.Result[0].Semester4,
        1,
        data.Result[0].Semester5,
        1,
        data.Result[0].Semester6,
        1,
        data.Result[0].Semester7,
        1,
        data.Result[0].Semester8,
        1,
        data.Result[0].Semester9,
        1,
        data.Result[0].Semester10,
        1
      );
      res.status(200).send(data1);
    } else if (data.semester === 11) {
      const data1 = data.Result[0].Semester1.concat(
        1,
        data.Result[0].Semester2,
        1,
        data.Result[0].Semester3,
        1,
        data.Result[0].Semester4,
        1,
        data.Result[0].Semester5,
        1,
        data.Result[0].Semester6,
        1,
        data.Result[0].Semester7,
        1,
        data.Result[0].Semester8,
        1,
        data.Result[0].Semester9,
        1,
        data.Result[0].Semester10,
        1,
        data.Result[0].Semester11,
        1
      );
      res.status(200).send(data1);
    } else if (data.semester === 12) {
      const data1 = data.Result[0].Semester1.concat(
        1,
        data.Result[0].Semester2,
        1,
        data.Result[0].Semester3,
        1,
        data.Result[0].Semester4,
        1,
        data.Result[0].Semester5,
        1,
        data.Result[0].Semester6,
        1,
        data.Result[0].Semester7,
        1,
        data.Result[0].Semester8,
        1,
        data.Result[0].Semester9,
        1,
        data.Result[0].Semester10,
        1,
        data.Result[0].Semester11,
        1,
        data.Result[0].Semester12,
        1
      );
      res.status(200).send(data1);
    }
  }
});
//for repeat courses
router.get("/repeatCourses", S_authenticate, async (req, res) => {
  const user = req.rootuser;
  const { semester } = user;
  if (semester === 1) {
    res.status(200).send("No course available for repeat");
  } else if (semester === 2) {
    const data = user.Result[0].Semester1;
    var data1 = [];
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].gp);
      if (data[i].gp < 2) {
        await data1.push(data[i]);
      }
    }
    res.send(data1);
  } else if (semester === 3) {
    const data = user.Result[0].Semester1.concat(user.Result[0].Semester2);
    var data1 = []; //store all courses that can repeat
    for (var i = 0; i < data.length; i++) {
      if (data[i].gp < 2) {
        if (data1.length === 0) {
          await data1.push(data[i]);
        } else {
          for (var k = 0; k < data1.length; k++) {
            //no duplicate data enter
            if (data1[k].courseName === data[i].courseName) {
              if (data[i].gp > data1[k].gp) {
                await data1.splice(k, 1);
                await data1.push(data[i]);
              } else {
                console.log("this course already present");
              }
            } else {
              await data1.push(data[i]);
            }
          }
        }
      }
    }
    //check that the if he/she study that course later and improve gpa and that course remove from the repeat course array
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data1.length; j++) {
        if (data[i].courseName === data1[j].courseName) {
          if (data[i].gp === data1[j].gp) {
          } else {
            if (data[i].gp >= 2) {
              await data1.splice(j, 1);
            } else if (data[i].gp < 2) {
              await data1.splice(j, 1);
              await data1.push(data[k]);
            }
          }
        }
      }
    }
    res.send(data1);
  } else if (semester === 4) {
    const data = user.Result[0].Semester1.concat(
      user.Result[0].Semester2,
      user.Result[0].Semester3
    );
    var data1 = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].gp < 2) {
        if (data1.length === 0) {
          await data1.push(data[i]);
        } else {
          for (var k = 0; k < data1.length; k++) {
            if (data1[k].courseName === data[i].courseName) {
              if (data[i].gp > data1[k].gp) {
                await data1.splice(k, 1);
                await data1.push(data[i]);
              } else {
                console.log("this course already present");
              }
            } else {
              await data1.push(data[i]);
            }
          }
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data1.length; j++) {
        if (data[i].courseName === data1[j].courseName) {
          if (data[i].gp === data1[j].gp) {
          } else {
            if (data[i].gp >= 2) {
              await data1.splice(j, 1);
            } else if (data[i].gp < 2) {
              await data1.splice(j, 1);
              await data1.push(data[k]);
            }
          }
        }
      }
    }
    res.send(data1);
  } else if (semester === 5) {
    const data = user.Result[0].Semester1.concat(
      user.Result[0].Semester2,
      user.Result[0].Semester3,
      user.Result[0].Semester4
    );
    var data1 = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].gp < 2) {
        if (data1.length === 0) {
          await data1.push(data[i]);
        } else {
          for (var k = 0; k < data1.length; k++) {
            if (data1[k].courseName === data[i].courseName) {
              if (data[i].gp > data1[k].gp) {
                await data1.splice(k, 1);
                await data1.push(data[i]);
              } else {
                console.log("this course already present");
              }
            } else {
              await data1.push(data[i]);
            }
          }
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data1.length; j++) {
        if (data[i].courseName === data1[j].courseName) {
          if (data[i].gp === data1[j].gp) {
          } else {
            if (data[i].gp >= 2) {
              await data1.splice(j, 1);
            } else if (data[i].gp < 2) {
              await data1.splice(j, 1);
              await data1.push(data[k]);
            }
          }
        }
      }
    }
    res.send(data1);
  } else if (semester === 6) {
    const data = user.Result[0].Semester1.concat(
      user.Result[0].Semester2,
      user.Result[0].Semester3,
      user.Result[0].Semester4,
      user.Result[0].Semester5
    );
    var data1 = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].gp < 2) {
        if (data1.length === 0) {
          await data1.push(data[i]);
        } else {
          for (var k = 0; k < data1.length; k++) {
            if (data1[k].courseName === data[i].courseName) {
              if (data[i].gp > data1[k].gp) {
                await data1.splice(k, 1);
                await data1.push(data[i]);
              } else {
                console.log("this course already present");
              }
            } else {
              await data1.push(data[i]);
            }
          }
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data1.length; j++) {
        if (data[i].courseName === data1[j].courseName) {
          if (data[i].gp === data1[j].gp) {
          } else {
            if (data[i].gp >= 2) {
              await data1.splice(j, 1);
            } else if (data[i].gp < 2) {
              await data1.splice(j, 1);
              await data1.push(data[k]);
            }
          }
        }
      }
    }
    res.send(data1);
  } else if (semester === 7) {
    const data = user.Result[0].Semester1.concat(
      user.Result[0].Semester2,
      user.Result[0].Semester3,
      user.Result[0].Semester4,
      user.Result[0].Semester5,
      user.Result[0].Semester6
    );
    var data1 = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].gp < 2) {
        if (data1.length === 0) {
          await data1.push(data[i]);
        } else {
          for (var k = 0; k < data1.length; k++) {
            if (data1[k].courseName === data[i].courseName) {
              if (data[i].gp > data1[k].gp) {
                await data1.splice(k, 1);
                await data1.push(data[i]);
              } else {
                console.log("this course already present");
              }
            } else {
              await data1.push(data[i]);
            }
          }
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data1.length; j++) {
        if (data[i].courseName === data1[j].courseName) {
          if (data[i].gp === data1[j].gp) {
          } else {
            if (data[i].gp >= 2) {
              await data1.splice(j, 1);
            } else if (data[i].gp < 2) {
              await data1.splice(j, 1);
              await data1.push(data[k]);
            }
          }
        }
      }
    }
    res.send(data1);
  } else if (semester === 8) {
    const data = user.Result[0].Semester1.concat(
      user.Result[0].Semester2,
      user.Result[0].Semester3,
      user.Result[0].Semester4,
      user.Result[0].Semester5,
      user.Result[0].Semester6,
      user.Result[0].Semester7
    );
    var data1 = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].gp < 2) {
        if (data1.length === 0) {
          await data1.push(data[i]);
        } else {
          for (var k = 0; k < data1.length; k++) {
            if (data1[k].courseName === data[i].courseName) {
              if (data[i].gp > data1[k].gp) {
                await data1.splice(k, 1);
                await data1.push(data[i]);
              } else {
                console.log("this course already present");
              }
            } else {
              await data1.push(data[i]);
            }
          }
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data1.length; j++) {
        if (data[i].courseName === data1[j].courseName) {
          // for (var k=0; k<data.length;k++){
          // if(data1[j].courseName===data[k].courseName){
          if (data[i].gp === data1[j].gp) {
            // console.log(data1)
          } else {
            if (data[i].gp >= 2) {
              await data1.splice(j, 1);
              // console.log(data1)
              // await data1.save()
            } else if (data[i].gp < 2) {
              await data1.splice(j, 1);
              //  await data1.save()
              await data1.push(data[k]);
            }
          }
        }
      }
    }
    res.send(data1);
  } else if (semester === 9) {
    const data = user.Result[0].Semester1.concat(
      user.Result[0].Semester2,
      user.Result[0].Semester3,
      user.Result[0].Semester4,
      user.Result[0].Semester5,
      user.Result[0].Semester6,
      user.Result[0].Semester7,
      user.Result[0].Semester8
    );
    var data1 = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].gp < 2) {
        if (data1.length === 0) {
          await data1.push(data[i]);
        } else {
          for (var k = 0; k < data1.length; k++) {
            if (data1[k].courseName === data[i].courseName) {
              if (data[i].gp > data1[k].gp) {
                await data1.splice(k, 1);
                await data1.push(data[i]);
              } else {
                console.log("this course already present");
              }
            } else {
              await data1.push(data[i]);
            }
          }
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data1.length; j++) {
        if (data[i].courseName === data1[j].courseName) {
          // for (var k=0; k<data.length;k++){
          // if(data1[j].courseName===data[k].courseName){
          if (data[i].gp === data1[j].gp) {
            // console.log(data1)
          } else {
            if (data[i].gp >= 2) {
              await data1.splice(j, 1);
              // console.log(data1)
              // await data1.save()
            } else if (data[i].gp < 2) {
              await data1.splice(j, 1);
              //  await data1.save()
              await data1.push(data[k]);
            }
          }
          // }
          // }
        }
      }
    }
    res.send(data1);
  } else if (semester === 10) {
    const data = user.Result[0].Semester1.concat(
      user.Result[0].Semester2,
      user.Result[0].Semester3,
      user.Result[0].Semester4,
      user.Result[0].Semester5,
      user.Result[0].Semester6,
      user.Result[0].Semester7,
      user.Result[0].Semester8,
      user.Result[0].Semester9
    );
    var data1 = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].gp < 2) {
        if (data1.length === 0) {
          await data1.push(data[i]);
        } else {
          for (var k = 0; k < data1.length; k++) {
            if (data1[k].courseName === data[i].courseName) {
              if (data[i].gp > data1[k].gp) {
                await data1.splice(k, 1);
                await data1.push(data[i]);
              } else {
                console.log("this course already present");
              }
            } else {
              await data1.push(data[i]);
            }
          }
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data1.length; j++) {
        if (data[i].courseName === data1[j].courseName) {
          // for (var k=0; k<data.length;k++){
          // if(data1[j].courseName===data[k].courseName){
          if (data[i].gp === data1[j].gp) {
            // console.log(data1)
          } else {
            if (data[i].gp >= 2) {
              await data1.splice(j, 1);
              // console.log(data1)
              // await data1.save()
            } else if (data[i].gp < 2) {
              await data1.splice(j, 1);
              //  await data1.save()
              await data1.push(data[k]);
            }
          }
          // }
          // }
        }
      }
    }
    res.send(data1);
  } else if (semester === 11) {
    const data = user.Result[0].Semester1.concat(
      user.Result[0].Semester2,
      user.Result[0].Semester3,
      user.Result[0].Semester4,
      user.Result[0].Semester5,
      user.Result[0].Semester6,
      user.Result[0].Semester7,
      user.Result[0].Semester8,
      user.Result[0].Semester9,
      user.Result[0].Semester10
    );
    var data1 = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].gp < 2) {
        if (data1.length === 0) {
          await data1.push(data[i]);
        } else {
          for (var k = 0; k < data1.length; k++) {
            if (data1[k].courseName === data[i].courseName) {
              if (data[i].gp > data1[k].gp) {
                await data1.splice(k, 1);
                await data1.push(data[i]);
              } else {
                console.log("this course already present");
              }
            } else {
              await data1.push(data[i]);
            }
          }
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data1.length; j++) {
        if (data[i].courseName === data1[j].courseName) {
          // for (var k=0; k<data.length;k++){
          // if(data1[j].courseName===data[k].courseName){
          if (data[i].gp === data1[j].gp) {
            // console.log(data1)
          } else {
            if (data[i].gp >= 2) {
              await data1.splice(j, 1);
              // console.log(data1)
              // await data1.save()
            } else if (data[i].gp < 2) {
              await data1.splice(j, 1);
              //  await data1.save()
              await data1.push(data[k]);
            }
          }
          // }
          // }
        }
      }
    }
    res.send(data1);
  } else if (semester === 12) {
    const data = user.Result[0].Semester1.concat(
      user.Result[0].Semester2,
      user.Result[0].Semester3,
      user.Result[0].Semester4,
      user.Result[0].Semester5,
      user.Result[0].Semester6,
      user.Result[0].Semester7,
      user.Result[0].Semester8,
      user.Result[0].Semester9,
      user.Result[0].Semester10,
      user.Result[0].Semester11
    );
    var data1 = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].gp < 2) {
        if (data1.length === 0) {
          await data1.push(data[i]);
        } else {
          for (var k = 0; k < data1.length; k++) {
            if (data1[k].courseName === data[i].courseName) {
              if (data[i].gp > data1[k].gp) {
                await data1.splice(k, 1);
                await data1.push(data[i]);
              } else {
                console.log("this course already present");
              }
            } else {
              await data1.push(data[i]);
            }
          }
        }
      }
    }
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data1.length; j++) {
        if (data[i].courseName === data1[j].courseName) {
          // for (var k=0; k<data.length;k++){
          // if(data1[j].courseName===data[k].courseName){
          if (data[i].gp === data1[j].gp) {
            // console.log(data1)
          } else {
            if (data[i].gp >= 2) {
              await data1.splice(j, 1);
              // console.log(data1)
              // await data1.save()
            } else if (data[i].gp < 2) {
              await data1.splice(j, 1);
              //  await data1.save()
              await data1.push(data[k]);
            }
          }
          // }
          // }
        }
      }
    }
    res.send(data1);
  }
});
//-------------------FreezeSemester------------
router.post("/freezeSemester", S_authenticate, async (req, res) => {
  const { reason, continuationTime } = req.body;
  const user = req.rootuser;
  const {
    batch,
    registrationId,
    email,
    name,
    contactNo,
    address,
    semester,
    section,
  } = user;
  const { CGPA } = user.Result[0];
  const record = await FreezeSemester.findOne({ registrationId });
  if (!record) {
    const freeze = new FreezeSemester({
      batch,
      registrationId,
      semester,
      name,
      address,
      contactNo,
      email,
      CGPA,
      reason,
      section,
      continuationTime,
    });
    await freeze.save();
    res.send(freeze);
  } else {
    res.send(record);
  }
});
//reject Freeze semster request------------------
router.delete("/FreezeSemester_reject", async (req, res) => {
  try {
    const { registrationId } = req.body;
    console.log(registrationId);
    const data = await FreezeSemester.findOne({ registrationId });
    if (!data) {
      res.status(400).json("no record found");
    } else {
      await data.delete();
      res.status(200).json("deleted");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//----------------------------------ADD COURSE--------------------------
// on student side
//delete the course that add-------------student side
router.delete("/delete_addcourse_request", S_authenticate, async (req, res) => {
  try {
    const { courseName } = req.body;
    const user = req.rootuser;
    const { registrationId } = user;
    const record = await AddCourse.findOne({ registrationId: registrationId });
    if (!record) {
      res.status(400).send("no record found");
    } else {
      for (let i = 0; i < record.courses.length; i++) {
        if (record.courses[i].courseName === courseName) {
          await record.courses.splice(i, 1);
          await record.save();
          res.send("deleted");
        }
      }
      if (record.courses.length === 0) {
        await record.delete();
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//-----------------------multer----------
// const feestorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "../frontend/public/feeChallan");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const upload_fee = multer({
//   storage: feestorage,
// });
//upload fee challan and submit it ----------student side

//for add course get  creidts hours
router.get("/credit_hour", S_authenticate, async (req, res) => {
  try {
    const student = req.rootuser;
    const { registrationId, semester } = student;
    const data = await Student.findOne({ registrationId });
    if (!data) {
      res.status(400).send("no record found");
    } else {
      if (semester === 1) {
        let credit = 0;
        for (let i = 0; i < data.Result[0].Semester1.length; i++) {
          credit += data.Result[0].Semester1[i].credits;
        }
        const data1 = await PendingAddCourse.findOne({ registrationId });
        if (data1) {
          for (let i = 0; i < data1.courses.length; i++) {
            credit += data1.courses[i].credits;
          }
        }
        res.json(credit);
      } else if (semester === 2) {
        let credit = 0;
        for (let i = 0; i < data.Result[0].Semester2.length; i++) {
          credit += data.Result[0].Semester2[i].credits;
        }
        const data1 = await PendingAddCourse.findOne({ registrationId });
        if (data1) {
          for (let i = 0; i < data1.courses.length; i++) {
            credit += data1.courses[i].credits;
          }
        }
        res.json(credit);
      } else if (semester === 3) {
        let credit = 0;
        for (let i = 0; i < data.Result[0].Semester3.length; i++) {
          credit += data.Result[0].Semester3[i].credits;
        }
        const data1 = await PendingAddCourse.findOne({ registrationId });
        if (data1) {
          for (let i = 0; i < data1.courses.length; i++) {
            credit += data1.courses[i].credits;
          }
        }
        res.json(credit);
      } else if (semester === 4) {
        let credit = 0;
        for (let i = 0; i < data.Result[0].Semester4.length; i++) {
          credit += data.Result[0].Semester4[i].credits;
        }
        const data1 = await PendingAddCourse.findOne({ registrationId });
        if (data1) {
          for (let i = 0; i < data1.courses.length; i++) {
            credit += data1.courses[i].credits;
          }
        }
        res.json(credit);
      } else if (semester === 5) {
        let credit = 0;
        for (let i = 0; i < data.Result[0].Semester5.length; i++) {
          credit += data.Result[0].Semester5[i].credits;
        }
        const data1 = await PendingAddCourse.findOne({ registrationId });
        if (data1) {
          for (let i = 0; i < data1.courses.length; i++) {
            credit += data1.courses[i].credits;
          }
        }
        res.json(credit);
      } else if (semester === 6) {
        let credit = 0;
        for (let i = 0; i < data.Result[0].Semester6.length; i++) {
          credit += data.Result[0].Semester6[i].credits;
        }
        const data1 = await PendingAddCourse.findOne({ registrationId });
        if (data1) {
          for (let i = 0; i < data1.courses.length; i++) {
            credit += data1.courses[i].credits;
          }
        }
        res.json(credit);
      } else if (semester === 7) {
        let credit = 0;
        for (let i = 0; i < data.Result[0].Semester7.length; i++) {
          credit += data.Result[0].Semester7[i].credits;
        }
        const data1 = await PendingAddCourse.findOne({ registrationId });
        if (data1) {
          for (let i = 0; i < data1.courses.length; i++) {
            credit += data1.courses[i].credits;
          }
        }
        res.json(credit);
      } else if (semester === 8) {
        let credit = 0;
        for (let i = 0; i < data.Result[0].Semester8.length; i++) {
          credit += data.Result[0].Semester8[i].credits;
        }
        const data1 = await PendingAddCourse.findOne({ registrationId });
        if (data1) {
          for (let i = 0; i < data1.courses.length; i++) {
            credit += data1.courses[i].credits;
          }
        }
        res.json(credit);
      } else if (semester === 9) {
        let credit = 0;
        for (let i = 0; i < data.Result[0].Semester9.length; i++) {
          credit += data.Result[0].Semester9[i].credits;
        }
        const data1 = await PendingAddCourse.findOne({ registrationId });
        if (data1) {
          for (let i = 0; i < data1.courses.length; i++) {
            credit += data1.courses[i].credits;
          }
        }
        res.json(credit);
      } else if (semester === 10) {
        let credit = 0;
        for (let i = 0; i < data.Result[0].Semester10.length; i++) {
          credit += data.Result[0].Semester10[i].credits;
        }
        const data1 = await PendingAddCourse.findOne({ registrationId });
        if (data1) {
          for (let i = 0; i < data1.courses.length; i++) {
            credit += data1.courses[i].credits;
          }
        }
        res.json(credit);
      } else if (semester === 11) {
        let credit = 0;
        for (let i = 0; i < data.Result[0].Semester11.length; i++) {
          credit += data.Result[0].Semester11[i].credits;
        }
        const data1 = await PendingAddCourse.findOne({ registrationId });
        if (data1) {
          for (let i = 0; i < data1.courses.length; i++) {
            credit += data1.courses[i].credits;
          }
        }
        res.json(credit);
      } else if (semester === 12) {
        let credit = 0;
        for (let i = 0; i < data.Result[0].Semester12.length; i++) {
          credit += data.Result[0].Semester12[i].credits;
        }
        const data1 = await PendingAddCourse.findOne({ registrationId });
        if (data1) {
          for (let i = 0; i < data1.courses.length; i++) {
            credit += data1.courses[i].credits;
          }
        }
        res.json(credit);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//get the specific student add request ( Add Form )
router.get("/AddForm", BA_authenticate, async (req, res) => {
  try {
    const { registrationId } = req.body;
    const data = await AddCourse.findOne({ registrationId });
    if (!data) {
      res.status(400).send("no record found");
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    console.log(error);
  }
});
//delete the specific course add request ( Add Form )
// router.delete("/delete_add_course", async (req, res) => {
//   try {
//     const { courseName, registrationId } = req.body;
//     const data = await AddCourse.findOne({ registrationId });
//     if (!data) {
//       res.status(400).send("no record found");
//     } else {
//       for (let i = 0; i < data.courses.length; i++) {
//         if (data.courses[i].courseName === courseName) {
//           await data.courses.splice(i, 1);
//           await data.save();
//           res.status(200).send("deleted successfully");
//         }
//       }
//     }
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });
//reject Add course course
router.delete("/delete_AddPending", async (req, res) => {
  console.log(req.body.courseName);
  const { courseName, registrationId } = req.body;
  const data = await AddCourse.findOne({ registrationId });
  if (!data) {
    res.status(400).send("no course found ");
  } else {
    // console.log(data.courses.length);
    for (var i = 0; i < data.courses.length; i++) {
      if (courseName === data.courses[i].courseName) {
        console.log(data.courses[i].courseName);
        await data.courses.splice(i, 1);
        await data.save();
        if (data.courses.length === 0) {
          await data.delete();
        }
        // await data.save();
        const data1 = await Student.findOne({ registrationId });
        console.log(data1);
        if (!data1) {
          res.status(400).send("no student found that request for drop course");
        } else {
          if (data.semester === 1) {
            for (var j = 0; j < data1.Result[0].Semester1.length; j++) {
              if (data1.Result[0].Semester1[j].courseName === courseName) {
                // console.log(data1.Result[0].Semester1[j].status);
                data1.Result[0].Semester1[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          } else if (data.semester === 2) {
            for (var j = 0; j < data1.Result[0].Semester2.length; j++) {
              if (data1.Result[0].Semester2[j].courseName === courseName) {
                console.log(data1.Result[0].Semester2[j].status);
                data1.Result[0].Semester2[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          } else if (data.semester === 3) {
            for (var j = 0; j < data1.Result[0].Semester3.length; j++) {
              if (data1.Result[0].Semester3[j].courseName === courseName) {
                console.log(data1.Result[0].Semester3[j].status);
                data1.Result[0].Semester3[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          } else if (data.semester === 4) {
            for (var j = 0; j < data1.Result[0].Semester4.length; j++) {
              if (data1.Result[0].Semester4[j].courseName === courseName) {
                console.log(data1.Result[0].Semester4[j].status);
                data1.Result[0].Semester4[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          } else if (data.semester === 5) {
            for (var j = 0; j < data1.Result[0].Semester5.length; j++) {
              if (data1.Result[0].Semester5[j].courseName === courseName) {
                console.log(data1.Result[0].Semester5[j].status);
                data1.Result[0].Semester5[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          } else if (data.semester === 6) {
            for (var j = 0; j < data1.Result[0].Semester6.length; j++) {
              if (data1.Result[0].Semester6[j].courseName === courseName) {
                console.log(data1.Result[0].Semester6[j].status);
                data1.Result[0].Semester6[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          } else if (data.semester === 7) {
            for (var j = 0; j < data1.Result[0].Semester7.length; j++) {
              if (data1.Result[0].Semester7[j].courseName === courseName) {
                console.log(data1.Result[0].Semester7[j].status);
                data1.Result[0].Semester7[j].status = "enrolled";
                await data1.save();
                res.send("deleted");
              }
            }
          } else if (data.semester === 8) {
            for (var j = 0; j < data1.Result[0].Semester8.length; j++) {
              if (data1.Result[0].Semester8[j].courseName === courseName) {
                // console.log(data1.Result[0].Semester8[j].status);
                data1.Result[0].Semester8.splice(j, 1);
                await data1.save();
                res.send("deleted");
              }
            }
          }
        }
      }
    }
  }
});
// submit add form requests
router.post("/Add_Coursess_Submit", async (req, res) => {
  const { registrationId } = req.body;
  console.log(registrationId);
  const data = await AddCourse.findOne({ registrationId });
  if (!data) {
    res.status(400).send("no record found");
  } else {
    const data1 = await Student.findOne({ registrationId });

    if (data.semester === 1) {
      for (var i = 0; i < data1.Result[0].Semester1.length; i++) {
        if (data1.Result[0].Semester1[i].status === "Add Pending") {
          const action = "Add Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester1[i].courseName,
            courseCode: data1.Result[0].Semester1[i].courseCode,
            credits: data1.Result[0].Semester1[i].credits,
            section: data1.section,
            action: action,
            semester: data1.semester,
          });
          await record.save();
          await data1.Result[0].Semester1.splice(i, 1);
        }
        await data1.save();
        await data.delete();
        res.send("dleeted");
      }
    } else if (data.semester === 2) {
      for (var i = 0; i < data1.Result[0].Semester2.length; i++) {
        if (data1.Result[0].Semester2[i].status === "Add Pending") {
          const action = "Add Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester2[i].courseName,
            courseCode: data1.Result[0].Semester2[i].courseCode,
            credits: data1.Result[0].Semester2[i].credits,
            section: data1.section,
            action: action,
            semester: data1.semester,
          });
          await record.save();
          await data1.Result[0].Semester2.splice(i, 1);
        }
      }
      await data1.save();
      await data.delete();
      res.send("dleeted");
    } else if (data.semester === 3) {
      for (var i = 0; i < data1.Result[0].Semester3.length; i++) {
        if (data1.Result[0].Semester3[i].status === "Add Pending") {
          const action = "Add Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester3[i].courseName,
            courseCode: data1.Result[0].Semester3[i].courseCode,
            credits: data1.Result[0].Semester3[i].credits,
            section: data1.section,
            action: action,
            semester: data1.semester,
          });
          await record.save();
          await data1.Result[0].Semester3.splice(i, 1);
        }
      }
      await data1.save();
      await data.delete();
      res.send("dleeted");
    } else if (data.semester === 4) {
      for (var i = 0; i < data1.Result[0].Semester4.length; i++) {
        if (data1.Result[0].Semester4[i].status === "Add Pending") {
          const action = "Add Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester4[i].courseName,
            courseCode: data1.Result[0].Semester4[i].courseCode,
            credits: data1.Result[0].Semester4[i].credits,
            section: data1.section,
            action: action,
            semester: data1.semester,
          });
          await record.save();
          await data1.Result[0].Semester4.splice(i, 1);
        }
      }
      await data1.save();
      await data.delete();
      res.send("dleeted");
    } else if (data.semester === 5) {
      for (var i = 0; i < data1.Result[0].Semester5.length; i++) {
        if (data1.Result[0].Semester5[i].status === "Add Pending") {
          const action = "Add Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester5[i].courseName,
            courseCode: data1.Result[0].Semester5[i].courseCode,
            credits: data1.Result[0].Semester5[i].credits,
            section: data1.section,
            action: action,
            semester: data1.semester,
          });
          await record.save();
          await data1.Result[0].Semester5.splice(i, 1);
        }
      }
      await data1.save();
      await data.delete();
      res.send("dleeted");
    } else if (data.semester === 6) {
      for (var i = 0; i < data1.Result[0].Semester6.length; i++) {
        if (data1.Result[0].Semester6[i].status === "Add Pending") {
          const action = "Add Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester6[i].courseName,
            courseCode: data1.Result[0].Semester6[i].courseCode,
            credits: data1.Result[0].Semester6[i].credits,
            section: data1.section,
            action: action,
            semester: data1.semester,
          });
          await record.save();
          await data1.Result[0].Semester6.splice(i, 1);
        }
      }
      await data1.save();
      await data.delete();
      res.send("dleeted");
    } else if (data.semester === 7) {
      for (var i = 0; i < data1.Result[0].Semester7.length; i++) {
        if (data1.Result[0].Semester7[i].status === "Add Pending") {
          const action = "Add Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester7[i].courseName,
            courseCode: data1.Result[0].Semester7[i].courseCode,
            credits: data1.Result[0].Semester7[i].credits,
            section: data1.section,
            semester: data1.semester,
            action: action,
          });
          await record.save();
          await data1.Result[0].Semester7.splice(i, 1);
        }
      }
      await data1.save();
      await data.delete();
      res.send("dleeted");
    } else if (data.semester === 8) {
      for (var i = 0; i < data1.Result[0].Semester8.length; i++) {
        if (data1.Result[0].Semester8[i].status === "Add Pending") {
          const action = "Add Course";
          const record = new ApprovedRequest({
            registrationId: registrationId,
            name: data1.name,
            courseName: data1.Result[0].Semester8[i].courseName,
            courseCode: data1.Result[0].Semester8[i].courseCode,
            credits: data1.Result[0].Semester8[i].credits,
            section: data1.section,
            action: action,
            semester: data1.semester,
          });
          await record.save();
          await data1.Result[0].Semester8.splice(i, 1);
        }
      }
      await data1.save();
      await data.delete();
      res.send("dleeted");
    }
  }
  //ok kerna per is student ka from ma jitna record sab khatam aur student ma drop pendeing student sa deletee ho jai ho jai status
  //mailsend ho jai form k
});
//------------------------PRETEST IN ADD COURSE------------------
//add questions
router.post("/Add_Question", async (req, res) => {
  const {
    courseCode,
    courseName,
    question,
    option1,
    option2,
    option3,
    option4,
    correct_answer,
  } = req.body;
  if (
    option1 === correct_answer ||
    option2 === correct_answer ||
    option3 === correct_answer ||
    option4 === correct_answer ||
    option1 != option2 ||
    option1 != option3 ||
    option1 != option4 ||
    option2 != option3 ||
    option2 != option4 ||
    option3 != option4
  ) {
    const record = await Pretest.findOne({ courseCode });
    if (!record) {
      const add = new Pretest({
        courseCode,
        courseName,
      });
      await add.add_question(
        question,
        option1,
        option2,
        option3,
        option4,
        correct_answer
      );
      await add.save();
      res.send(add);
    }
    await record.add_question(
      question,
      option1,
      option2,
      option3,
      option4,
      correct_answer
    );
    await record.save();
    res.send(record);
  } else {
    res.status(400).send("enter the correct option and answer");
  }
});
//get questions
router.get("/getQuestions/:courseName", async (req, res) => {
  const { courseName } = req.params;
  console.log(courseName);
  // const courseCode="123"
  const question = await Pretest.findOne({ courseName });
  if (!question) {
    res.status(400).send("please enter correct courseCode");
  } else {
    res.status(200).send(question.questions);
  }
});
//verify the answers
router.post("/verifyAnswer/:courseName", S_authenticate, async (req, res) => {
  const { answer } = req.body;
  const { courseName } = req.params;
  const { registrationId } = req.rootuser;
  console.log(answer);
  const record = await Pretest.findOne({ courseName });
  if (!record) {
    res.status(400).send("please enter correct courseName");
  } else {
    let marks = 0;
    for (let i = 0; i < answer.length; i++) {
      for (let j = 0; j < record.questions.length; j++) {
        if (record.questions[j].question === answer[i].question) {
          if (record.questions[j].correct_answer === answer[i].correct_answer) {
            marks = marks + 1;
          }
        }
      }
    }
    const pendingCourses = await PendingAddCourse.findOne({ registrationId });

    for (let i = 0; i < pendingCourses.courses.length; i++) {
      console.log(pendingCourses.courses);
      if (pendingCourses.courses[i].preReqCourse === courseName) {
        pendingCourses.courses[i].preTest = marks;
        console.log(pendingCourses.courses[i].preTest);
        await pendingCourses.save();
      }
    }
    // console.log(pendingCourses);
    res.json(marks);
  }

  // for(let i=0;i<record.questions.length;i++){
  //   if(record.questions[i].correct_answer===answer[0] ||
  //      record.questions[i].correct_answer===answer[1] ||
  //      record.questions[i].correct_answer===answer[2] ||
  //      record.questions[i].correct_answer===answer[3] ||
  //      record.questions[i].correct_answer===answer[4] ||
  //      record.questions[i].correct_answer===answer[5] ||
  //      record.questions[i].correct_answer===answer[6] ||
  //      record.questions[i].correct_answer===answer[7] ||
  //      record.questions[i].correct_answer===answer[8] ||
  //      record.questions[i].correct_answer===answer[9] ||
  //      record.questions[i].correct_answer===answer[10]){
  //       console.log(marks);
  //      }else{
  //       marks=marks-1;
  //      }
  // }
});
//--------------------------------office hours------------------
router.post(
  "/officehours/:day/:from/:to",
  BA_authenticate,
  async (req, res) => {
    const { day, from, to } = req.params;
    // console.log(day,from,to)
    const user = req.rootuser;
    const { batch } = user;
    const officehour = await OfficeHour.findOne({ batch });
    if (!officehour) {
      if (to != "--") {
        res.status(400).send("please first select the from time");
      }
      const add = new OfficeHour({
        batch,
      });
      if (day === "Monday") {
        const to_time = from;
        await add.addMonday(day, from, to_time);
        const { abc1, abc2, abc3 } = "--";
        console.log(abc2);
        await add.addTuesday(abc1, abc2, abc3);
        await add.addWednesday(abc1, abc2, abc3);
        await add.addThursday(abc1, abc2, abc3);
        await add.addFriday(abc1, abc2, abc3);
        await add.save();
        res.send(add);
      } else if (day === "Tuesday") {
        const to_time = from;
        await add.addTuesday(day, from, to_time);
        const { abc1, abc2, abc3 } = "--";
        await add.addMonday(abc1, abc2, abc3);
        await add.addWednesday(abc1, abc2, abc3);
        await add.addThursday(abc1, abc2, abc3);
        await add.addFriday(abc1, abc2, abc3);
        await add.save();
        res.send(add);
      } else if (day === "Wednesday") {
        const to_time = from;
        await add.addWednesday(day, from, to_time);
        const { abc1, abc2, abc3 } = "--";
        await add.addTuesday(abc1, abc2, abc3);
        await add.addMonday(abc1, abc2, abc3);
        await add.addThursday(abc1, abc2, abc3);
        await add.addFriday(abc1, abc2, abc3);
        await add.save();
        res.send(add);
      } else if (day === "Thursday") {
        const to_time = from;
        await add.addThursday(day, from, to_time);
        const { abc1, abc2, abc3 } = "--";
        await add.addTuesday(abc1, abc2, abc3);
        await add.addWednesday(abc1, abc2, abc3);
        await add.addMonday(abc1, abc2, abc3);
        await add.addFriday(abc1, abc2, abc3);
        await add.save();
        res.send(add);
      } else if (day === "Friday") {
        const to_time = from;
        await add.addFriday(day, from, to_time);
        const { abc1, abc2, abc3 } = "--";
        await add.addTuesday(abc1, abc2, abc3);
        await add.addWednesday(abc1, abc2, abc3);
        await add.addThursday(abc1, abc2, abc3);
        await add.addMonday(abc1, abc2, abc3);
        await add.save();
        res.send(add);
      } else {
        res.status(400).send("please enter the correct day");
      }
    } else {
      if (day === "Monday") {
        if (from === "a" || to === "a") {
          officehour.Monday[0].from = "--";
          officehour.Monday[0].to = "--";
          await officehour.save();
        } else {
          if (officehour.Monday[0].day === "Monday") {
            if (officehour.Monday[0].from === "--" && from != "--") {
              officehour.Monday[0].from = from;
              officehour.Monday[0].to = from;
              await officehour.save();
              res.send(officehour);
            } else if (to === "--" && officehour.Monday[0].from != "--") {
              officehour.Monday[0].from = from;
              officehour.Monday[0].to = from;
              await officehour.save();
              res.send(officehour);
            } else if (to != "--" && officehour.Monday[0].from === "--") {
              res.status(400).send("please select the from time first");
            } else if (to != "--" && officehour.Monday[0].from != "--") {
              if (officehour.Monday[0].from.charAt(0) <= to.charAt(0)) {
                if (officehour.Monday[0].from.charAt(1) <= to.charAt(1)) {
                  if (officehour.Monday[0].from.charAt(3) <= to.charAt(3)) {
                    if (officehour.Monday[0].from.charAt(4) <= to.charAt(4)) {
                      officehour.Monday[0].to = to;
                      await officehour.save();
                      console.log("first");
                      res.send(officehour);
                    } else {
                      res.status(400).send("to time less than from time");
                    }
                  } else {
                    res.status(400).send("to time less than from time");
                  }
                } else {
                  res.status(400).send("to time less than from time");
                }
              } else {
                res.status(400).send("to time less than from time");
              }
            } else {
              res.status(400).send("error");
            }
          }
        }
      } else if (day === "Tuesday") {
        if (from === "a" || to === "a") {
          officehour.Tuesday[0].from = "--";
          officehour.Tuesday[0].to = "--";
          await officehour.save();
          res.send(officehour);
        } else {
          if (officehour.Tuesday[0].day === "Tuesday") {
            if (officehour.Tuesday[0].from === "--" && from != "--") {
              officehour.Tuesday[0].from = from;
              officehour.Tuesday[0].to = from;
              await officehour.save();
              res.send(officehour);
            } else if (to === "--" && officehour.Tuesday[0].from != "--") {
              officehour.Tuesday[0].from = from;
              officehour.Tuesday[0].to = from;
              await officehour.save();
              res.send(officehour);
            } else if (to != "--" && officehour.Tuesday[0].from === "--") {
              res.status(400).send("please select the from time first");
            } else if (to != "--" && officehour.Tuesday[0].from != "--") {
              if (officehour.Tuesday[0].from.charAt(0) <= to.charAt(0)) {
                if (officehour.Tuesday[0].from.charAt(1) <= to.charAt(1)) {
                  if (officehour.Tuesday[0].from.charAt(3) <= to.charAt(3)) {
                    if (officehour.Tuesday[0].from.charAt(4) <= to.charAt(4)) {
                      officehour.Tuesday[0].to = to;
                      await officehour.save();
                      console.log("first");
                      res.send(officehour);
                    } else {
                      res.status(400).send("to time less than from time");
                    }
                  } else {
                    res.status(400).send("to time less than from time");
                  }
                } else {
                  res.status(400).send("to time less than from time");
                }
              } else {
                res.status(400).send("to time less than from time");
              }
            } else {
              res.status(400).send("error");
            }
          }
        }
      } else if (day === "Wednesday") {
        if (from === "a" || to === "a") {
          officehour.Wednesday[0].from = "--";
          officehour.Wednesday[0].to = "--";
          await officehour.save();
        } else {
          if (officehour.Wednesday[0].day === "Wednesday") {
            if (officehour.Wednesday[0].from === "--" && from != "--") {
              officehour.Wednesday[0].from = from;
              officehour.Wednesday[0].to = from;
              await officehour.save();
              res.send(officehour);
            } else if (to === "--" && officehour.Wednesday[0].from != "--") {
              officehour.Wednesday[0].from = from;
              officehour.Wednesday[0].to = from;
              await officehour.save();
              res.send(officehour);
            } else if (to != "--" && officehour.Wednesday[0].from === "--") {
              res.status(400).send("please select the from time first");
            } else if (to != "--" && officehour.Wednesday[0].from != "--") {
              if (officehour.Wednesday[0].from.charAt(0) <= to.charAt(0)) {
                if (officehour.Wednesday[0].from.charAt(1) <= to.charAt(1)) {
                  if (officehour.Wednesday[0].from.charAt(3) <= to.charAt(3)) {
                    if (
                      officehour.Wednesday[0].from.charAt(4) <= to.charAt(4)
                    ) {
                      officehour.Wednesday[0].to = to;
                      await officehour.save();
                      console.log("first");
                      res.send(officehour);
                    } else {
                      res.status(400).send("to time less than from time");
                    }
                  } else {
                    res.status(400).send("to time less than from time");
                  }
                } else {
                  res.status(400).send("to time less than from time");
                }
              } else {
                res.status(400).send("to time less than from time");
              }
            } else {
              res.status(400).send("error");
            }
          }
        }
      } else if (day === "Thursday") {
        if (from === "a" || to === "a") {
          officehour.Thursday[0].from = "--";
          officehour.Thursday[0].to = "--";
          await officehour.save();
        } else {
          if (officehour.Thursday[0].day === "Thursday") {
            if (officehour.Thursday[0].from === "--" && from != "--") {
              officehour.Thursday[0].from = from;
              officehour.Thursday[0].to = from;

              await officehour.save();
              res.send(officehour);
            } else if (to === "--" && officehour.Thursday[0].from != "--") {
              officehour.Thursday[0].from = from;
              officehour.Thursday[0].to = from;
              await officehour.save();
              res.send(officehour);
            } else if (to != "--" && officehour.Thursday[0].from === "--") {
              res.status(400).send("please select the from time first");
            } else if (to != "--" && officehour.Thursday[0].from != "--") {
              if (officehour.Thursday[0].from.charAt(0) <= to.charAt(0)) {
                if (officehour.Thursday[0].from.charAt(1) <= to.charAt(1)) {
                  if (officehour.Thursday[0].from.charAt(3) <= to.charAt(3)) {
                    if (officehour.Thursday[0].from.charAt(4) <= to.charAt(4)) {
                      officehour.Thursday[0].to = to;
                      await officehour.save();
                      console.log("first");
                      res.send(officehour);
                    } else {
                      res.status(400).send("to time less than from time");
                    }
                  } else {
                    res.status(400).send("to time less than from time");
                  }
                } else {
                  res.status(400).send("to time less than from time");
                }
              } else {
                res.status(400).send("to time less than from time");
              }
            } else {
              res.status(400).send("error");
            }
          }
        }
      } else if (day === "Friday") {
        if (from === "a" || to === "a") {
          officehour.Friday[0].from = "--";
          officehour.Friday[0].to = "--";
          await officehour.save();
        } else {
          if (officehour.Friday[0].day === "Friday") {
            if (officehour.Friday[0].from === "--" && from != "--") {
              officehour.Friday[0].from = from;
              officehour.Friday[0].to = to;
              await officehour.save();
              res.send(officehour);
            } else if (to === "--" && officehour.Friday[0].from != "--") {
              officehour.Friday[0].from = from;
              officehour.Friday[0].to = from;
              await officehour.save();
              res.send(officehour);
            } else if (to != "--" && officehour.Friday[0].from === "--") {
              res.status(400).send("please select the from time first");
            } else if (to != "--" && officehour.Friday[0].from != "--") {
              if (officehour.Friday[0].from.charAt(0) <= to.charAt(0)) {
                if (officehour.Friday[0].from.charAt(1) <= to.charAt(1)) {
                  if (officehour.Friday[0].from.charAt(3) <= to.charAt(3)) {
                    if (officehour.Friday[0].from.charAt(4) <= to.charAt(4)) {
                      officehour.Friday[0].to = to;
                      await officehour.save();
                      console.log("first");
                      res.send(officehour);
                    } else {
                      res.status(400).send("to time less than from time");
                    }
                  } else {
                    res.status(400).send("to time less than from time");
                  }
                } else {
                  res.status(400).send("to time less than from time");
                }
              } else {
                res.status(400).send("to time less than from time");
              }
            } else {
              res.status(400).send("error");
            }
          }
          // else{
          //   await officehour.addFriday(day,from,to);
          //   await officehour.save()
          //   res.send(officehour)
          // }
        }
      } else {
        res.status(400).send("please enter the correct day");
      }
    }
  }
);
//get office hours
router.get("/officehour", S_authenticate, async (req, res) => {
  const user = req.rootuser;
  const { batch } = user;
  const data = await OfficeHour.findOne({ batch });
  if (!data) {
    res.send("error");
  } else {
    res.send(data);
  }
});
//get office hour for batch advisor
router.get("/officehours", BA_authenticate, async (req, res) => {
  const user = req.rootuser;
  const { batch } = user;
  const data = await OfficeHour.findOne({ batch });
  if (!data) {
    res.send("error");
  } else {
    res.send(data);
  }
});
//--------------------------------ChatBox-----------
//student chatbox
router.post("/createchat", S_authenticate, async (req, res) => {
  const { subject, message } = req.body;
  const user = req.rootuser;
  const { registrationId, name, batch } = user;
  const record = await S_ChatBox.findOne({ registrationId, subject });
  if (!record) {
    //save in student side
    const S_message = new S_ChatBox({
      registrationId,
      batch,
      subject,
    });
    await S_message.S_chatbox(name, message);
    await S_message.save();
    //save in teacherSchema
    const BA_message = new BA_ChatBox({
      registrationId,
      batch,
      subject,
    });
    await BA_message.BA_chatbox(name, message);
    await BA_message.save();
    res.send(S_message);
  } else {
    res.send("from this subject and registration already chat exit");
  }
});
//Student send message with in subject
router.post(
  "/S_sendmessage/:subject/:message",
  S_authenticate,
  async (req, res) => {
    const { subject, message } = req.params;
    console.log(subject, message, "fbdsfndsmf dsfbdsfdsbfd");
    const user = req.rootuser;
    const { registrationId, name, batch } = user;
    // for student
    const S_record = await S_ChatBox.findOne({ registrationId, subject });
    if (!S_record) {
      res.send("your Subject is incorrect");
    } else {
      await S_record.S_chatbox(name, message);
      await S_record.save();
      //for batchadvisor schema
      const BA_record = await BA_ChatBox.findOne({ registrationId, subject });
      if (!BA_record) {
        const BA_message = new BA_ChatBox({
          registrationId,
          batch,
          subject,
        });
        await BA_message.BA_chatbox(name, message);
        await BA_message.save();
      } else {
        await BA_record.BA_chatbox(name, message);
        await BA_record.save();
      }
      res.status(200).send("added");
    }
  }
);
//batchadvisor view message
router.get("/BA_viewmessages", BA_authenticate, async (req, res) => {
  try {
    const user = req.rootuser;
    const { batch } = user;
    const BA_record = await BA_ChatBox.find({ batch });
    if (!BA_record) {
      res.status(400).send("error");
    } else {
      res.status(200).send(BA_record);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//batchadvisor view specific  message
router.get(
  "/BA_viewmessages/:registrationId/:subject",
  BA_authenticate,
  async (req, res) => {
    try {
      const user = req.rootuser;
      const { batch } = user;
      const { registrationId, subject } = req.params;
      const BA_record = await BA_ChatBox.find({ batch });
      if (!BA_record) {
        res.status(400).send("error");
      } else {
        const BA_message = await BA_ChatBox.findOne({
          registrationId,
          subject,
        });
        if (!BA_message) {
          res.send("no record found");
        } else {
          res.send(BA_message.chat);
        }
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
);
//student view message
router.get("/S_viewmessage", S_authenticate, async (req, res) => {
  try {
    const user = req.rootuser;
    const { registrationId } = user;
    const S_record = await S_ChatBox.find({ registrationId });
    if (!S_record) {
      res.status(400).send("error");
    } else {
      res.status(200).send(S_record);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//student view specific message
router.get("/S_viewmessage/:subject", S_authenticate, async (req, res) => {
  try {
    const user = req.rootuser;
    const { subject } = req.params;
    const { registrationId } = user;
    const S_record = await S_ChatBox.findOne({ registrationId, subject });
    if (!S_record) {
      res.status(400).send("error");
    } else {
      res.status(200).send(S_record.chat);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
//batchadvisor reply student message
router.post(
  "/BA_messageReply/:registrationId/:subject/:message",
  BA_authenticate,
  async (req, res) => {
    const { registrationId, subject, message } = req.params;
    // const { message } = req.body;
    const user = req.rootuser;
    const { name, batch } = user;
    const BA_record = await BA_ChatBox.findOne({ registrationId, subject });
    if (!BA_record) {
      res.status(400).send("no record found");
    } else {
      // console.log(name);
      await BA_record.BA_chatbox(name, message);
      await BA_record.save();
      const S_record = await S_ChatBox.findOne({ registrationId, subject });
      if (!S_record) {
        const S_create = new S_ChatBox({
          registrationId,
          subject,
          batch,
        });
        await S_create.S_chatbox(name, message);
        await S_create.save();
      } else {
        await S_record.S_chatbox(name, message);
        await S_record.save();
      }
      res.status(200).send("message send");
    }
  }
);
//delete chatbox Student
router.delete("/S_deleteChat/:subject", S_authenticate, async (req, res) => {
  //can also use id
  const { subject } = req.params;
  const { registrationId } = req.rootuser;
  const record = await S_ChatBox.findOne({ registrationId, subject });
  if (!record) {
    res.status(400).send("no record found");
  } else {
    await record.delete();
    res.send("deleted");
  }
});
//delete chatbox BAtch Advisor
router.delete(
  "/BA_deleteChat/:registrationId/:subject",
  BA_authenticate,
  async (req, res) => {
    //can also use id
    const { subject, registrationId } = req.params;
    console.log(subject, registrationId);
    const record = await BA_ChatBox.findOne({ registrationId, subject });
    if (!record) {
      res.status(400).send("no record found");
    } else {
      await record.delete();
      res.send("deleted");
    }
  }
);
//----------------------------------------ADD,Drop,Freeze requests------------------------------
//get data of approve request
router.get("/approvedRequest", async (req, res) => {
  const record = await ApprovedRequest.find();
  if (!record) {
    res.status(400).send("no record found");
  } else {
    res.send(record);
  }
});
//delete specific approved request
router.delete("/delete/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id, "gfdsf");
    const record = await ApprovedRequest.findByIdAndDelete({ _id: _id });
    if (!record) {
      res.send("no deleted");
    } else {
      res.send("deleted");
    }
  } catch (error) {
    res.send(error);
  }
});
//  1. create the schema
//  2. post the data in schema
//  3. get all the data in schema

//--------------------------------------------SCHEME OF STUDY---------------------------------------

//post the data
router.post("/sos", async (req, res) => {
  try {
    const record = await SOS.findOne({ courseName: req.body.courseName });
    if (!record) {
      const student = await SOS.create(req.body);
      // const student = new SOS({
      //   courseCode,
      //   courseName,
      //   credits,
      //   semester,
      // });
      // await student.prereq(course);
      // await student.save();
      res.status(200).send(student);
    } else {
      res.send("this course already added");
    }
  } catch (error) {
    console.log(error);
  }
});
//get all courses of sos
router.get("/sos_courses", async (req, res) => {
  const courses = await SOS.find();
  if (!courses) {
    res.send("no record found");
  } else {
    res.send(courses);
  }
});
//ELECTIVE COURSES
router.post("/ELECTIVE_COURSES", async (req, res) => {
  try {
    const record = await ElectiveCourse.findOne({
      courseName: req.body.courseName,
    });
    if (!record) {
      const student = await ElectiveCourse.create(req.body);
      res.status(200).send(student);
    } else {
      res.send("this course already added");
    }
  } catch (error) {
    console.log(error);
  }
});
//-----------------courses that student can add--------------
router.get("/courses_that_added", S_authenticate, async (req, res) => {
  try {
    const student = req.rootuser;
    const { semester, registrationId } = student;
    // const semester=2;
    if (semester === 1) {
      const courses = [];
      res.send(courses);

      // res.send("you do not add any course");
    } else if (semester === 2) {
      const semes1 = 1;
      const semes2 = 2;
      const semester1 = await SOS.find({ semester: semes1 });
      const semester2 = await SOS.find({ semester: semes2 });
      const sos_courses = semester1.concat(semester2);

      const std_sems1 = req.rootuserSemester1;
      const std_sems2 = req.rootuserSemester2;
      const std_courses = std_sems1.concat(std_sems2);
      //check courses that student drop or withdraw
      for (let i = 0; i < std_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[j].courseName === std_courses[i].courseName) {
            await sos_courses.splice(j, 1);
          }
        }
      }
      //check prerequsite which they drop or withdraw
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //check courses that have gpa less tha 2
      let data1 = [];
      for (let i = 0; i < std_courses.length; i++) {
        if (std_courses[i].gp < 2) {
          await data1.push(std_courses[i]);
        }
      }
      //remove courses that student repeat and less marks course remove
      for (let i = 0; i < data1.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (data1[i].courseCode === std_courses[j].courseCode) {
            if (data1[i].marks != std_courses[j].marks) {
              console.log(data1[i].courseName);
              if (data1[i].marks < std_courses[j].marks) {
                await data1.splice(i, 1);
              }
            }
          }
        }
      }
      //check prerequsite in which they fail
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          console.log(std_courses[j].courseCode);
          if (
            sos_courses[i].prerequisite[0].course === std_courses[j].courseCode
          ) {
            if (std_courses[j].gp < 1.3) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //concat and display all courses that student add
      const courses = sos_courses.concat(data1);
      //courses that are in pendingAddcourse that also remove from courses
      const pending = await PendingAddCourse.findOne({ registrationId });
      if (!pending) {
        res.send(courses);
      } else {
        for (let i = 0; i < courses.length; i++) {
          for (let j = 0; j < pending.courses.length; j++) {
            if (courses[i].courseName === pending.courses[j].courseName) {
              await courses.splice(i, 1);
            }
          }
        }
        res.send(courses);
      }
    } else if (semester === 3) {
      const semes1 = 1;
      const semes2 = 2;
      const semes3 = 3;
      const semester1 = await SOS.find({ semester: semes1 });
      const semester2 = await SOS.find({ semester: semes2 });
      const semester3 = await SOS.find({ semester: semes3 });
      const sos_courses = semester1.concat(semester2, semester3);

      const std_sems1 = req.rootuserSemester1;
      const std_sems2 = req.rootuserSemester2;
      const std_sems3 = req.rootuserSemester3;
      const std_courses = std_sems1.concat(std_sems2, std_sems3);
      //courses that student drop aur withdraw
      for (let i = 0; i < std_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[j].courseName === std_courses[i].courseName) {
            await sos_courses.splice(j, 1);
          }
        }
      }
      //check prerequsite which they drop or withdraw
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //courses that have gpa less than 2
      let data1 = [];
      for (let i = 0; i < std_courses.length; i++) {
        if (std_courses[i].gp < 2) {
          console.log(i);
          await data1.push(std_courses[i]);
        }
      }
      //remove courses that student repeat and less marks course remove
      for (let i = 0; i < data1.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (data1[i].courseCode === std_courses[j].courseCode) {
            if (data1[i].marks != std_courses[j].marks) {
              console.log(data1[i].courseName);
              if (data1[i].marks < std_courses[j].marks) {
                await data1.splice(i, 1);
              }
            }
          }
        }
      }
      //check prerequsite in which they are fail
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          console.log(std_courses[j].courseCode);
          if (
            sos_courses[i].prerequisite[0].course === std_courses[j].courseCode
          ) {
            if (std_courses[j].gp < 1.3) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //concat and display all courses that can be add
      const courses = sos_courses.concat(data1);
      //courses that are in pendingAddcourse that also remove from courses
      const pending = await PendingAddCourse.findOne({ registrationId });
      if (!pending) {
        res.send(courses);
      } else {
        for (let i = 0; i < courses.length; i++) {
          for (let j = 0; j < pending.courses.length; j++) {
            if (courses[i].courseName === pending.courses[j].courseName) {
              await courses.splice(i, 1);
            }
          }
        }
        res.send(courses);
      }
    } else if (semester === 4) {
      const semes1 = 1;
      const semes2 = 2;
      const semes3 = 3;
      const semes4 = 4;
      const semester1 = await SOS.find({ semester: semes1 });
      const semester2 = await SOS.find({ semester: semes2 });
      const semester3 = await SOS.find({ semester: semes3 });
      const semester4 = await SOS.find({ semester: semes4 });
      const sos_courses = semester1.concat(semester2, semester3, semester4);

      const std_sems1 = req.rootuserSemester1;
      const std_sems2 = req.rootuserSemester2;
      const std_sems3 = req.rootuserSemester3;
      const std_sems4 = req.rootuserSemester4;
      const std_courses = std_sems1.concat(std_sems2, std_sems3, std_sems4);
      //check courses that student drop or withdraw
      for (let i = 0; i < std_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[j].courseName === std_courses[i].courseName) {
            await sos_courses.splice(j, 1);
          }
        }
      }
      //check prerequsite which they drop or withdraw
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //check courses that gp is less than 2
      let data1 = [];
      for (let i = 0; i < std_courses.length; i++) {
        if (std_courses[i].gp < 2) {
          await data1.push(std_courses[i]);
        }
      }
      //remove courses that student repeat and less marks course remove
      for (let i = 0; i < data1.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (data1[i].courseCode === std_courses[j].courseCode) {
            if (data1[i].marks != std_courses[j].marks) {
              console.log(data1[i].courseName);
              if (data1[i].marks < std_courses[j].marks) {
                await data1.splice(i, 1);
              }
            }
          }
        }
      }
      //check prerequsite
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          console.log(std_courses[j].courseCode);
          if (
            sos_courses[i].prerequisite[0].course === std_courses[j].courseCode
          ) {
            if (std_courses[j].gp < 1.3) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //concat and display courses than can add
      const courses = sos_courses.concat(data1);
      //courses that are in pendingAddcourse that also remove from courses
      const pending = await PendingAddCourse.findOne({ registrationId });
      if (!pending) {
        res.send(courses);
      } else {
        for (let i = 0; i < courses.length; i++) {
          for (let j = 0; j < pending.courses.length; j++) {
            if (courses[i].courseName === pending.courses[j].courseName) {
              await courses.splice(i, 1);
            }
          }
        }
        res.send(courses);
      }
    } else if (semester === 5) {
      const semes1 = 1;
      const semes2 = 2;
      const semes3 = 3;
      const semes4 = 4;
      const semes5 = 5;
      const semester1 = await SOS.find({ semester: semes1 });
      const semester2 = await SOS.find({ semester: semes2 });
      const semester3 = await SOS.find({ semester: semes3 });
      const semester4 = await SOS.find({ semester: semes4 });
      const semester5 = await SOS.find({ semester: semes5 });
      const sos_courses = semester1.concat(
        semester2,
        semester3,
        semester4,
        semester5
      );
      const std_sems1 = req.rootuserSemester1;
      const std_sems2 = req.rootuserSemester2;
      const std_sems3 = req.rootuserSemester3;
      const std_sems4 = req.rootuserSemester4;
      const std_sems5 = req.rootuserSemester5;
      const std_courses = std_sems1.concat(
        std_sems2,
        std_sems3,
        std_sems4,
        std_sems5
      );
      //check courses that student drop or withdraw
      for (let i = 0; i < std_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[j].courseName === std_courses[i].courseName) {
            await sos_courses.splice(j, 1);
          }
        }
      }
      //check prerequsite which they drop or withdraw
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //check courses that gp is less than 2
      let data1 = [];
      for (let i = 0; i < std_courses.length; i++) {
        if (std_courses[i].gp < 2) {
          console.log(i);
          await data1.push(std_courses[i]);
        }
      }
      //remove courses that student repeat and less marks course remove
      for (let i = 0; i < data1.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (data1[i].courseCode === std_courses[j].courseCode) {
            if (data1[i].marks != std_courses[j].marks) {
              console.log(data1[i].courseName);
              if (data1[i].marks < std_courses[j].marks) {
                await data1.splice(i, 1);
              }
            }
          }
        }
      }
      //remove names of elective from sos
      for (let i = 0; i < sos_courses.length; i++) {
        if (sos_courses[i].courseCode === "--") {
          await sos_courses.splice(i, 1);
          i--;
        }
      }
      //clear prerequisite in which student fail
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (
            sos_courses[i].prerequisite[0].course === std_courses[j].courseCode
          ) {
            if (std_courses[j].gp < 1.3) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //elective courses
      const elective = await ElectiveCourse.find();
      let elec = 0;
      for (let i = 0; i < std_sems5.length; i++) {
        for (let j = 0; j < elective.length; j++) {
          if (std_sems5[i].courseName === elective[j].courseName) {
            elec = elec + 1;
          }
        }
      }
      //concat and display all courses that student add
      if (elec === 0) {
        //clear prerequisite for elective cources
        for (let i = 0; i < elective.length; i++) {
          for (let j = 0; j < std_courses.length; j++) {
            if (elective[i].prerequisite.length === 1) {
              if (
                elective[i].prerequisite[0].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            } else if (elective[i].prerequisite.length === 2) {
              if (
                elective[i].prerequisite[0].course ===
                  std_courses[j].courseCode ||
                elective[i].prerequisite[1].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            }
          }
        }
        const courses = sos_courses.concat(data1, elective);
        //courses that are in pendingAddcourse that also remove from courses
        const pending = await PendingAddCourse.findOne({ registrationId });
        if (!pending) {
          res.send(courses);
        } else {
          for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < pending.courses.length; j++) {
              if (courses[i].courseName === pending.courses[j].courseName) {
                await courses.splice(i, 1);
              }
            }
          }
          res.send(courses);
        }
      } else {
        const courses = sos_courses.concat(data1);
        //courses that are in pendingAddcourse that also remove from courses
        const pending = await PendingAddCourse.findOne({ registrationId });
        if (!pending) {
          res.send(courses);
        } else {
          for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < pending.courses.length; j++) {
              if (courses[i].courseName === pending.courses[j].courseName) {
                await courses.splice(i, 1);
              }
            }
          }
          res.send(courses);
        }
      }
    } else if (semester === 6) {
      const semes1 = 1;
      const semes2 = 2;
      const semes3 = 3;
      const semes4 = 4;
      const semes5 = 5;
      const semes6 = 6;
      const semester1 = await SOS.find({ semester: semes1 });
      const semester2 = await SOS.find({ semester: semes2 });
      const semester3 = await SOS.find({ semester: semes3 });
      const semester4 = await SOS.find({ semester: semes4 });
      const semester5 = await SOS.find({ semester: semes5 });
      const semester6 = await SOS.find({ semester: semes6 });

      const sos_courses = semester1.concat(
        semester2,
        semester3,
        semester4,
        semester5,
        semester6
      );
      const std_sems1 = req.rootuserSemester1;
      const std_sems2 = req.rootuserSemester2;
      const std_sems3 = req.rootuserSemester3;
      const std_sems4 = req.rootuserSemester4;
      const std_sems5 = req.rootuserSemester5;
      const std_sems6 = req.rootuserSemester6;

      const std_courses = std_sems1.concat(
        std_sems2,
        std_sems3,
        std_sems4,
        std_sems5,
        std_sems6
      );
      //check courses that student drop or withdraw
      for (let i = 0; i < std_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[j].courseName === std_courses[i].courseName) {
            await sos_courses.splice(j, 1);
          }
        }
      }
      //check prerequsite which they drop or withdraw
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //check courses that gp is less than 2
      let data1 = [];
      for (let i = 0; i < std_courses.length; i++) {
        if (std_courses[i].gp < 2) {
          console.log(i);
          await data1.push(std_courses[i]);
        }
      }
      //remove courses that student repeat and less marks course remove
      for (let i = 0; i < data1.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (data1[i].courseCode === std_courses[j].courseCode) {
            if (data1[i].marks != std_courses[j].marks) {
              console.log(data1[i].courseName);
              if (data1[i].marks < std_courses[j].marks) {
                await data1.splice(i, 1);
              }
            }
          }
        }
      }
      //remove names of elective from sos
      for (let i = 0; i < sos_courses.length; i++) {
        if (sos_courses[i].courseCode === "--") {
          await sos_courses.splice(i, 1);
          i--;
        }
      }
      //clear prerequisite in which student fail
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          }
        }
      }
      //elective courses
      const elective = await ElectiveCourse.find();
      let elec = 0;
      const std_sems = std_sems5.concat(std_sems6);
      for (let i = 0; i < std_sems.length; i++) {
        for (let j = 0; j < elective.length; j++) {
          if (std_sems[i].courseName === elective[j].courseName) {
            await elective.splice[(j, 1)];
            elec = elec + 1;
          }
        }
      }
      //concat and display all courses that student add
      if (elec === 3) {
        const courses = sos_courses.concat(data1);
        //courses that are in pendingAddcourse that also remove from courses
        const pending = await PendingAddCourse.findOne({ registrationId });
        if (!pending) {
          res.send(courses);
        } else {
          for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < pending.courses.length; j++) {
              if (courses[i].courseName === pending.courses[j].courseName) {
                await courses.splice(i, 1);
              }
            }
          }
          res.send(courses);
        }
      } else {
        //clear prerequisite for elective cources
        for (let i = 0; i < elective.length; i++) {
          for (let j = 0; j < std_courses.length; j++) {
            if (elective[i].prerequisite.length === 1) {
              if (
                elective[i].prerequisite[0].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            } else if (elective[i].prerequisite.length === 2) {
              if (
                elective[i].prerequisite[0].course ===
                  std_courses[j].courseCode ||
                elective[i].prerequisite[1].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            }
          }
        }
        const courses = sos_courses.concat(data1, elective);
        //courses that are in pendingAddcourse that also remove from courses
        const pending = await PendingAddCourse.findOne({ registrationId });
        if (!pending) {
          res.send(courses);
        } else {
          for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < pending.courses.length; j++) {
              if (courses[i].courseName === pending.courses[j].courseName) {
                await courses.splice(i, 1);
              }
            }
          }
          res.send(courses);
        }
      }
    } else if (semester === 7) {
      const semes1 = 1;
      const semes2 = 2;
      const semes3 = 3;
      const semes4 = 4;
      const semes5 = 5;
      const semes6 = 6;
      const semes7 = 7;

      const semester1 = await SOS.find({ semester: semes1 });
      const semester2 = await SOS.find({ semester: semes2 });
      const semester3 = await SOS.find({ semester: semes3 });
      const semester4 = await SOS.find({ semester: semes4 });
      const semester5 = await SOS.find({ semester: semes5 });
      const semester6 = await SOS.find({ semester: semes6 });
      const semester7 = await SOS.find({ semester: semes7 });

      const sos_courses = semester1.concat(
        semester2,
        semester3,
        semester4,
        semester5,
        semester6,
        semester7
      );
      const std_sems1 = req.rootuserSemester1;
      const std_sems2 = req.rootuserSemester2;
      const std_sems3 = req.rootuserSemester3;
      const std_sems4 = req.rootuserSemester4;
      const std_sems5 = req.rootuserSemester5;
      const std_sems6 = req.rootuserSemester6;
      const std_sems7 = req.rootuserSemester7;

      const std_courses = std_sems1.concat(
        std_sems2,
        std_sems3,
        std_sems4,
        std_sems5,
        std_sems6,
        std_sems7
      );
      //check courses that student drop or withdraw
      for (let i = 0; i < std_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[j].courseName === std_courses[i].courseName) {
            await sos_courses.splice(j, 1);
          }
        }
      }
      //check prerequsite which they drop or withdraw
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //check courses that gp is less than 2
      let data1 = [];
      for (let i = 0; i < std_courses.length; i++) {
        if (std_courses[i].gp < 2) {
          console.log(i);
          await data1.push(std_courses[i]);
        }
      }
      //remove courses that student repeat and less marks course remove
      for (let i = 0; i < data1.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (data1[i].courseCode === std_courses[j].courseCode) {
            if (data1[i].marks != std_courses[j].marks) {
              console.log(data1[i].courseName);
              if (data1[i].marks < std_courses[j].marks) {
                await data1.splice(i, 1);
              }
            }
          }
        }
      }
      //remove names of elective from sos
      for (let i = 0; i < sos_courses.length; i++) {
        if (sos_courses[i].courseCode === "--") {
          await sos_courses.splice(i, 1);
          i--;
        }
      }
      //clear prerequisite
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          }
        }
      }
      //elective courses
      const elective = await ElectiveCourse.find();
      let elec = 0;
      const std_sems = std_sems5.concat(std_sems6, std_sems7);
      for (let i = 0; i < std_sems.length; i++) {
        for (let j = 0; j < elective.length; j++) {
          if (std_sems[i].courseName === elective[j].courseName) {
            await elective.splice[(j, 1)];
            elec = elec + 1;
          }
        }
      }
      if (elec === 5) {
        const courses = sos_courses.concat(data1);
        //courses that are in pendingAddcourse that also remove from courses
        const pending = await PendingAddCourse.findOne({ registrationId });
        if (!pending) {
          res.send(courses);
        } else {
          for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < pending.courses.length; j++) {
              if (courses[i].courseName === pending.courses[j].courseName) {
                await courses.splice(i, 1);
              }
            }
          }
          res.send(courses);
        }
      } else {
        //clear prerequisite for elective cources
        for (let i = 0; i < elective.length; i++) {
          for (let j = 0; j < std_courses.length; j++) {
            if (elective[i].prerequisite.length === 1) {
              if (
                elective[i].prerequisite[0].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            } else if (elective[i].prerequisite.length === 2) {
              if (
                elective[i].prerequisite[0].course ===
                  std_courses[j].courseCode ||
                elective[i].prerequisite[1].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            }
          }
        }
        const courses = sos_courses.concat(data1, elective);
        //courses that are in pendingAddcourse that also remove from courses
        const pending = await PendingAddCourse.findOne({ registrationId });
        if (!pending) {
          res.send(courses);
        } else {
          for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < pending.courses.length; j++) {
              if (courses[i].courseName === pending.courses[j].courseName) {
                await courses.splice(i, 1);
              }
            }
          }
          res.send(courses);
        }
      }
    } else if (semester === 8) {
      const semes1 = 1;
      const semes2 = 2;
      const semes3 = 3;
      const semes4 = 4;
      const semes5 = 5;
      const semes6 = 6;
      const semes7 = 7;
      const semes8 = 8;

      const semester1 = await SOS.find({ semester: semes1 });
      const semester2 = await SOS.find({ semester: semes2 });
      const semester3 = await SOS.find({ semester: semes3 });
      const semester4 = await SOS.find({ semester: semes4 });
      const semester5 = await SOS.find({ semester: semes5 });
      const semester6 = await SOS.find({ semester: semes6 });
      const semester7 = await SOS.find({ semester: semes7 });
      const semester8 = await SOS.find({ semester: semes8 });

      const sos_courses = semester1.concat(
        semester2,
        semester3,
        semester4,
        semester5,
        semester6,
        semester7,
        semester8
      );
      const std_sems1 = req.rootuserSemester1;
      const std_sems2 = req.rootuserSemester2;
      const std_sems3 = req.rootuserSemester3;
      const std_sems4 = req.rootuserSemester4;
      const std_sems5 = req.rootuserSemester5;
      const std_sems6 = req.rootuserSemester6;
      const std_sems7 = req.rootuserSemester7;
      const std_sems8 = req.rootuserSemester8;

      const std_courses = std_sems1.concat(
        std_sems2,
        std_sems3,
        std_sems4,
        std_sems5,
        std_sems6,
        std_sems7,
        std_sems8
      );
      //check courses that student drop or withdraw
      for (let i = 0; i < std_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[j].courseName === std_courses[i].courseName) {
            await sos_courses.splice(j, 1);
          }
        }
      }
      //check prerequsite which they drop or withdraw
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //check courses that gp is less than 2
      let data1 = [];
      for (let i = 0; i < std_courses.length; i++) {
        if (std_courses[i].gp < 2) {
          await data1.push(std_courses[i]);
        }
      }
      //remove courses that student repeat and less marks course remove
      for (let i = 0; i < data1.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (data1[i].courseCode === std_courses[j].courseCode) {
            if (data1[i].marks != std_courses[j].marks) {
              console.log(data1[i].courseName);
              if (data1[i].marks < std_courses[j].marks) {
                await data1.splice(i, 1);
              }
            }
          }
        }
      }
      //remove courses that student repeat and less marks course remove
      for (let i = 0; i < data1.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (data1[i].courseCode === std_courses[j].courseCode) {
            if (data1[i].marks != std_courses[j].marks) {
              console.log(data1[i].courseName);
              if (data1[i].marks < std_courses[j].marks) {
                await data1.splice(i, 1);
              }
            }
          }
        }
      }
      //remove names of elective from sos
      for (let i = 0; i < sos_courses.length; i++) {
        if (sos_courses[i].courseCode === "--") {
          await sos_courses.splice(i, 1);
          i--;
        }
      }
      //clear prerequisite
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          }
        }
      }
      //elective courses
      const elective = await ElectiveCourse.find();
      let elec = 0;
      const std_sems = std_sems5.concat(std_sems6, std_sems7, std_sems8);
      for (let i = 0; i < std_sems.length; i++) {
        for (let j = 0; j < elective.length; j++) {
          if (std_sems[i].courseName === elective[j].courseName) {
            await elective.splice[(j, 1)];
            elec = elec + 1;
          }
        }
      }
      if (elec === 5) {
        const courses = sos_courses.concat(data1);
        //courses that are in pendingAddcourse that also remove from courses
        const pending = await PendingAddCourse.findOne({ registrationId });
        if (!pending) {
          res.send(courses);
        } else {
          for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < pending.courses.length; j++) {
              if (courses[i].courseName === pending.courses[j].courseName) {
                await courses.splice(i, 1);
              }
            }
          }
          res.send(courses);
        }
      } else {
        //clear prerequisite for elective cources
        for (let i = 0; i < elective.length; i++) {
          for (let j = 0; j < std_courses.length; j++) {
            if (elective[i].prerequisite.length === 1) {
              if (
                elective[i].prerequisite[0].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            } else if (elective[i].prerequisite.length === 2) {
              if (
                elective[i].prerequisite[0].course ===
                  std_courses[j].courseCode ||
                elective[i].prerequisite[1].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            }
          }
        }
        const courses = sos_courses.concat(data1, elective);
        //courses that are in pendingAddcourse that also remove from courses
        const pending = await PendingAddCourse.findOne({ registrationId });
        if (!pending) {
          res.send(courses);
        } else {
          for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < pending.courses.length; j++) {
              if (courses[i].courseName === pending.courses[j].courseName) {
                await courses.splice(i, 1);
              }
            }
          }
          res.send(courses);
        }
      }
    } else if (semester === 9) {
      const semes1 = 1;
      const semes2 = 2;
      const semes3 = 3;
      const semes4 = 4;
      const semes5 = 5;
      const semes6 = 6;
      const semes7 = 7;
      const semes8 = 8;

      const semester1 = await SOS.find({ semester: semes1 });
      const semester2 = await SOS.find({ semester: semes2 });
      const semester3 = await SOS.find({ semester: semes3 });
      const semester4 = await SOS.find({ semester: semes4 });
      const semester5 = await SOS.find({ semester: semes5 });
      const semester6 = await SOS.find({ semester: semes6 });
      const semester7 = await SOS.find({ semester: semes7 });
      const semester8 = await SOS.find({ semester: semes8 });

      const sos_courses = semester1.concat(
        semester2,
        semester3,
        semester4,
        semester5,
        semester6,
        semester7,
        semester8
      );
      const std_sems1 = req.rootuserSemester1;
      const std_sems2 = req.rootuserSemester2;
      const std_sems3 = req.rootuserSemester3;
      const std_sems4 = req.rootuserSemester4;
      const std_sems5 = req.rootuserSemester5;
      const std_sems6 = req.rootuserSemester6;
      const std_sems7 = req.rootuserSemester7;
      const std_sems8 = req.rootuserSemester8;
      const std_sems9 = req.rootuserSemester9;

      const std_courses = std_sems1.concat(
        std_sems2,
        std_sems3,
        std_sems4,
        std_sems5,
        std_sems6,
        std_sems7,
        std_sems8,
        std_sems9
      );
      //check courses that student drop or withdraw
      for (let i = 0; i < std_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[j].courseName === std_courses[i].courseName) {
            await sos_courses.splice(j, 1);
          }
        }
      }
      //check prerequsite which they drop or withdraw
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //check courses that gp is less than 2
      let data1 = [];
      for (let i = 0; i < std_courses.length; i++) {
        if (std_courses[i].gp < 2) {
          console.log(i);
          await data1.push(std_courses[i]);
        }
      }
      //remove courses that student repeat and less marks course remove
      for (let i = 0; i < data1.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (data1[i].courseCode === std_courses[j].courseCode) {
            if (data1[i].marks != std_courses[j].marks) {
              console.log(data1[i].courseName);
              if (data1[i].marks < std_courses[j].marks) {
                await data1.splice(i, 1);
              }
            }
          }
        }
      }
      //remove names of elective from sos
      for (let i = 0; i < sos_courses.length; i++) {
        if (sos_courses[i].courseCode === "--") {
          await sos_courses.splice(i, 1);
          i--;
        }
      }
      //clear prerequisite
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          }
        }
      }
      //elective courses
      const elective = await ElectiveCourse.find();
      let elec = 0;
      const std_sems = std_sems5.concat(
        std_sems6,
        std_sems7,
        std_sems8,
        std_sems9
      );
      for (let i = 0; i < std_sems.length; i++) {
        for (let j = 0; j < elective.length; j++) {
          if (std_sems[i].courseName === elective[j].courseName) {
            await elective.splice[(j, 1)];
            elec = elec + 1;
          }
        }
      }
      if (elec === 5) {
        const courses = sos_courses.concat(data1);
        //courses that are in pendingAddcourse that also remove from courses
        const pending = await PendingAddCourse.findOne({ registrationId });
        if (!pending) {
          res.send(courses);
        } else {
          for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < pending.courses.length; j++) {
              if (courses[i].courseName === pending.courses[j].courseName) {
                await courses.splice(i, 1);
              }
            }
          }
          res.send(courses);
        }
      } else {
        //clear prerequisite for elective cources
        for (let i = 0; i < elective.length; i++) {
          for (let j = 0; j < std_courses.length; j++) {
            if (elective[i].prerequisite.length === 1) {
              if (
                elective[i].prerequisite[0].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            } else if (elective[i].prerequisite.length === 2) {
              if (
                elective[i].prerequisite[0].course ===
                  std_courses[j].courseCode ||
                elective[i].prerequisite[1].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            }
          }
        }
        const courses = sos_courses.concat(data1, elective);
        //courses that are in pendingAddcourse that also remove from courses
        const pending = await PendingAddCourse.findOne({ registrationId });
        if (!pending) {
          res.send(courses);
        } else {
          for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < pending.courses.length; j++) {
              if (courses[i].courseName === pending.courses[j].courseName) {
                await courses.splice(i, 1);
              }
            }
          }
          res.send(courses);
        }
      }
    } else if (semester === 10) {
      const semes1 = 1;
      const semes2 = 2;
      const semes3 = 3;
      const semes4 = 4;
      const semes5 = 5;
      const semes6 = 6;
      const semes7 = 7;
      const semes8 = 8;

      const semester1 = await SOS.find({ semester: semes1 });
      const semester2 = await SOS.find({ semester: semes2 });
      const semester3 = await SOS.find({ semester: semes3 });
      const semester4 = await SOS.find({ semester: semes4 });
      const semester5 = await SOS.find({ semester: semes5 });
      const semester6 = await SOS.find({ semester: semes6 });
      const semester7 = await SOS.find({ semester: semes7 });
      const semester8 = await SOS.find({ semester: semes8 });

      const sos_courses = semester1.concat(
        semester2,
        semester3,
        semester4,
        semester5,
        semester6,
        semester7,
        semester8
      );
      const std_sems1 = req.rootuserSemester1;
      const std_sems2 = req.rootuserSemester2;
      const std_sems3 = req.rootuserSemester3;
      const std_sems4 = req.rootuserSemester4;
      const std_sems5 = req.rootuserSemester5;
      const std_sems6 = req.rootuserSemester6;
      const std_sems7 = req.rootuserSemester7;
      const std_sems8 = req.rootuserSemester8;
      const std_sems9 = req.rootuserSemester9;
      const std_sems10 = req.rootuserSemester10;

      const std_courses = std_sems1.concat(
        std_sems2,
        std_sems3,
        std_sems4,
        std_sems5,
        std_sems6,
        std_sems7,
        std_sems8,
        std_sems9,
        std_sems10
      );
      //check courses that student drop or withdraw
      for (let i = 0; i < std_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[j].courseName === std_courses[i].courseName) {
            await sos_courses.splice(j, 1);
          }
        }
      }
      //check prerequsite which they drop or withdraw
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //check courses that gp is less than 2
      let data1 = [];
      for (let i = 0; i < std_courses.length; i++) {
        if (std_courses[i].gp < 2) {
          console.log(i);
          await data1.push(std_courses[i]);
        }
      }
      //remove courses that student repeat and less marks course remove
      for (let i = 0; i < data1.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (data1[i].courseCode === std_courses[j].courseCode) {
            if (data1[i].marks != std_courses[j].marks) {
              console.log(data1[i].courseName);
              if (data1[i].marks < std_courses[j].marks) {
                await data1.splice(i, 1);
              }
            }
          }
        }
      }
      //remove names of elective from sos
      for (let i = 0; i < sos_courses.length; i++) {
        if (sos_courses[i].courseCode === "--") {
          await sos_courses.splice(i, 1);
          i--;
        }
      }
      //clear prerequisite
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          }
        }
      }
      //elective courses
      const elective = await ElectiveCourse.find();
      let elec = 0;
      const std_sems = std_sems5.concat(
        std_sems6,
        std_sems7,
        std_sems8,
        std_sems9,
        std_sems10
      );
      for (let i = 0; i < std_sems.length; i++) {
        for (let j = 0; j < elective.length; j++) {
          if (std_sems[i].courseName === elective[j].courseName) {
            await elective.splice[(j, 1)];
            elec = elec + 1;
          }
        }
      }
      if (elec === 5) {
        const courses = sos_courses.concat(data1);
        //courses that are in pendingAddcourse that also remove from courses
        const pending = await PendingAddCourse.findOne({ registrationId });
        if (!pending) {
          res.send(courses);
        } else {
          for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < pending.courses.length; j++) {
              if (courses[i].courseName === pending.courses[j].courseName) {
                await courses.splice(i, 1);
              }
            }
          }
          res.send(courses);
        }
      } else {
        //clear prerequisite for elective cources
        for (let i = 0; i < elective.length; i++) {
          for (let j = 0; j < std_courses.length; j++) {
            if (elective[i].prerequisite.length === 1) {
              if (
                elective[i].prerequisite[0].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            } else if (elective[i].prerequisite.length === 2) {
              if (
                elective[i].prerequisite[0].course ===
                  std_courses[j].courseCode ||
                elective[i].prerequisite[1].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            }
          }
        }
        const courses = sos_courses.concat(data1, elective);
        //courses that are in pendingAddcourse that also remove from courses
        const pending = await PendingAddCourse.findOne({ registrationId });
        if (!pending) {
          res.send(courses);
        } else {
          for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < pending.courses.length; j++) {
              if (courses[i].courseName === pending.courses[j].courseName) {
                await courses.splice(i, 1);
              }
            }
          }
          res.send(courses);
        }
      }
    } else if (semester === 11) {
      const semes1 = 1;
      const semes2 = 2;
      const semes3 = 3;
      const semes4 = 4;
      const semes5 = 5;
      const semes6 = 6;
      const semes7 = 7;
      const semes8 = 8;

      const semester1 = await SOS.find({ semester: semes1 });
      const semester2 = await SOS.find({ semester: semes2 });
      const semester3 = await SOS.find({ semester: semes3 });
      const semester4 = await SOS.find({ semester: semes4 });
      const semester5 = await SOS.find({ semester: semes5 });
      const semester6 = await SOS.find({ semester: semes6 });
      const semester7 = await SOS.find({ semester: semes7 });
      const semester8 = await SOS.find({ semester: semes8 });

      const sos_courses = semester1.concat(
        semester2,
        semester3,
        semester4,
        semester5,
        semester6,
        semester7,
        semester8
      );
      const std_sems1 = req.rootuserSemester1;
      const std_sems2 = req.rootuserSemester2;
      const std_sems3 = req.rootuserSemester3;
      const std_sems4 = req.rootuserSemester4;
      const std_sems5 = req.rootuserSemester5;
      const std_sems6 = req.rootuserSemester6;
      const std_sems7 = req.rootuserSemester7;
      const std_sems8 = req.rootuserSemester8;
      const std_sems9 = req.rootuserSemester9;
      const std_sems10 = req.rootuserSemester10;
      const std_sems11 = req.rootuserSemester11;

      const std_courses = std_sems1.concat(
        std_sems2,
        std_sems3,
        std_sems4,
        std_sems5,
        std_sems6,
        std_sems7,
        std_sems8,
        std_sems9,
        std_sems10,
        std_sems11
      );
      //check courses that student drop or withdraw
      for (let i = 0; i < std_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[j].courseName === std_courses[i].courseName) {
            await sos_courses.splice(j, 1);
          }
        }
      }
      //check prerequsite which they drop or withdraw
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //check courses that gp is less than 2
      let data1 = [];
      for (let i = 0; i < std_courses.length; i++) {
        if (std_courses[i].gp < 2) {
          console.log(i);
          await data1.push(std_courses[i]);
        }
      }
      //remove courses that student repeat and less marks course remove
      for (let i = 0; i < data1.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (data1[i].courseCode === std_courses[j].courseCode) {
            if (data1[i].marks != std_courses[j].marks) {
              console.log(data1[i].courseName);
              if (data1[i].marks < std_courses[j].marks) {
                await data1.splice(i, 1);
              }
            }
          }
        }
      }
      //remove names of elective from sos
      for (let i = 0; i < sos_courses.length; i++) {
        if (sos_courses[i].courseCode === "--") {
          await sos_courses.splice(i, 1);
          i--;
        }
      }
      //clear prerequisite
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          }
        }
      }
      //elective courses
      const elective = await ElectiveCourse.find();
      let elec = 0;
      const std_sems = std_sems5.concat(
        std_sems6,
        std_sems7,
        std_sems8,
        std_sems9,
        std_sems10,
        std_sems11
      );
      for (let i = 0; i < std_sems.length; i++) {
        for (let j = 0; j < elective.length; j++) {
          if (std_sems[i].courseName === elective[j].courseName) {
            await elective.splice[(j, 1)];
            elec = elec + 1;
          }
        }
      }
      if (elec === 5) {
        const courses = sos_courses.concat(data1);
        //courses that are in pendingAddcourse that also remove from courses
        const pending = await PendingAddCourse.findOne({ registrationId });
        if (!pending) {
          res.send(courses);
        } else {
          for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < pending.courses.length; j++) {
              if (courses[i].courseName === pending.courses[j].courseName) {
                await courses.splice(i, 1);
              }
            }
          }
          res.send(courses);
        }
      } else {
        //clear prerequisite for elective cources
        for (let i = 0; i < elective.length; i++) {
          for (let j = 0; j < std_courses.length; j++) {
            if (elective[i].prerequisite.length === 1) {
              if (
                elective[i].prerequisite[0].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            } else if (elective[i].prerequisite.length === 2) {
              if (
                elective[i].prerequisite[0].course ===
                  std_courses[j].courseCode ||
                elective[i].prerequisite[1].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            }
          }
        }
        const courses = sos_courses.concat(data1, elective);
        //courses that are in pendingAddcourse that also remove from courses
        const pending = await PendingAddCourse.findOne({ registrationId });
        if (!pending) {
          res.send(courses);
        } else {
          for (let i = 0; i < courses.length; i++) {
            for (let j = 0; j < pending.courses.length; j++) {
              if (courses[i].courseName === pending.courses[j].courseName) {
                await courses.splice(i, 1);
              }
            }
          }
          res.send(courses);
        }
      }
    } else if (semester === 12) {
      const semes1 = 1;
      const semes2 = 2;
      const semes3 = 3;
      const semes4 = 4;
      const semes5 = 5;
      const semes6 = 6;
      const semes7 = 7;
      const semes8 = 8;

      const semester1 = await SOS.find({ semester: semes1 });
      const semester2 = await SOS.find({ semester: semes2 });
      const semester3 = await SOS.find({ semester: semes3 });
      const semester4 = await SOS.find({ semester: semes4 });
      const semester5 = await SOS.find({ semester: semes5 });
      const semester6 = await SOS.find({ semester: semes6 });
      const semester7 = await SOS.find({ semester: semes7 });
      const semester8 = await SOS.find({ semester: semes8 });

      const sos_courses = semester1.concat(
        semester2,
        semester3,
        semester4,
        semester5,
        semester6,
        semester7,
        semester8
      );
      const std_sems1 = req.rootuserSemester1;
      const std_sems2 = req.rootuserSemester2;
      const std_sems3 = req.rootuserSemester3;
      const std_sems4 = req.rootuserSemester4;
      const std_sems5 = req.rootuserSemester5;
      const std_sems6 = req.rootuserSemester6;
      const std_sems7 = req.rootuserSemester7;
      const std_sems8 = req.rootuserSemester8;
      const std_sems9 = req.rootuserSemester9;
      const std_sems10 = req.rootuserSemester10;
      const std_sems11 = req.rootuserSemester11;
      const std_sems12 = req.rootuserSemester12;

      const std_courses = std_sems1.concat(
        std_sems2,
        std_sems3,
        std_sems4,
        std_sems5,
        std_sems6,
        std_sems7,
        std_sems8,
        std_sems9,
        std_sems10,
        std_sems11,
        std_sems12
      );
      //check courses that student drop or withdraw
      for (let i = 0; i < std_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[j].courseName === std_courses[i].courseName) {
            await sos_courses.splice(j, 1);
          }
        }
      }
      //check prerequsite which they drop or withdraw
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < sos_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                sos_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                sos_courses[j].courseCode
            ) {
              await sos_courses.splice(i, 1);
              i--;
            }
          }
        }
      }
      //check courses that gp is less than 2
      let data1 = [];
      for (let i = 0; i < std_courses.length; i++) {
        if (std_courses[i].gp < 2) {
          console.log(i);
          await data1.push(std_courses[i]);
        }
      }
      //remove courses that student repeat and less marks course remove
      for (let i = 0; i < data1.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (data1[i].courseCode === std_courses[j].courseCode) {
            if (data1[i].marks != std_courses[j].marks) {
              console.log(data1[i].courseName);
              if (data1[i].marks < std_courses[j].marks) {
                await data1.splice(i, 1);
              }
            }
          }
        }
      }
      //remove names of elective from sos
      for (let i = 0; i < sos_courses.length; i++) {
        if (sos_courses[i].courseCode === "--") {
          await sos_courses.splice(i, 1);
          i--;
        }
      }
      //clear prerequisite
      for (let i = 0; i < sos_courses.length; i++) {
        for (let j = 0; j < std_courses.length; j++) {
          if (sos_courses[i].prerequisite.length === 1) {
            if (
              sos_courses[i].prerequisite[0].course ===
              std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 2) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 3) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          } else if (sos_courses[i].prerequisite.length === 4) {
            if (
              sos_courses[i].prerequisite[0].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[1].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[2].course ===
                std_courses[j].courseCode ||
              sos_courses[i].prerequisite[3].course ===
                std_courses[j].courseCode
            ) {
              if (std_courses[j].gp < 1.3) {
                await sos_courses.splice(i, 1);
                i--;
              }
            }
          }
        }
      }
      //elective courses
      const elective = await ElectiveCourse.find();
      let elec = 0;
      const std_sems = std_sems5.concat(
        std_sems6,
        std_sems7,
        std_sems8,
        std_sems9,
        std_sems10,
        std_sems11,
        std_sems12
      );
      for (let i = 0; i < std_sems.length; i++) {
        for (let j = 0; j < elective.length; j++) {
          if (std_sems[i].courseName === elective[j].courseName) {
            await elective.splice[(j, 1)];
            elec = elec + 1;
          }
        }
      }
      if (elec === 5) {
        const courses = sos_courses.concat(data1);
        res.send(courses);
      } else {
        //clear prerequisite for elective cources
        for (let i = 0; i < elective.length; i++) {
          for (let j = 0; j < std_courses.length; j++) {
            if (elective[i].prerequisite.length === 1) {
              if (
                elective[i].prerequisite[0].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            } else if (elective[i].prerequisite.length === 2) {
              if (
                elective[i].prerequisite[0].course ===
                  std_courses[j].courseCode ||
                elective[i].prerequisite[1].course === std_courses[j].courseCode
              ) {
                if (std_courses[j].gp < 1.3) {
                  await elective.splice(i, 1);
                  i--;
                }
              }
            }
          }
        }
        const courses = sos_courses.concat(data1, elective);
        res.send(courses);
      }
    }
  } catch (error) {
    console.log(error);
  }
});

//-------------------------------------------Timetable clashes-------------------------------

//upload timetable
router.post("/UploadTimetable", async (req, res) => {
  try {
    const timetable = await Timetable.create(req.body);
    res.send(timetable);
  } catch (error) {
    res.send(error);
  }
});

//Step 1: collect student courses that he was studying this semester
//Step 2: timetable ma sa in ki slot fetch kerna aur kisi array ma store kerva dena or repeated course ki bi
//Step 3: jo course is na add kerna is ki slot utha leni timetable sa
//Step 4: Semester fetch kerna kis semester ko ya course perhaya ja raha  ha//  SOS sa bi semestere utha sakhta hain
//Step 5: compare student courses slot with / add course slot

router.get("/TimetableClashes/:subject", S_authenticate, async (req, res) => {
  const user = req.rootuser;
  const { subject } = req.params;
  console.log(subject);
  const { semester, registrationId } = user;
  if (semester === 1) {
    const final_sections = [];
    res.send(final_sections);
  } else if (semester === 2) {
    //store student courses in student_courses array
    const data1 = req.rootuserSemester2;
    let data = [];
    const data2 = await PendingAddCourse.findOne({ registrationId });
    if (data2) {
      data = data1.concat(data2);
    } else {
      data = data1;
    }
    if (data.length != 0) {
      let student_courses = [];
      for (let i = 0; i < data.length; i++) {
        student_courses.push({
          courseName: data[i].courseName,
          section: data[i].courseSection, //here we get section
        });
      }
      //now fetch the slot of these courses that student current enrolled or pending
      let student_courses1 = []; //array for slot store
      const schedule = await Timetable.find();
      if (!schedule) {
        res.send("no Timetable");
      }
      //store slots in array
      //First check section of each course then get the slot
      for (let i = 0; i < student_courses.length; i++) {
        for (let j = 0; j < schedule.length; j++) {
          if (student_courses[i].section === schedule[j].class) {
            for (let k = 0; k < schedule[j].timetable[0].Monday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Monday[k].courseName
              ) {
                student_courses1.push({
                  courseName: student_courses[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Monday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Tuesday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Tuesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Tuesday[k].slot,
                });
              }
            }

            for (
              let k = 0;
              k < schedule[j].timetable[0].Wednesday.length;
              k++
            ) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Wednesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Wednesday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Thursday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Thursday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Thursday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Friday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Friday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Friday[k].slot,
                });
              }
            }
          }
        }
      }
      //-------add course=> in which semester this course alot---
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }
      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //store slot of add course of every section
      let sec_A = [];
      let sec_B = [];
      // let sec_C = [];
      for (let i = 0; i < record.length; i++) {
        for (let j = 0; j < record[i].timetable[0].Monday.length; j++) {
          if (record[i].timetable[0].Monday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Monday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Tuesday.length; j++) {
          if (record[i].timetable[0].Tuesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Tuesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Wednesday.length; j++) {
          if (record[i].timetable[0].Wednesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Wednesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Thursday.length; j++) {
          if (record[i].timetable[0].Thursday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Thursday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Friday.length; j++) {
          if (record[i].timetable[0].Friday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Friday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
      }
      //compare the slot for clashes
      let Clash_sec_A = "";
      let Clash_sec_B = "";
      // let Clash_sec_C = "";
      if (sec_A != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_A.length; j++) {
            if (student_courses1[i].slot === sec_A[j].slot) {
              Clash_sec_A = 1;
            }
          }
        }
      }
      if (sec_B != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_B.length; j++) {
            console.log(student_courses1[i].slot, sec_B[j].slot);
            if (student_courses1[i].slot === sec_B[j].slot) {
              Clash_sec_B = 1;
            }
          }
        }
      }
      // if (sec_C != false) {
      //   for (let i = 0; i < student_courses1.length; i++) {
      //     for (let j = 0; j < sec_C.length; j++) {
      //       if (student_courses1[i].slot === sec_C[j].slot) {
      //         Clash_sec_C = 1;
      //       }
      //     }
      //   }
      // }
      let final_sections = [];
      if (Clash_sec_A === "") {
        if (sec_A != false) {
          final_sections.push(sec_A[0].class);
        }
      }
      if (Clash_sec_B === "") {
        if (sec_B != false) {
          final_sections.push(sec_B[0].class);
        }
      }
      // if (Clash_sec_C === "") {
      //   if (sec_C != false) {
      //     final_sections.push(sec_C[0].class);
      //   }
      // }
      res.json(final_sections);
    } else {
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }

      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //find the section
      let final_sections = [];
      for (let i = 0; i < record.length; i++) {
        final_sections.push(record[i].class);
      }
      res.json(final_sections);
    }
  } else if (semester === 3) {
    //store student courses in student_courses array
    const data1 = req.rootuserSemester3;
    let data = [];
    const data2 = await PendingAddCourse.findOne({ registrationId });
    if (data2) {
      data = data1.concat(data2);
    } else {
      data = data1;
    }
    if (data.length != 0) {
      let student_courses = [];
      for (let i = 0; i < data.length; i++) {
        student_courses.push({
          courseName: data[i].courseName,
          section: data[i].courseSection, //here we get section
        });
      }
      //now fetch the slot of these courses that student current enrolled or pending
      let student_courses1 = []; //array for slot store
      const schedule = await Timetable.find();
      if (!schedule) {
        res.send("no Timetable");
      }
      //store slots in array
      //First check section of each course then get the slot
      for (let i = 0; i < student_courses.length; i++) {
        for (let j = 0; j < schedule.length; j++) {
          if (student_courses[i].section === schedule[j].class) {
            for (let k = 0; k < schedule[j].timetable[0].Monday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Monday[k].courseName
              ) {
                student_courses1.push({
                  courseName: student_courses[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Monday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Tuesday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Tuesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Tuesday[k].slot,
                });
              }
            }

            for (
              let k = 0;
              k < schedule[j].timetable[0].Wednesday.length;
              k++
            ) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Wednesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Wednesday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Thursday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Thursday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Thursday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Friday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Friday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Friday[k].slot,
                });
              }
            }
          }
        }
      }
      //-------add course=> in which semester this course alot---
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }
      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //store slot of add course of every section
      let sec_A = [];
      let sec_B = [];
      // let sec_C = [];
      for (let i = 0; i < record.length; i++) {
        for (let j = 0; j < record[i].timetable[0].Monday.length; j++) {
          if (record[i].timetable[0].Monday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Monday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Tuesday.length; j++) {
          if (record[i].timetable[0].Tuesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Tuesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Wednesday.length; j++) {
          if (record[i].timetable[0].Wednesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Wednesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Thursday.length; j++) {
          if (record[i].timetable[0].Thursday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Thursday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Friday.length; j++) {
          if (record[i].timetable[0].Friday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Friday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
      }
      //compare the slot for clashes
      let Clash_sec_A = "";
      let Clash_sec_B = "";
      // let Clash_sec_C = "";
      if (sec_A != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_A.length; j++) {
            if (student_courses1[i].slot === sec_A[j].slot) {
              Clash_sec_A = 1;
            }
          }
        }
      }
      if (sec_B != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_B.length; j++) {
            console.log(student_courses1[i].slot, sec_B[j].slot);
            if (student_courses1[i].slot === sec_B[j].slot) {
              Clash_sec_B = 1;
            }
          }
        }
      }
      // if (sec_C != false) {
      //   for (let i = 0; i < student_courses1.length; i++) {
      //     for (let j = 0; j < sec_C.length; j++) {
      //       if (student_courses1[i].slot === sec_C[j].slot) {
      //         Clash_sec_C = 1;
      //       }
      //     }
      //   }
      // }
      let final_sections = [];
      if (Clash_sec_A === "") {
        if (sec_A != false) {
          final_sections.push(sec_A[0].class);
        }
      }
      if (Clash_sec_B === "") {
        if (sec_B != false) {
          final_sections.push(sec_B[0].class);
        }
      }
      // if (Clash_sec_C === "") {
      //   if (sec_C != false) {
      //     final_sections.push(sec_C[0].class);
      //   }
      // }
      res.json(final_sections);
    } else {
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }

      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //find the section
      let final_sections = [];
      for (let i = 0; i < record.length; i++) {
        final_sections.push(record[i].class);
      }
      res.json(final_sections);
    }
  } else if (semester === 4) {
    //store student courses in student_courses array
    const data1 = req.rootuserSemester4;
    let data = [];
    const data2 = await PendingAddCourse.findOne({ registrationId });
    if (data2) {
      data = data1.concat(data2);
    } else {
      data = data1;
    }
    if (data.length != 0) {
      let student_courses = [];
      for (let i = 0; i < data.length; i++) {
        student_courses.push({
          courseName: data[i].courseName,
          section: data[i].courseSection, //here we get section
        });
      }
      //now fetch the slot of these courses that student current enrolled or pending
      let student_courses1 = []; //array for slot store
      const schedule = await Timetable.find();
      if (!schedule) {
        res.send("no Timetable");
      }
      //store slots in array
      //First check section of each course then get the slot
      for (let i = 0; i < student_courses.length; i++) {
        for (let j = 0; j < schedule.length; j++) {
          if (student_courses[i].section === schedule[j].class) {
            for (let k = 0; k < schedule[j].timetable[0].Monday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Monday[k].courseName
              ) {
                student_courses1.push({
                  courseName: student_courses[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Monday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Tuesday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Tuesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Tuesday[k].slot,
                });
              }
            }

            for (
              let k = 0;
              k < schedule[j].timetable[0].Wednesday.length;
              k++
            ) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Wednesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Wednesday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Thursday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Thursday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Thursday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Friday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Friday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Friday[k].slot,
                });
              }
            }
          }
        }
      }
      //-------add course=> in which semester this course alot---
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }
      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //store slot of add course of every section
      let sec_A = [];
      let sec_B = [];
      // let sec_C = [];
      for (let i = 0; i < record.length; i++) {
        for (let j = 0; j < record[i].timetable[0].Monday.length; j++) {
          if (record[i].timetable[0].Monday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Monday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Tuesday.length; j++) {
          if (record[i].timetable[0].Tuesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Tuesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Wednesday.length; j++) {
          if (record[i].timetable[0].Wednesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Wednesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Thursday.length; j++) {
          if (record[i].timetable[0].Thursday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Thursday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Friday.length; j++) {
          if (record[i].timetable[0].Friday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Friday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
      }
      //compare the slot for clashes
      let Clash_sec_A = "";
      let Clash_sec_B = "";
      // let Clash_sec_C = "";
      if (sec_A != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_A.length; j++) {
            if (student_courses1[i].slot === sec_A[j].slot) {
              Clash_sec_A = 1;
            }
          }
        }
      }
      if (sec_B != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_B.length; j++) {
            console.log(student_courses1[i].slot, sec_B[j].slot);
            if (student_courses1[i].slot === sec_B[j].slot) {
              Clash_sec_B = 1;
            }
          }
        }
      }
      // if (sec_C != false) {
      //   for (let i = 0; i < student_courses1.length; i++) {
      //     for (let j = 0; j < sec_C.length; j++) {
      //       if (student_courses1[i].slot === sec_C[j].slot) {
      //         Clash_sec_C = 1;
      //       }
      //     }
      //   }
      // }
      let final_sections = [];
      if (Clash_sec_A === "") {
        if (sec_A != false) {
          final_sections.push(sec_A[0].class);
        }
      }
      if (Clash_sec_B === "") {
        if (sec_B != false) {
          final_sections.push(sec_B[0].class);
        }
      }
      // if (Clash_sec_C === "") {
      //   if (sec_C != false) {
      //     final_sections.push(sec_C[0].class);
      //   }
      // }
      res.json(final_sections);
    } else {
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }

      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //find the section
      let final_sections = [];
      for (let i = 0; i < record.length; i++) {
        final_sections.push(record[i].class);
      }
      res.json(final_sections);
    }
  } else if (semester === 5) {
    //store student courses in student_courses array
    const data1 = req.rootuserSemester5;
    let data = [];
    const data2 = await PendingAddCourse.findOne({ registrationId });
    if (data2) {
      data = data1.concat(data2);
    } else {
      data = data1;
    }
    if (data.length != 0) {
      let student_courses = [];
      for (let i = 0; i < data.length; i++) {
        student_courses.push({
          courseName: data[i].courseName,
          section: data[i].courseSection, //here we get section
        });
      }
      //now fetch the slot of these courses that student current enrolled or pending
      let student_courses1 = []; //array for slot store
      const schedule = await Timetable.find();
      if (!schedule) {
        res.send("no Timetable");
      }
      //store slots in array
      //First check section of each course then get the slot
      for (let i = 0; i < student_courses.length; i++) {
        for (let j = 0; j < schedule.length; j++) {
          if (student_courses[i].section === schedule[j].class) {
            for (let k = 0; k < schedule[j].timetable[0].Monday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Monday[k].courseName
              ) {
                student_courses1.push({
                  courseName: student_courses[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Monday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Tuesday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Tuesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Tuesday[k].slot,
                });
              }
            }

            for (
              let k = 0;
              k < schedule[j].timetable[0].Wednesday.length;
              k++
            ) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Wednesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Wednesday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Thursday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Thursday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Thursday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Friday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Friday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Friday[k].slot,
                });
              }
            }
          }
        }
      }
      //-------add course=> in which semester this course alot---
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }
      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //store slot of add course of every section
      let sec_A = [];
      let sec_B = [];
      // let sec_C = [];
      for (let i = 0; i < record.length; i++) {
        for (let j = 0; j < record[i].timetable[0].Monday.length; j++) {
          if (record[i].timetable[0].Monday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Monday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Tuesday.length; j++) {
          if (record[i].timetable[0].Tuesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Tuesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Wednesday.length; j++) {
          if (record[i].timetable[0].Wednesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Wednesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Thursday.length; j++) {
          if (record[i].timetable[0].Thursday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Thursday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Friday.length; j++) {
          if (record[i].timetable[0].Friday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Friday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
      }
      //compare the slot for clashes
      let Clash_sec_A = "";
      let Clash_sec_B = "";
      // let Clash_sec_C = "";
      if (sec_A != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_A.length; j++) {
            if (student_courses1[i].slot === sec_A[j].slot) {
              Clash_sec_A = 1;
            }
          }
        }
      }
      if (sec_B != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_B.length; j++) {
            console.log(student_courses1[i].slot, sec_B[j].slot);
            if (student_courses1[i].slot === sec_B[j].slot) {
              Clash_sec_B = 1;
            }
          }
        }
      }
      // if (sec_C != false) {
      //   for (let i = 0; i < student_courses1.length; i++) {
      //     for (let j = 0; j < sec_C.length; j++) {
      //       if (student_courses1[i].slot === sec_C[j].slot) {
      //         Clash_sec_C = 1;
      //       }
      //     }
      //   }
      // }
      let final_sections = [];
      if (Clash_sec_A === "") {
        if (sec_A != false) {
          final_sections.push(sec_A[0].class);
        }
      }
      if (Clash_sec_B === "") {
        if (sec_B != false) {
          final_sections.push(sec_B[0].class);
        }
      }
      // if (Clash_sec_C === "") {
      //   if (sec_C != false) {
      //     final_sections.push(sec_C[0].class);
      //   }
      // }
      res.json(final_sections);
    } else {
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }

      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //find the section
      let final_sections = [];
      for (let i = 0; i < record.length; i++) {
        final_sections.push(record[i].class);
      }
      res.json(final_sections);
    }
  } else if (semester === 6) {
    //store student courses in student_courses array
    const data1 = req.rootuserSemester6;
    let data = [];
    const data2 = await PendingAddCourse.findOne({ registrationId });
    if (data2) {
      data = data1.concat(data2);
    } else {
      data = data1;
    }
    if (data.length != 0) {
      let student_courses = [];
      for (let i = 0; i < data.length; i++) {
        student_courses.push({
          courseName: data[i].courseName,
          section: data[i].courseSection, //here we get section
        });
      }
      //now fetch the slot of these courses that student current enrolled or pending
      let student_courses1 = []; //array for slot store
      const schedule = await Timetable.find();
      if (!schedule) {
        res.send("no Timetable");
      }
      //store slots in array
      //First check section of each course then get the slot
      for (let i = 0; i < student_courses.length; i++) {
        for (let j = 0; j < schedule.length; j++) {
          if (student_courses[i].section === schedule[j].class) {
            for (let k = 0; k < schedule[j].timetable[0].Monday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Monday[k].courseName
              ) {
                student_courses1.push({
                  courseName: student_courses[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Monday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Tuesday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Tuesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Tuesday[k].slot,
                });
              }
            }

            for (
              let k = 0;
              k < schedule[j].timetable[0].Wednesday.length;
              k++
            ) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Wednesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Wednesday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Thursday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Thursday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Thursday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Friday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Friday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Friday[k].slot,
                });
              }
            }
          }
        }
      }
      //-------add course=> in which semester this course alot---
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }
      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //store slot of add course of every section
      let sec_A = [];
      let sec_B = [];
      // let sec_C = [];
      for (let i = 0; i < record.length; i++) {
        for (let j = 0; j < record[i].timetable[0].Monday.length; j++) {
          if (record[i].timetable[0].Monday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Monday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Tuesday.length; j++) {
          if (record[i].timetable[0].Tuesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Tuesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Wednesday.length; j++) {
          if (record[i].timetable[0].Wednesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Wednesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Thursday.length; j++) {
          if (record[i].timetable[0].Thursday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Thursday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Friday.length; j++) {
          if (record[i].timetable[0].Friday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Friday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
      }
      //compare the slot for clashes
      let Clash_sec_A = "";
      let Clash_sec_B = "";
      // let Clash_sec_C = "";
      if (sec_A != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_A.length; j++) {
            if (student_courses1[i].slot === sec_A[j].slot) {
              Clash_sec_A = 1;
            }
          }
        }
      }
      if (sec_B != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_B.length; j++) {
            console.log(student_courses1[i].slot, sec_B[j].slot);
            if (student_courses1[i].slot === sec_B[j].slot) {
              Clash_sec_B = 1;
            }
          }
        }
      }
      // if (sec_C != false) {
      //   for (let i = 0; i < student_courses1.length; i++) {
      //     for (let j = 0; j < sec_C.length; j++) {
      //       if (student_courses1[i].slot === sec_C[j].slot) {
      //         Clash_sec_C = 1;
      //       }
      //     }
      //   }
      // }
      let final_sections = [];
      if (Clash_sec_A === "") {
        if (sec_A != false) {
          final_sections.push(sec_A[0].class);
        }
      }
      if (Clash_sec_B === "") {
        if (sec_B != false) {
          final_sections.push(sec_B[0].class);
        }
      }
      // if (Clash_sec_C === "") {
      //   if (sec_C != false) {
      //     final_sections.push(sec_C[0].class);
      //   }
      // }
      res.json(final_sections);
    } else {
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }

      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //find the section
      let final_sections = [];
      for (let i = 0; i < record.length; i++) {
        final_sections.push(record[i].class);
      }
      res.json(final_sections);
    }
  } else if (semester === 7) {
    //store student courses in student_courses array
    const data1 = req.rootuserSemester7;
    let data = [];
    const data2 = await PendingAddCourse.findOne({ registrationId });
    if (data2) {
      data = data1.concat(data2);
    } else {
      data = data1;
    }
    if (data.length != 0) {
      let student_courses = [];
      for (let i = 0; i < data.length; i++) {
        student_courses.push({
          courseName: data[i].courseName,
          section: data[i].courseSection, //here we get section
        });
      }
      //now fetch the slot of these courses that student current enrolled or pending
      let student_courses1 = []; //array for slot store
      const schedule = await Timetable.find();
      if (!schedule) {
        res.send("no Timetable");
      }
      //store slots in array
      //First check section of each course then get the slot
      for (let i = 0; i < student_courses.length; i++) {
        for (let j = 0; j < schedule.length; j++) {
          if (student_courses[i].section === schedule[j].class) {
            for (let k = 0; k < schedule[j].timetable[0].Monday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Monday[k].courseName
              ) {
                student_courses1.push({
                  courseName: student_courses[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Monday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Tuesday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Tuesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Tuesday[k].slot,
                });
              }
            }

            for (
              let k = 0;
              k < schedule[j].timetable[0].Wednesday.length;
              k++
            ) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Wednesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Wednesday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Thursday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Thursday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Thursday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Friday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Friday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Friday[k].slot,
                });
              }
            }
          }
        }
      }
      //-------add course=> in which semester this course alot---
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }
      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //store slot of add course of every section
      let sec_A = [];
      let sec_B = [];
      // let sec_C = [];
      for (let i = 0; i < record.length; i++) {
        for (let j = 0; j < record[i].timetable[0].Monday.length; j++) {
          if (record[i].timetable[0].Monday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Monday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Tuesday.length; j++) {
          if (record[i].timetable[0].Tuesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Tuesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Wednesday.length; j++) {
          if (record[i].timetable[0].Wednesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Wednesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Thursday.length; j++) {
          if (record[i].timetable[0].Thursday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Thursday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Friday.length; j++) {
          if (record[i].timetable[0].Friday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Friday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
      }
      //compare the slot for clashes
      let Clash_sec_A = "";
      let Clash_sec_B = "";
      // let Clash_sec_C = "";
      if (sec_A != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_A.length; j++) {
            if (student_courses1[i].slot === sec_A[j].slot) {
              Clash_sec_A = 1;
            }
          }
        }
      }
      if (sec_B != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_B.length; j++) {
            console.log(student_courses1[i].slot, sec_B[j].slot);
            if (student_courses1[i].slot === sec_B[j].slot) {
              Clash_sec_B = 1;
            }
          }
        }
      }
      // if (sec_C != false) {
      //   for (let i = 0; i < student_courses1.length; i++) {
      //     for (let j = 0; j < sec_C.length; j++) {
      //       if (student_courses1[i].slot === sec_C[j].slot) {
      //         Clash_sec_C = 1;
      //       }
      //     }
      //   }
      // }
      let final_sections = [];
      if (Clash_sec_A === "") {
        if (sec_A != false) {
          final_sections.push(sec_A[0].class);
        }
      }
      if (Clash_sec_B === "") {
        if (sec_B != false) {
          final_sections.push(sec_B[0].class);
        }
      }
      // if (Clash_sec_C === "") {
      //   if (sec_C != false) {
      //     final_sections.push(sec_C[0].class);
      //   }
      // }
      res.json(final_sections);
    } else {
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }

      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //find the section
      let final_sections = [];
      for (let i = 0; i < record.length; i++) {
        final_sections.push(record[i].class);
      }
      res.json(final_sections);
    }
  } else if (semester === 8) {
    //store student courses in student_courses array
    const data1 = req.rootuserSemester8;
    let data = [];
    const data2 = await PendingAddCourse.findOne({ registrationId });
    if (data2) {
      data = data1.concat(data2);
    } else {
      data = data1;
    }
    if (data.length != 0) {
      let student_courses = [];
      for (let i = 0; i < data.length; i++) {
        student_courses.push({
          courseName: data[i].courseName,
          section: data[i].courseSection, //here we get section
        });
      }
      //now fetch the slot of these courses that student current enrolled or pending
      let student_courses1 = []; //array for slot store
      const schedule = await Timetable.find();
      if (!schedule) {
        res.send("no Timetable");
      }
      //store slots in array
      //First check section of each course then get the slot
      for (let i = 0; i < student_courses.length; i++) {
        for (let j = 0; j < schedule.length; j++) {
          if (student_courses[i].section === schedule[j].class) {
            for (let k = 0; k < schedule[j].timetable[0].Monday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Monday[k].courseName
              ) {
                student_courses1.push({
                  courseName: student_courses[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Monday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Tuesday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Tuesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Tuesday[k].slot,
                });
              }
            }

            for (
              let k = 0;
              k < schedule[j].timetable[0].Wednesday.length;
              k++
            ) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Wednesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Wednesday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Thursday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Thursday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Thursday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Friday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Friday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Friday[k].slot,
                });
              }
            }
          }
        }
      }
      //-------add course=> in which semester this course alot---
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }
      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //store slot of add course of every section
      let sec_A = [];
      let sec_B = [];
      // let sec_C = [];
      for (let i = 0; i < record.length; i++) {
        for (let j = 0; j < record[i].timetable[0].Monday.length; j++) {
          if (record[i].timetable[0].Monday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Monday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Tuesday.length; j++) {
          if (record[i].timetable[0].Tuesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Tuesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Wednesday.length; j++) {
          if (record[i].timetable[0].Wednesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Wednesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Thursday.length; j++) {
          if (record[i].timetable[0].Thursday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Thursday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Friday.length; j++) {
          if (record[i].timetable[0].Friday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Friday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
      }
      //compare the slot for clashes
      let Clash_sec_A = "";
      let Clash_sec_B = "";
      // let Clash_sec_C = "";
      if (sec_A != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_A.length; j++) {
            if (student_courses1[i].slot === sec_A[j].slot) {
              Clash_sec_A = 1;
            }
          }
        }
      }
      if (sec_B != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_B.length; j++) {
            console.log(student_courses1[i].slot, sec_B[j].slot);
            if (student_courses1[i].slot === sec_B[j].slot) {
              Clash_sec_B = 1;
            }
          }
        }
      }
      // if (sec_C != false) {
      //   for (let i = 0; i < student_courses1.length; i++) {
      //     for (let j = 0; j < sec_C.length; j++) {
      //       if (student_courses1[i].slot === sec_C[j].slot) {
      //         Clash_sec_C = 1;
      //       }
      //     }
      //   }
      // }
      let final_sections = [];
      if (Clash_sec_A === "") {
        if (sec_A != false) {
          final_sections.push(sec_A[0].class);
        }
      }
      if (Clash_sec_B === "") {
        if (sec_B != false) {
          final_sections.push(sec_B[0].class);
        }
      }
      // if (Clash_sec_C === "") {
      //   if (sec_C != false) {
      //     final_sections.push(sec_C[0].class);
      //   }
      // }

      res.json(final_sections);
    } else {
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }

      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //find the section
      let final_sections = [];
      for (let i = 0; i < record.length; i++) {
        final_sections.push(record[i].class);
      }
      res.json(final_sections);
    }
  } else if (semester === 9) {
    //store student courses in student_courses array
    const data1 = req.rootuserSemester9;
    let data = [];
    const data2 = await PendingAddCourse.findOne({ registrationId });
    if (data2) {
      data = data1.concat(data2);
    } else {
      data = data1;
    }
    if (data.length != 0) {
      let student_courses = [];
      for (let i = 0; i < data.length; i++) {
        student_courses.push({
          courseName: data[i].courseName,
          section: data[i].courseSection, //here we get section
        });
      }
      //now fetch the slot of these courses that student current enrolled or pending
      let student_courses1 = []; //array for slot store
      const schedule = await Timetable.find();
      if (!schedule) {
        res.send("no Timetable");
      }
      //store slots in array
      //First check section of each course then get the slot
      for (let i = 0; i < student_courses.length; i++) {
        for (let j = 0; j < schedule.length; j++) {
          if (student_courses[i].section === schedule[j].class) {
            for (let k = 0; k < schedule[j].timetable[0].Monday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Monday[k].courseName
              ) {
                student_courses1.push({
                  courseName: student_courses[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Monday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Tuesday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Tuesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Tuesday[k].slot,
                });
              }
            }

            for (
              let k = 0;
              k < schedule[j].timetable[0].Wednesday.length;
              k++
            ) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Wednesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Wednesday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Thursday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Thursday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Thursday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Friday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Friday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Friday[k].slot,
                });
              }
            }
          }
        }
      }
      //-------add course=> in which semester this course alot---
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }
      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //store slot of add course of every section
      let sec_A = [];
      let sec_B = [];
      // let sec_C = [];
      for (let i = 0; i < record.length; i++) {
        for (let j = 0; j < record[i].timetable[0].Monday.length; j++) {
          if (record[i].timetable[0].Monday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Monday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Tuesday.length; j++) {
          if (record[i].timetable[0].Tuesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Tuesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Wednesday.length; j++) {
          if (record[i].timetable[0].Wednesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Wednesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Thursday.length; j++) {
          if (record[i].timetable[0].Thursday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Thursday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Friday.length; j++) {
          if (record[i].timetable[0].Friday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Friday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
      }
      //compare the slot for clashes
      let Clash_sec_A = "";
      let Clash_sec_B = "";
      // let Clash_sec_C = "";
      if (sec_A != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_A.length; j++) {
            if (student_courses1[i].slot === sec_A[j].slot) {
              Clash_sec_A = 1;
            }
          }
        }
      }
      if (sec_B != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_B.length; j++) {
            console.log(student_courses1[i].slot, sec_B[j].slot);
            if (student_courses1[i].slot === sec_B[j].slot) {
              Clash_sec_B = 1;
            }
          }
        }
      }
      // if (sec_C != false) {
      //   for (let i = 0; i < student_courses1.length; i++) {
      //     for (let j = 0; j < sec_C.length; j++) {
      //       if (student_courses1[i].slot === sec_C[j].slot) {
      //         Clash_sec_C = 1;
      //       }
      //     }
      //   }
      // }
      let final_sections = [];
      if (Clash_sec_A === "") {
        if (sec_A != false) {
          final_sections.push(sec_A[0].class);
        }
      }
      if (Clash_sec_B === "") {
        if (sec_B != false) {
          final_sections.push(sec_B[0].class);
        }
      }
      // if (Clash_sec_C === "") {
      //   if (sec_C != false) {
      //     final_sections.push(sec_C[0].class);
      //   }
      // }
      res.json(final_sections);
    } else {
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }

      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //find the section
      let final_sections = [];
      for (let i = 0; i < record.length; i++) {
        final_sections.push(record[i].class);
      }
      res.json(final_sections);
    }
  } else if (semester === 10) {
    //store student courses in student_courses array
    const data1 = req.rootuserSemester10;
    let data = [];
    const data2 = await PendingAddCourse.findOne({ registrationId });
    if (data2) {
      data = data1.concat(data2);
    } else {
      data = data1;
    }
    if (data.length != 0) {
      let student_courses = [];
      for (let i = 0; i < data.length; i++) {
        student_courses.push({
          courseName: data[i].courseName,
          section: data[i].courseSection, //here we get section
        });
      }
      //now fetch the slot of these courses that student current enrolled or pending
      let student_courses1 = []; //array for slot store
      const schedule = await Timetable.find();
      if (!schedule) {
        res.send("no Timetable");
      }
      //store slots in array
      //First check section of each course then get the slot
      for (let i = 0; i < student_courses.length; i++) {
        for (let j = 0; j < schedule.length; j++) {
          if (student_courses[i].section === schedule[j].class) {
            for (let k = 0; k < schedule[j].timetable[0].Monday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Monday[k].courseName
              ) {
                student_courses1.push({
                  courseName: student_courses[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Monday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Tuesday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Tuesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Tuesday[k].slot,
                });
              }
            }

            for (
              let k = 0;
              k < schedule[j].timetable[0].Wednesday.length;
              k++
            ) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Wednesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Wednesday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Thursday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Thursday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Thursday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Friday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Friday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Friday[k].slot,
                });
              }
            }
          }
        }
      }
      //-------add course=> in which semester this course alot---
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }
      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //store slot of add course of every section
      let sec_A = [];
      let sec_B = [];
      // let sec_C = [];
      for (let i = 0; i < record.length; i++) {
        for (let j = 0; j < record[i].timetable[0].Monday.length; j++) {
          if (record[i].timetable[0].Monday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Monday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Tuesday.length; j++) {
          if (record[i].timetable[0].Tuesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Tuesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Wednesday.length; j++) {
          if (record[i].timetable[0].Wednesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Wednesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Thursday.length; j++) {
          if (record[i].timetable[0].Thursday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Thursday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Friday.length; j++) {
          if (record[i].timetable[0].Friday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Friday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
      }
      //compare the slot for clashes
      let Clash_sec_A = "";
      let Clash_sec_B = "";
      // let Clash_sec_C = "";
      if (sec_A != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_A.length; j++) {
            if (student_courses1[i].slot === sec_A[j].slot) {
              Clash_sec_A = 1;
            }
          }
        }
      }
      if (sec_B != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_B.length; j++) {
            console.log(student_courses1[i].slot, sec_B[j].slot);
            if (student_courses1[i].slot === sec_B[j].slot) {
              Clash_sec_B = 1;
            }
          }
        }
      }
      // if (sec_C != false) {
      //   for (let i = 0; i < student_courses1.length; i++) {
      //     for (let j = 0; j < sec_C.length; j++) {
      //       if (student_courses1[i].slot === sec_C[j].slot) {
      //         Clash_sec_C = 1;
      //       }
      //     }
      //   }
      // }
      let final_sections = [];
      if (Clash_sec_A === "") {
        if (sec_A != false) {
          final_sections.push(sec_A[0].class);
        }
      }
      if (Clash_sec_B === "") {
        if (sec_B != false) {
          final_sections.push(sec_B[0].class);
        }
      }
      // if (Clash_sec_C === "") {
      //   if (sec_C != false) {
      //     final_sections.push(sec_C[0].class);
      //   }
      // }
      res.json(final_sections);
    } else {
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }

      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //find the section
      let final_sections = [];
      for (let i = 0; i < record.length; i++) {
        final_sections.push(record[i].class);
      }
      res.json(final_sections);
    }
  } else if (semester === 11) {
    //store student courses in student_courses array
    const data1 = req.rootuserSemester11;
    let data = [];
    const data2 = await PendingAddCourse.findOne({ registrationId });
    if (data2) {
      data = data1.concat(data2);
    } else {
      data = data1;
    }
    if (data.length != 0) {
      let student_courses = [];
      for (let i = 0; i < data.length; i++) {
        student_courses.push({
          courseName: data[i].courseName,
          section: data[i].courseSection, //here we get section
        });
      }
      //now fetch the slot of these courses that student current enrolled or pending
      let student_courses1 = []; //array for slot store
      const schedule = await Timetable.find();
      if (!schedule) {
        res.send("no Timetable");
      }
      //store slots in array
      //First check section of each course then get the slot
      for (let i = 0; i < student_courses.length; i++) {
        for (let j = 0; j < schedule.length; j++) {
          if (student_courses[i].section === schedule[j].class) {
            for (let k = 0; k < schedule[j].timetable[0].Monday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Monday[k].courseName
              ) {
                student_courses1.push({
                  courseName: student_courses[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Monday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Tuesday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Tuesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Tuesday[k].slot,
                });
              }
            }

            for (
              let k = 0;
              k < schedule[j].timetable[0].Wednesday.length;
              k++
            ) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Wednesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Wednesday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Thursday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Thursday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Thursday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Friday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Friday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Friday[k].slot,
                });
              }
            }
          }
        }
      }
      //-------add course=> in which semester this course alot---
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }
      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //store slot of add course of every section
      let sec_A = [];
      let sec_B = [];
      // let sec_C = [];
      for (let i = 0; i < record.length; i++) {
        for (let j = 0; j < record[i].timetable[0].Monday.length; j++) {
          if (record[i].timetable[0].Monday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Monday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Tuesday.length; j++) {
          if (record[i].timetable[0].Tuesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Tuesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Wednesday.length; j++) {
          if (record[i].timetable[0].Wednesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Wednesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Thursday.length; j++) {
          if (record[i].timetable[0].Thursday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Thursday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Friday.length; j++) {
          if (record[i].timetable[0].Friday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Friday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
      }
      //compare the slot for clashes
      let Clash_sec_A = "";
      let Clash_sec_B = "";
      // let Clash_sec_C = "";
      if (sec_A != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_A.length; j++) {
            if (student_courses1[i].slot === sec_A[j].slot) {
              Clash_sec_A = 1;
            }
          }
        }
      }
      if (sec_B != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_B.length; j++) {
            console.log(student_courses1[i].slot, sec_B[j].slot);
            if (student_courses1[i].slot === sec_B[j].slot) {
              Clash_sec_B = 1;
            }
          }
        }
      }
      // if (sec_C != false) {
      //   for (let i = 0; i < student_courses1.length; i++) {
      //     for (let j = 0; j < sec_C.length; j++) {
      //       if (student_courses1[i].slot === sec_C[j].slot) {
      //         Clash_sec_C = 1;
      //       }
      //     }
      //   }
      // }
      let final_sections = [];
      if (Clash_sec_A === "") {
        if (sec_A != false) {
          final_sections.push(sec_A[0].class);
        }
      }
      if (Clash_sec_B === "") {
        if (sec_B != false) {
          final_sections.push(sec_B[0].class);
        }
      }
      // if (Clash_sec_C === "") {
      //   if (sec_C != false) {
      //     final_sections.push(sec_C[0].class);
      //   }
      // }
      res.json(final_sections);
    } else {
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }

      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //find the section
      let final_sections = [];
      for (let i = 0; i < record.length; i++) {
        final_sections.push(record[i].class);
      }
      res.json(final_sections);
    }
  } else if (semester === 12) {
    //store student courses in student_courses array
    const data1 = req.rootuserSemester12;
    let data = [];
    const data2 = await PendingAddCourse.findOne({ registrationId });
    if (data2) {
      data = data1.concat(data2);
    } else {
      data = data1;
    }
    if (data.length != 0) {
      let student_courses = [];
      for (let i = 0; i < data.length; i++) {
        student_courses.push({
          courseName: data[i].courseName,
          section: data[i].courseSection, //here we get section
        });
      }
      //now fetch the slot of these courses that student current enrolled or pending
      let student_courses1 = []; //array for slot store
      const schedule = await Timetable.find();
      if (!schedule) {
        res.send("no Timetable");
      }
      //store slots in array
      //First check section of each course then get the slot
      for (let i = 0; i < student_courses.length; i++) {
        for (let j = 0; j < schedule.length; j++) {
          if (student_courses[i].section === schedule[j].class) {
            for (let k = 0; k < schedule[j].timetable[0].Monday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Monday[k].courseName
              ) {
                student_courses1.push({
                  courseName: student_courses[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Monday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Tuesday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Tuesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Tuesday[k].slot,
                });
              }
            }

            for (
              let k = 0;
              k < schedule[j].timetable[0].Wednesday.length;
              k++
            ) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Wednesday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Wednesday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Thursday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Thursday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Thursday[k].slot,
                });
              }
            }
            for (let k = 0; k < schedule[j].timetable[0].Friday.length; k++) {
              if (
                student_courses[i].courseName ===
                schedule[j].timetable[0].Friday[k].courseName
              ) {
                student_courses1.push({
                  courseName: data[i].courseName,
                  section: student_courses[i].section, //here we get section
                  slot: schedule[j].timetable[0].Friday[k].slot,
                });
              }
            }
          }
        }
      }
      //-------add course=> in which semester this course alot---
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }
      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //store slot of add course of every section
      let sec_A = [];
      let sec_B = [];
      // let sec_C = [];
      for (let i = 0; i < record.length; i++) {
        for (let j = 0; j < record[i].timetable[0].Monday.length; j++) {
          if (record[i].timetable[0].Monday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Monday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Monday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Tuesday.length; j++) {
          if (record[i].timetable[0].Tuesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Tuesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Tuesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Wednesday.length; j++) {
          if (record[i].timetable[0].Wednesday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Wednesday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Wednesday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Thursday.length; j++) {
          if (record[i].timetable[0].Thursday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Thursday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Thursday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
        for (let j = 0; j < record[i].timetable[0].Friday.length; j++) {
          if (record[i].timetable[0].Friday[j].courseName === subject) {
            if (record[i].section === "A") {
              sec_A.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            if (record[i].section === "B") {
              sec_B.push({
                slot: record[i].timetable[0].Friday[j].slot,
                class: record[i].class,
              });
            }
            // if (record[i].section === "C") {
            //   sec_C.push({
            //     slot: record[i].timetable[0].Friday[j].slot,
            //     class: record[i].class,
            //   });
            // }
          }
        }
      }
      //compare the slot for clashes
      let Clash_sec_A = "";
      let Clash_sec_B = "";
      // let Clash_sec_C = "";
      if (sec_A != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_A.length; j++) {
            if (student_courses1[i].slot === sec_A[j].slot) {
              Clash_sec_A = 1;
            }
          }
        }
      }
      if (sec_B != false) {
        for (let i = 0; i < student_courses1.length; i++) {
          for (let j = 0; j < sec_B.length; j++) {
            console.log(student_courses1[i].slot, sec_B[j].slot);
            if (student_courses1[i].slot === sec_B[j].slot) {
              Clash_sec_B = 1;
            }
          }
        }
      }
      // if (sec_C != false) {
      //   for (let i = 0; i < student_courses1.length; i++) {
      //     for (let j = 0; j < sec_C.length; j++) {
      //       if (student_courses1[i].slot === sec_C[j].slot) {
      //         Clash_sec_C = 1;
      //       }
      //     }
      //   }
      // }
      let final_sections = [];
      if (Clash_sec_A === "") {
        if (sec_A != false) {
          final_sections.push(sec_A[0].class);
        }
      }
      if (Clash_sec_B === "") {
        if (sec_B != false) {
          final_sections.push(sec_B[0].class);
        }
      }
      // if (Clash_sec_C === "") {
      //   if (sec_C != false) {
      //     final_sections.push(sec_C[0].class);
      //   }
      // }
      res.json(final_sections);
    } else {
      let add_course_semester = "";
      const sos_cour = await SOS.find();
      const elec_cour = await ElectiveCourse.find();
      const courses = sos_cour.concat(elec_cour);
      if (!courses) {
        res.send("no courses in SOS");
      }
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseName === subject) {
          add_course_semester = courses[i].semester;
        }
      }

      //find all timetables of add_course_semester
      const record = await Timetable.find({ semester: add_course_semester });
      if (!record) {
        res.send("no record found of semester add course");
      }
      //find the section
      let final_sections = [];
      for (let i = 0; i < record.length; i++) {
        final_sections.push(record[i].class);
      }
      res.json(final_sections);
    }
  }
});

//---------------------Degree planner----------------------
router.get("/DegreePlanner", S_authenticate, async (req, res) => {
  const user = req.rootuser;
  const { semester } = user;
  if (semester === 1 || semester === 2 || semester === 3 || semester === 4) {
    res
      .status(400)
      .send(
        "Sorry! You must be at least in 5th semester to view recommended track!"
      );
  } else {
    if (semester === 5) {
      let courseMarks = [];
      const sems1 = req.rootuserSemester1;
      const sems2 = req.rootuserSemester2;
      const sems3 = req.rootuserSemester3;
      const sems4 = req.rootuserSemester4;
      const courses = sems1.concat(sems2, sems3, sems4);
      for (let i = 0; i < courses.length; i++) {
        if (
          courses[i].courseCode === "CSC241" ||
          courses[i].courseCode === "CSC291" ||
          courses[i].courseCode === "MTH231" ||
          courses[i].courseCode === "MTH262" ||
          courses[i].courseCode === "CSC371"
        ) {
          //also remove duplicate value
          if (courseMarks.length === 0) {
            courseMarks.push({
              courseCode: courses[i].courseCode,
              Marks: courses[i].marks,
            });
          } else {
            //if marks is greater than last one
            let duplicate = 0;
            if (courseMarks.length > 0) {
              for (let j = 0; j < courseMarks.length; j++) {
                if (courseMarks[j].courseCode === courses[i].courseCode) {
                  duplicate = 1;
                  if (courseMarks[j].Marks >= courses[i].marks) {
                    duplicate = 2;
                  } else {
                    courseMarks.splice(j, 1);
                    courseMarks.push({
                      courseCode: courses[i].courseCode,
                      Marks: courses[i].marks,
                    });
                  }
                }
              }
              if (duplicate === 0) {
                courseMarks.push({
                  courseCode: courses[i].courseCode,
                  Marks: courses[i].marks,
                });
              }
            }
          }
        }
      }
      // store marks in separate variable
      let CSC241 = -1;
      let CSC291 = -1;
      let MTH231 = -1;
      let MTH262 = -1;
      let CSC371 = -1;
      for (let i = 0; i < courseMarks.length; i++) {
        if (courseMarks[i].courseCode === "CSC241") {
          CSC241 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC291") {
          CSC291 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "MTH231") {
          MTH231 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "MTH262") {
          MTH262 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC371") {
          CSC371 = courseMarks[i].Marks;
        }
      }
      // res.json({ MTH262, MTH231, CSC291, CSC371, CSC241 });

      //logic
      if (
        CSC241 <= 0 &&
        CSC291 <= 0 &&
        MTH231 <= 0 &&
        MTH262 <= 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({
          data: "Sorry! We can't recommend you any track because you need to pass prerequisites first.",
        });
      } else if (
        CSC241 <= 0 &&
        CSC291 <= 0 &&
        MTH231 <= 0 &&
        MTH262 <= 0 &&
        CSC371 > 0
      ) {
        res
          .status(200)
          .json({ data: "Track 2", name: "Database Technologies" });
      } else if (
        CSC241 <= 0 &&
        CSC291 <= 0 &&
        MTH231 <= 0 &&
        MTH262 > 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({
          data: "Sorry! We can't recommend you any track because you need to pass prerequisites first.",
        });
      } else if (
        CSC241 <= 0 &&
        CSC291 <= 0 &&
        MTH231 <= 0 &&
        MTH262 > 0 &&
        CSC371 > 0
      ) {
        res
          .status(200)
          .json({ data: "Track 2", name: "Database Technologies" });
      } else if (
        CSC241 <= 0 &&
        CSC291 <= 0 &&
        MTH231 > 0 &&
        MTH262 <= 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({
          data: "Sorry! We can't recommend you any track because you need to pass prerequisites first.",
        });
      } else if (
        CSC241 <= 0 &&
        CSC291 <= 0 &&
        MTH231 > 0 &&
        MTH262 <= 0 &&
        CSC371 > 0
      ) {
        res
          .status(200)
          .json({ data: "Track 2", name: "Database Technologies" });
      } else if (
        CSC241 <= 0 &&
        CSC291 <= 0 &&
        MTH231 > 0 &&
        MTH262 > 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({
          data: "Track 3",
          name: "Artificial Intelligence and Graphics",
        });
      } else if (
        CSC241 <= 0 &&
        CSC291 <= 0 &&
        MTH231 > 0 &&
        MTH262 > 0 &&
        CSC371 > 0
      ) {
        res.status(200).json({
          data: "Track 3",
          name: "Artificial Intelligence and Graphics",
        });
      } else if (
        CSC241 <= 0 &&
        CSC291 > 0 &&
        MTH231 <= 0 &&
        MTH262 <= 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 <= 0 &&
        CSC291 > 0 &&
        MTH231 <= 0 &&
        MTH262 <= 0 &&
        CSC371 > 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 <= 0 &&
        CSC291 > 0 &&
        MTH231 <= 0 &&
        MTH262 > 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 <= 0 &&
        CSC291 > 0 &&
        MTH231 <= 0 &&
        MTH262 > 0 &&
        CSC371 > 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 <= 0 &&
        CSC291 > 0 &&
        MTH231 > 0 &&
        MTH262 <= 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 <= 0 &&
        CSC291 > 0 &&
        MTH231 > 0 &&
        MTH262 <= 0 &&
        CSC371 > 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 <= 0 &&
        CSC291 > 0 &&
        MTH231 > 0 &&
        MTH262 > 0 &&
        CSC371 <= 0 &&
        CSC291 > MTH262 &&
        CSC291 > MTH231
      ) {
        res.status(200).json({
          data: "Track 3",
          name: "Artificial Intelligence and Graphics",
        });
      } else if (
        CSC241 <= 0 &&
        CSC291 > 0 &&
        MTH231 > 0 &&
        MTH262 > 0 &&
        CSC371 <= 0
      ) {
        if (CSC291 < MTH262 || CSC291 < MTH231)
          res
            .status(200)
            .json({ data: "Track 2", name: "Database Technologies" });
      } else if (
        CSC241 <= 0 &&
        CSC291 > 0 &&
        MTH231 > 0 &&
        MTH262 > 0 &&
        CSC371 > 0
      ) {
        res.status(200).json({
          data: "Track 3",
          name: "Artificial Intelligence and Graphics",
        });
      } else if (
        CSC241 > 0 &&
        CSC291 <= 0 &&
        MTH231 <= 0 &&
        MTH262 <= 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 <= 0 &&
        MTH231 <= 0 &&
        MTH262 <= 0 &&
        CSC371 > 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 <= 0 &&
        MTH231 <= 0 &&
        MTH262 > 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 <= 0 &&
        MTH231 <= 0 &&
        MTH262 > 0 &&
        CSC371 > 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 <= 0 &&
        MTH231 <= 0 &&
        MTH262 > 0 &&
        CSC371 > 0
      ) {
        res
          .status(200)
          .json({ data: "Track 2", name: "Database Technologies" });
      } else if (
        CSC241 > 0 &&
        CSC291 <= 0 &&
        MTH231 > 0 &&
        MTH262 <= 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 <= 0 &&
        MTH231 > 0 &&
        MTH262 <= 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 <= 0 &&
        MTH231 > 0 &&
        MTH262 <= 0 &&
        CSC371 > 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 <= 0 &&
        MTH231 > 0 &&
        MTH262 > 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({
          data: "Track 3",
          name: "Artificial Intelligence and Graphics",
        });
      } else if (
        CSC241 > 0 &&
        CSC291 <= 0 &&
        MTH231 > 0 &&
        MTH262 > 0 &&
        CSC371 > 0
      ) {
        if (
          MTH231 > CSC241 &&
          MTH262 > CSC241 &&
          MTH262 > CSC371 &&
          MTH231 > CSC371
        ) {
          res.status(200).json({
            data: "Track 3",
            name: "Artificial Intelligence and Graphics",
          });
        } else {
          res
            .status(200)
            .json({ data: "Track 2", name: "Database Technologies" });
        }
      } else if (
        CSC241 > 0 &&
        CSC291 > 0 &&
        MTH231 <= 0 &&
        MTH262 <= 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 > 0 &&
        MTH231 <= 0 &&
        MTH262 <= 0 &&
        CSC371 > 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 > 0 &&
        MTH231 <= 0 &&
        MTH262 > 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 <= 0 &&
        MTH231 > 0 &&
        MTH262 > 0 &&
        CSC371 > 0
      ) {
        res.status(200).json({
          data: "Track 3",
          name: "Artificial Intelligence and Graphics",
        });
      } else if (
        CSC241 > 0 &&
        CSC291 > 0 &&
        MTH231 <= 0 &&
        MTH262 <= 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 > 0 &&
        MTH231 <= 0 &&
        MTH262 <= 0 &&
        CSC371 > 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 > 0 &&
        MTH231 <= 0 &&
        MTH262 > 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 > 0 &&
        MTH231 <= 0 &&
        MTH262 > 0 &&
        CSC371 > 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 > 0 &&
        MTH231 > 0 &&
        MTH262 <= 0 &&
        CSC371 <= 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC291 > 0 &&
        MTH231 > 0 &&
        MTH262 <= 0 &&
        CSC371 > 0
      ) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (
        CSC241 > 0 &&
        CSC241 > 0 &&
        MTH231 > 0 &&
        MTH262 > 0 &&
        CSC371 <= 0
      ) {
        if (MTH231 + MTH262 > CSC241 + CSC241) {
          res.status(200).json({
            data: "Track 3",
            name: "Artificial Intelligence and Graphics",
          });
        } else {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        }
      } else if (
        CSC241 > 0 &&
        CSC291 > 0 &&
        MTH231 > 0 &&
        MTH262 > 0 &&
        CSC371 > 0
      ) {
        if (CSC241 > 80) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (MTH231 + MTH262 > CSC241 + CSC291 && CSC371 < 75) {
          res.status(200).json({
            data: "Track 3",
            name: "Artificial Intelligence and Graphics",
          });
        } else if (MTH231 + MTH262 <= CSC241 + CSC291 && CSC371 < 75) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (MTH231 + MTH262 <= CSC241 + CSC291 && CSC371 > 75) {
          res
            .status(200)
            .json({ data: "Track 2", name: "Database Technologies" });
        } else {
          res
            .status(200)
            .json({ data: "Track 2", name: "Database Technologies" });
        }
      }
    } else if (semester === 6) {
      let courseMarks = [];
      const sems1 = req.rootuserSemester1;
      const sems2 = req.rootuserSemester2;
      const sems3 = req.rootuserSemester3;
      const sems4 = req.rootuserSemester4;
      const sems5 = req.rootuserSemester5;
      const courses = sems1.concat(sems2, sems3, sems4, sems5);
      for (let i = 0; i < courses.length; i++) {
        if (
          courses[i].courseCode === "CSC241" ||
          courses[i].courseCode === "CSC291" ||
          courses[i].courseCode === "MTH231" ||
          courses[i].courseCode === "MTH262" ||
          courses[i].courseCode === "CSC371" ||
          courses[i].courseCode === "CSC303" ||
          courses[i].courseCode === "CSC494" ||
          courses[i].courseCode === "CSC495" ||
          courses[i].courseCode === "CSC347" ||
          courses[i].courseCode === "CSC461" ||
          courses[i].courseCode === "CSC496" ||
          courses[i].courseCode === "CSC331" ||
          courses[i].courseCode === "CSC353" ||
          courses[i].courseCode === "CSC354" ||
          courses[i].courseCode === "CSC355"
        ) {
          //also remove duplicate value
          if (courseMarks.length === 0) {
            courseMarks.push({
              courseCode: courses[i].courseCode,
              Marks: courses[i].marks,
            });
          } else {
            let duplicate = 0;
            if (courseMarks.length > 0) {
              for (let j = 0; j < courseMarks.length; j++) {
                if (courseMarks[j].courseCode === courses[i].courseCode) {
                  duplicate = 1;
                }
              }
              if (duplicate === 0) {
                courseMarks.push({
                  courseCode: courses[i].courseCode,
                  Marks: courses[i].marks,
                });
              }
            }
          }
        }
      }
      // store marks in separate variable
      let CSC241 = -1;
      let CSC291 = -1;
      let MTH231 = -1;
      let MTH262 = -1;
      let CSC371 = -1;
      let CSC303 = -1;
      let CSC494 = -1;
      let CSC495 = -1;
      let CSC347 = -1;
      let CSC461 = -1;
      let CSC496 = -1;
      let CSC331 = -1;
      let CSC353 = -1;
      let CSC354 = -1;
      let CSC355 = -1;
      for (let i = 0; i < courseMarks.length; i++) {
        if (courseMarks[i].courseCode === "CSC241") {
          CSC241 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC291") {
          CSC291 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "MTH231") {
          MTH231 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "MTH262") {
          MTH262 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC371") {
          CSC371 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC303") {
          CSC303 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC494") {
          CSC494 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC495") {
          CSC495 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC347") {
          CSC347 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC461") {
          CSC461 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC496") {
          CSC496 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC331") {
          CSC331 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC353") {
          CSC353 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC354") {
          CSC354 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC355") {
          CSC355 = courseMarks[i].Marks;
        }
      }

      //logic
      if (CSC303 == 0 || CSC303 >= 3) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (CSC494 == 0 || CSC494 >= 3) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (CSC495 == 0 || CSC495 >= 3) {
        res.status(200).json({ data: "Track 1", name: "Software Development" });
      } else if (CSC347 == 0 || CSC347 >= 3) {
        res
          .status(200)
          .json({ data: "Track 2", name: "Database Technologies" });
      } else if (CSC461 == 0 || CSC461 >= 3) {
        res
          .status(200)
          .json({ data: "Track 2", name: "Database Technologies" });
      } else if (CSC461 == 0 || CSC461 >= 3) {
        res
          .status(200)
          .json({ data: "Track 2", name: "Database Technologies" });
      } else if (CSC461 == 0 || CSC461 >= 3) {
        res.status(200).json({
          data: "Track 3",
          name: "Artificial Intelligence and Graphics",
        });
      } else if (CSC353 == 0 || CSC353 >= 3) {
        res.status(200).json({
          data: "Track 3",
          name: "Artificial Intelligence and Graphics",
        });
      } else if (CSC354 == 0 || CSC354 >= 3) {
        res.status(200).json({
          data: "Track 3",
          name: "Artificial Intelligence and Graphics",
        });
      } else if (CSC354 == 0 || CSC354 >= 3) {
        res.status(200).json({
          data: "Track 3",
          name: "Artificial Intelligence and Graphics",
        });
      } else {
        if (
          CSC241 <= 0 &&
          CSC291 <= 0 &&
          MTH231 <= 0 &&
          MTH262 <= 0 &&
          CSC371 <= 0
        ) {
          res.status(200).json({
            data: "Sorry! We can't recommend you any track because you need to pass prerequisites first.",
          });
        } else if (
          CSC241 <= 0 &&
          CSC291 <= 0 &&
          MTH231 <= 0 &&
          MTH262 <= 0 &&
          CSC371 > 0
        ) {
          res
            .status(200)
            .json({ data: "Track 2", name: "Database Technologies" });
        } else if (
          CSC241 <= 0 &&
          CSC291 <= 0 &&
          MTH231 <= 0 &&
          MTH262 > 0 &&
          CSC371 <= 0
        ) {
          res.status(200).json({
            data: "Sorry! We can't recommend you any track because you need to pass prerequisites first.",
          });
        } else if (
          CSC241 <= 0 &&
          CSC291 <= 0 &&
          MTH231 <= 0 &&
          MTH262 > 0 &&
          CSC371 > 0
        ) {
          res
            .status(200)
            .json({ data: "Track 2", name: "Database Technologies" });
        } else if (
          CSC241 <= 0 &&
          CSC291 <= 0 &&
          MTH231 > 0 &&
          MTH262 <= 0 &&
          CSC371 <= 0
        ) {
          res.status(200).json({
            data: "Sorry! We can't recommend you any track because you need to pass prerequisites first.",
          });
        } else if (
          CSC241 <= 0 &&
          CSC291 <= 0 &&
          MTH231 > 0 &&
          MTH262 <= 0 &&
          CSC371 > 0
        ) {
          res
            .status(200)
            .json({ data: "Track 2", name: "Database Technologies" });
        } else if (
          CSC241 <= 0 &&
          CSC291 <= 0 &&
          MTH231 > 0 &&
          MTH262 > 0 &&
          CSC371 <= 0
        ) {
          res.status(200).json({
            data: "Track 3",
            name: "Artificial Intelligence and Graphics",
          });
        } else if (
          CSC241 <= 0 &&
          CSC291 <= 0 &&
          MTH231 > 0 &&
          MTH262 > 0 &&
          CSC371 > 0
        ) {
          res.status(200).json({
            data: "Track 3",
            name: "Artificial Intelligence and Graphics",
          });
        } else if (
          CSC241 <= 0 &&
          CSC291 > 0 &&
          MTH231 <= 0 &&
          MTH262 <= 0 &&
          CSC371 <= 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 <= 0 &&
          CSC291 > 0 &&
          MTH231 <= 0 &&
          MTH262 <= 0 &&
          CSC371 > 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 <= 0 &&
          CSC291 > 0 &&
          MTH231 <= 0 &&
          MTH262 > 0 &&
          CSC371 <= 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 <= 0 &&
          CSC291 > 0 &&
          MTH231 <= 0 &&
          MTH262 > 0 &&
          CSC371 > 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 <= 0 &&
          CSC291 > 0 &&
          MTH231 > 0 &&
          MTH262 <= 0 &&
          CSC371 <= 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 <= 0 &&
          CSC291 > 0 &&
          MTH231 > 0 &&
          MTH262 <= 0 &&
          CSC371 > 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 <= 0 &&
          CSC291 > 0 &&
          MTH231 > 0 &&
          MTH262 > 0 &&
          CSC371 <= 0 &&
          CSC291 > MTH262 &&
          CSC291 > MTH231
        ) {
          res.status(200).json({
            data: "Track 3",
            name: "Artificial Intelligence and Graphics",
          });
        } else if (
          CSC241 <= 0 &&
          CSC291 > 0 &&
          MTH231 > 0 &&
          MTH262 > 0 &&
          CSC371 <= 0
        ) {
          if (CSC291 < MTH262 || CSC291 < MTH231)
            res
              .status(200)
              .json({ data: "Track 2", name: "Database Technologies" });
        } else if (
          CSC241 <= 0 &&
          CSC291 > 0 &&
          MTH231 > 0 &&
          MTH262 > 0 &&
          CSC371 > 0
        ) {
          res.status(200).json({
            data: "Track 3",
            name: "Artificial Intelligence and Graphics",
          });
        } else if (
          CSC241 > 0 &&
          CSC291 <= 0 &&
          MTH231 <= 0 &&
          MTH262 <= 0 &&
          CSC371 <= 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 <= 0 &&
          MTH231 <= 0 &&
          MTH262 <= 0 &&
          CSC371 > 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 <= 0 &&
          MTH231 <= 0 &&
          MTH262 > 0 &&
          CSC371 <= 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 <= 0 &&
          MTH231 <= 0 &&
          MTH262 > 0 &&
          CSC371 > 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 <= 0 &&
          MTH231 <= 0 &&
          MTH262 > 0 &&
          CSC371 > 0
        ) {
          res
            .status(200)
            .json({ data: "Track 2", name: "Database Technologies" });
        } else if (
          CSC241 > 0 &&
          CSC291 <= 0 &&
          MTH231 > 0 &&
          MTH262 <= 0 &&
          CSC371 <= 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 <= 0 &&
          MTH231 > 0 &&
          MTH262 <= 0 &&
          CSC371 <= 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 <= 0 &&
          MTH231 > 0 &&
          MTH262 <= 0 &&
          CSC371 > 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 <= 0 &&
          MTH231 > 0 &&
          MTH262 > 0 &&
          CSC371 <= 0
        ) {
          res.status(200).json({
            data: "Track 3",
            name: "Artificial Intelligence and Graphics",
          });
        } else if (
          CSC241 > 0 &&
          CSC291 <= 0 &&
          MTH231 > 0 &&
          MTH262 > 0 &&
          CSC371 > 0
        ) {
          if (
            MTH231 > CSC241 &&
            MTH262 > CSC241 &&
            MTH262 > CSC371 &&
            MTH231 > CSC371
          ) {
            res.status(200).json({
              data: "Track 3",
              name: "Artificial Intelligence and Graphics",
            });
          } else {
            res
              .status(200)
              .json({ data: "Track 2", name: "Database Technologies" });
          }
        } else if (
          CSC241 > 0 &&
          CSC291 > 0 &&
          MTH231 <= 0 &&
          MTH262 <= 0 &&
          CSC371 <= 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 > 0 &&
          MTH231 <= 0 &&
          MTH262 <= 0 &&
          CSC371 > 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 > 0 &&
          MTH231 <= 0 &&
          MTH262 > 0 &&
          CSC371 <= 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 <= 0 &&
          MTH231 > 0 &&
          MTH262 > 0 &&
          CSC371 > 0
        ) {
          res.status(200).json({
            data: "Track 3",
            name: "Artificial Intelligence and Graphics",
          });
        } else if (
          CSC241 > 0 &&
          CSC291 > 0 &&
          MTH231 <= 0 &&
          MTH262 <= 0 &&
          CSC371 <= 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 > 0 &&
          MTH231 <= 0 &&
          MTH262 <= 0 &&
          CSC371 > 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 > 0 &&
          MTH231 <= 0 &&
          MTH262 > 0 &&
          CSC371 <= 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 > 0 &&
          MTH231 <= 0 &&
          MTH262 > 0 &&
          CSC371 > 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 > 0 &&
          MTH231 > 0 &&
          MTH262 <= 0 &&
          CSC371 <= 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC291 > 0 &&
          MTH231 > 0 &&
          MTH262 <= 0 &&
          CSC371 > 0
        ) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (
          CSC241 > 0 &&
          CSC241 > 0 &&
          MTH231 > 0 &&
          MTH262 > 0 &&
          CSC371 <= 0
        ) {
          if (MTH231 + MTH262 > CSC241 + CSC241) {
            res.status(200).json({
              data: "Track 3",
              name: "Artificial Intelligence and Graphics",
            });
          } else {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          }
        } else if (
          CSC241 > 0 &&
          CSC291 > 0 &&
          MTH231 > 0 &&
          MTH262 > 0 &&
          CSC371 > 0
        ) {
          if (CSC241 > 80) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (MTH231 + MTH262 > CSC241 + CSC291 && CSC371 < 75) {
            res.status(200).json({
              data: "Track 3",
              name: "Artificial Intelligence and Graphics",
            });
          } else if (MTH231 + MTH262 <= CSC241 + CSC291 && CSC371 < 75) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (MTH231 + MTH262 <= CSC241 + CSC291 && CSC371 > 75) {
            res
              .status(200)
              .json({ data: "Track 2", name: "Database Technologies" });
          } else {
            res
              .status(200)
              .json({ data: "Track 2", name: "Database Technologies" });
          }
        }
      }
    } else if (semester === 7) {
      let count1 = 0;
      let count2 = 0;
      let count3 = 0;
      let courseMarks = [];
      const sems1 = req.rootuserSemester1;
      const sems2 = req.rootuserSemester2;
      const sems3 = req.rootuserSemester3;
      const sems4 = req.rootuserSemester4;
      const sems5 = req.rootuserSemester5;
      const sems6 = req.rootuserSemester6;
      const courses = sems1.concat(sems2, sems3, sems4, sems5, sems6);
      for (let i = 0; i < courses.length; i++) {
        if (
          courses[i].courseCode === "CSC241" ||
          courses[i].courseCode === "CSC291" ||
          courses[i].courseCode === "MTH231" ||
          courses[i].courseCode === "MTH262" ||
          courses[i].courseCode === "CSC371" ||
          courses[i].courseCode === "CSC303" ||
          courses[i].courseCode === "CSC494" ||
          courses[i].courseCode === "CSC495" ||
          courses[i].courseCode === "CSC347" ||
          courses[i].courseCode === "CSC461" ||
          courses[i].courseCode === "CSC496" ||
          courses[i].courseCode === "CSC331" ||
          courses[i].courseCode === "CSC353" ||
          courses[i].courseCode === "CSC354" ||
          courses[i].courseCode === "CSC355"
        ) {
          //also remove duplicate value
          if (courseMarks.length === 0) {
            courseMarks.push({
              courseCode: courses[i].courseCode,
              Marks: courses[i].marks,
            });
          } else {
            let duplicate = 0;
            if (courseMarks.length > 0) {
              for (let j = 0; j < courseMarks.length; j++) {
                if (courseMarks[j].courseCode === courses[i].courseCode) {
                  duplicate = 1;
                }
              }
              if (duplicate === 0) {
                courseMarks.push({
                  courseCode: courses[i].courseCode,
                  Marks: courses[i].marks,
                });
              }
            }
          }
        }
      }
      // store marks in separate variable
      let CSC241 = -1;
      let CSC291 = -1;
      let MTH231 = -1;
      let MTH262 = -1;
      let CSC371 = -1;
      let CSC303 = -1;
      let CSC494 = -1;
      let CSC495 = -1;
      let CSC347 = -1;
      let CSC461 = -1;
      let CSC496 = -1;
      let CSC331 = -1;
      let CSC353 = -1;
      let CSC354 = -1;
      let CSC355 = -1;

      for (let i = 0; i < courseMarks.length; i++) {
        if (courseMarks[i].courseCode === "CSC241") {
          CSC241 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC291") {
          CSC291 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "MTH231") {
          MTH231 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "MTH262") {
          MTH262 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC371") {
          CSC371 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC303") {
          CSC303 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC494") {
          CSC494 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC495") {
          CSC495 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC347") {
          CSC347 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC461") {
          CSC461 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC496") {
          CSC496 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC331") {
          CSC331 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC353") {
          CSC353 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC354") {
          CSC354 = courseMarks[i].Marks;
        } else if (courseMarks[i].courseCode === "CSC355") {
          CSC355 = courseMarks[i].Marks;
        }
      }
      if (CSC303 >= 0) {
        count1 = count1 + 1;
      }
      if (CSC494 >= 0) {
        count1 = count1 + 1;
      }
      if (CSC495 >= 0) {
        count1 = count1 + 1;
      }
      if (CSC347 >= 0) {
        count2 = count2 + 1;
      }
      if (CSC461 >= 0) {
        count2 = count2 + 1;
      }
      if (CSC496 >= 0) {
        count2 = count2 + 1;
      }
      if (CSC331 >= 0) {
        count3 = count3 + 1;
      }
      if (CSC353 >= 0) {
        count3 = count3 + 1;
      }
      if (CSC354 >= 0) {
        count3 = count3 + 1;
      }
      if (CSC355 >= 0) {
        count3 = count3 + 1;
      }
      if (count1 >= 3) {
        res.status(200).json({
          data: "You have already completed track 1, so you can study any courses from any other track.",
        });
      } else if (count2 >= 3) {
        res.status(200).json({
          data: "You have already completed track 1, so you can study any courses from any other track.",
        });
      } else if (count3 >= 3) {
        res.status(200).json({
          data: "You have already completed track 1, so you can study any courses from any other track.",
        });
      } else if (count1 == 2) {
        res.status(200).json({
          data: "You are already following track 1, so you are advised to complete it.",
        });
      } else if (count2 == 2) {
        res.status(200).json({
          data: "You are already following track 2, so you are advised to complete it.",
        });
      } else if (count3 == 2) {
        res.status(200).json({
          data: "You are already following track 3, so you are advised to complete it.",
        });
      } else {
        if (CSC303 == 0 || CSC303 >= 3) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (CSC494 == 0 || CSC494 >= 3) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (CSC495 == 0 || CSC495 >= 3) {
          res
            .status(200)
            .json({ data: "Track 1", name: "Software Development" });
        } else if (CSC347 == 0 || CSC347 >= 3) {
          res
            .status(200)
            .json({ data: "Track 2", name: "Database Technologies" });
        } else if (CSC461 == 0 || CSC461 >= 3) {
          res
            .status(200)
            .json({ data: "Track 2", name: "Database Technologies" });
        } else if (CSC461 == 0 || CSC461 >= 3) {
          res
            .status(200)
            .json({ data: "Track 2", name: "Database Technologies" });
        } else if (CSC461 == 0 || CSC461 >= 3) {
          res.status(200).json({
            data: "Track 3",
            name: "Artificial Intelligence and Graphics",
          });
        } else if (CSC353 == 0 || CSC353 >= 3) {
          res.status(200).json({
            data: "Track 3",
            name: "Artificial Intelligence and Graphics",
          });
        } else if (CSC354 == 0 || CSC354 >= 3) {
          res.status(200).json({
            data: "Track 3",
            name: "Artificial Intelligence and Graphics",
          });
        } else if (CSC354 == 0 || CSC354 >= 3) {
          res.status(200).json({
            data: "Track 3",
            name: "Artificial Intelligence and Graphics",
          });
        } else {
          if (
            CSC241 <= 0 &&
            CSC291 <= 0 &&
            MTH231 <= 0 &&
            MTH262 <= 0 &&
            CSC371 <= 0
          ) {
            res.status(200).json({
              data: "Sorry! We can't recommend you any track because you need to pass prerequisites first.",
            });
          } else if (
            CSC241 <= 0 &&
            CSC291 <= 0 &&
            MTH231 <= 0 &&
            MTH262 <= 0 &&
            CSC371 > 0
          ) {
            res
              .status(200)
              .json({ data: "Track 2", name: "Database Technologies" });
          } else if (
            CSC241 <= 0 &&
            CSC291 <= 0 &&
            MTH231 <= 0 &&
            MTH262 > 0 &&
            CSC371 <= 0
          ) {
            res.status(200).json({
              data: "Sorry! We can't recommend you any track because you need to pass prerequisites first.",
            });
          } else if (
            CSC241 <= 0 &&
            CSC291 <= 0 &&
            MTH231 <= 0 &&
            MTH262 > 0 &&
            CSC371 > 0
          ) {
            res
              .status(200)
              .json({ data: "Track 2", name: "Database Technologies" });
          } else if (
            CSC241 <= 0 &&
            CSC291 <= 0 &&
            MTH231 > 0 &&
            MTH262 <= 0 &&
            CSC371 <= 0
          ) {
            res.status(200).json({
              data: "Sorry! We can't recommend you any track because you need to pass prerequisites first.",
            });
          } else if (
            CSC241 <= 0 &&
            CSC291 <= 0 &&
            MTH231 > 0 &&
            MTH262 <= 0 &&
            CSC371 > 0
          ) {
            res
              .status(200)
              .json({ data: "Track 2", name: "Database Technologies" });
          } else if (
            CSC241 <= 0 &&
            CSC291 <= 0 &&
            MTH231 > 0 &&
            MTH262 > 0 &&
            CSC371 <= 0
          ) {
            res.status(200).json({
              data: "Track 3",
              name: "Artificial Intelligence and Graphics",
            });
          } else if (
            CSC241 <= 0 &&
            CSC291 <= 0 &&
            MTH231 > 0 &&
            MTH262 > 0 &&
            CSC371 > 0
          ) {
            res.status(200).json({
              data: "Track 3",
              name: "Artificial Intelligence and Graphics",
            });
          } else if (
            CSC241 <= 0 &&
            CSC291 > 0 &&
            MTH231 <= 0 &&
            MTH262 <= 0 &&
            CSC371 <= 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 <= 0 &&
            CSC291 > 0 &&
            MTH231 <= 0 &&
            MTH262 <= 0 &&
            CSC371 > 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 <= 0 &&
            CSC291 > 0 &&
            MTH231 <= 0 &&
            MTH262 > 0 &&
            CSC371 <= 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 <= 0 &&
            CSC291 > 0 &&
            MTH231 <= 0 &&
            MTH262 > 0 &&
            CSC371 > 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 <= 0 &&
            CSC291 > 0 &&
            MTH231 > 0 &&
            MTH262 <= 0 &&
            CSC371 <= 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 <= 0 &&
            CSC291 > 0 &&
            MTH231 > 0 &&
            MTH262 <= 0 &&
            CSC371 > 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 <= 0 &&
            CSC291 > 0 &&
            MTH231 > 0 &&
            MTH262 > 0 &&
            CSC371 <= 0 &&
            CSC291 > MTH262 &&
            CSC291 > MTH231
          ) {
            res.status(200).json({
              data: "Track 3",
              name: "Artificial Intelligence and Graphics",
            });
          } else if (
            CSC241 <= 0 &&
            CSC291 > 0 &&
            MTH231 > 0 &&
            MTH262 > 0 &&
            CSC371 <= 0
          ) {
            if (CSC291 < MTH262 || CSC291 < MTH231)
              res
                .status(200)
                .json({ data: "Track 2", name: "Database Technologies" });
          } else if (
            CSC241 <= 0 &&
            CSC291 > 0 &&
            MTH231 > 0 &&
            MTH262 > 0 &&
            CSC371 > 0
          ) {
            res.status(200).json({
              data: "Track 3",
              name: "Artificial Intelligence and Graphics",
            });
          } else if (
            CSC241 > 0 &&
            CSC291 <= 0 &&
            MTH231 <= 0 &&
            MTH262 <= 0 &&
            CSC371 <= 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 <= 0 &&
            MTH231 <= 0 &&
            MTH262 <= 0 &&
            CSC371 > 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 <= 0 &&
            MTH231 <= 0 &&
            MTH262 > 0 &&
            CSC371 <= 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 <= 0 &&
            MTH231 <= 0 &&
            MTH262 > 0 &&
            CSC371 > 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 <= 0 &&
            MTH231 <= 0 &&
            MTH262 > 0 &&
            CSC371 > 0
          ) {
            res
              .status(200)
              .json({ data: "Track 2", name: "Database Technologies" });
          } else if (
            CSC241 > 0 &&
            CSC291 <= 0 &&
            MTH231 > 0 &&
            MTH262 <= 0 &&
            CSC371 <= 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 <= 0 &&
            MTH231 > 0 &&
            MTH262 <= 0 &&
            CSC371 <= 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 <= 0 &&
            MTH231 > 0 &&
            MTH262 <= 0 &&
            CSC371 > 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 <= 0 &&
            MTH231 > 0 &&
            MTH262 > 0 &&
            CSC371 <= 0
          ) {
            res.status(200).json({
              data: "Track 3",
              name: "Artificial Intelligence and Graphics",
            });
          } else if (
            CSC241 > 0 &&
            CSC291 <= 0 &&
            MTH231 > 0 &&
            MTH262 > 0 &&
            CSC371 > 0
          ) {
            if (
              MTH231 > CSC241 &&
              MTH262 > CSC241 &&
              MTH262 > CSC371 &&
              MTH231 > CSC371
            ) {
              res.status(200).json({
                data: "Track 3",
                name: "Artificial Intelligence and Graphics",
              });
            } else {
              res
                .status(200)
                .json({ data: "Track 2", name: "Database Technologies" });
            }
          } else if (
            CSC241 > 0 &&
            CSC291 > 0 &&
            MTH231 <= 0 &&
            MTH262 <= 0 &&
            CSC371 <= 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 > 0 &&
            MTH231 <= 0 &&
            MTH262 <= 0 &&
            CSC371 > 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 > 0 &&
            MTH231 <= 0 &&
            MTH262 > 0 &&
            CSC371 <= 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 <= 0 &&
            MTH231 > 0 &&
            MTH262 > 0 &&
            CSC371 > 0
          ) {
            res.status(200).json({
              data: "Track 3",
              name: "Artificial Intelligence and Graphics",
            });
          } else if (
            CSC241 > 0 &&
            CSC291 > 0 &&
            MTH231 <= 0 &&
            MTH262 <= 0 &&
            CSC371 <= 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 > 0 &&
            MTH231 <= 0 &&
            MTH262 <= 0 &&
            CSC371 > 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 > 0 &&
            MTH231 <= 0 &&
            MTH262 > 0 &&
            CSC371 <= 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 > 0 &&
            MTH231 <= 0 &&
            MTH262 > 0 &&
            CSC371 > 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 > 0 &&
            MTH231 > 0 &&
            MTH262 <= 0 &&
            CSC371 <= 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC291 > 0 &&
            MTH231 > 0 &&
            MTH262 <= 0 &&
            CSC371 > 0
          ) {
            res
              .status(200)
              .json({ data: "Track 1", name: "Software Development" });
          } else if (
            CSC241 > 0 &&
            CSC241 > 0 &&
            MTH231 > 0 &&
            MTH262 > 0 &&
            CSC371 <= 0
          ) {
            if (MTH231 + MTH262 > CSC241 + CSC241) {
              res.status(200).json({
                data: "Track 3",
                name: "Artificial Intelligence and Graphics",
              });
            } else {
              res
                .status(200)
                .json({ data: "Track 1", name: "Software Development" });
            }
          } else if (
            CSC241 > 0 &&
            CSC291 > 0 &&
            MTH231 > 0 &&
            MTH262 > 0 &&
            CSC371 > 0
          ) {
            if (CSC241 > 80) {
              res
                .status(200)
                .json({ data: "Track 1", name: "Software Development" });
            } else if (MTH231 + MTH262 > CSC241 + CSC291 && CSC371 < 75) {
              res.status(200).json({
                data: "Track 3",
                name: "Artificial Intelligence and Graphics",
              });
            } else if (MTH231 + MTH262 <= CSC241 + CSC291 && CSC371 < 75) {
              res
                .status(200)
                .json({ data: "Track 1", name: "Software Development" });
            } else if (MTH231 + MTH262 <= CSC241 + CSC291 && CSC371 > 75) {
              res
                .status(200)
                .json({ data: "Track 2", name: "Database Technologies" });
            } else {
              res
                .status(200)
                .json({ data: "Track 2", name: "Database Technologies" });
            }
          }
        }
      }
    } else {
      res.status(200).json({
        data: "You can follow your previously choosen track.",
      });
    }
  }
});

//get sos course and elective courses
router.get("/AllCourses", S_authenticate, async (req, res) => {
  const sos = await SOS.find();
  const elec = await ElectiveCourse.find();
  for (let i = 0; i < sos.length; i++) {
    if (sos[i].courseCode === "--") {
      sos.splice(i, 1);
    }
  }
  const courses = sos.concat(elec);
  res.send(courses);
});

//------------------------post data in pendingadd course
//when click on add
router.post("/AddpendingCourses", S_authenticate, async (req, res) => {
  const {
    courseName,
    courseCode,
    credits,
    section,
    preReqCourse,
    preTest,
    reason,
  } = req.body;
  console.log(req.body.preReqCourse, "dsafhbbsdfs");
  console.log(reason, preReqCourse, "qwreqw");
  const { registrationId } = req.rootuser;
  const record = await PendingAddCourse.findOne({ registrationId });
  // res.send(record);
  if (!record) {
    const addrecord = new PendingAddCourse({
      registrationId,
    });
    await addrecord.add_courses(
      courseName,
      courseCode,
      credits,
      section,
      preReqCourse,
      preTest,
      reason
    );
    // await preReqCourse.add_preReq(course)
    await addrecord.save();
    res.send(addrecord);
  } else {
    await record.add_courses(
      courseName,
      courseCode,
      credits,
      section,
      preReqCourse,
      preTest,
      reason
    );
    await record.save();
    res.send(record);
  }
});
//get all the pending addcourses
router.get("/AddCourses", S_authenticate, async (req, res) => {
  const { registrationId } = req.rootuser;
  const record = await PendingAddCourse.findOne({ registrationId });
  if (!record) {
    res.send("no record found");
  } else {
    res.send(record.courses);
  }
});
//delete all records in pendingadd course
router.delete("/deleteRecord", S_authenticate, async (req, res) => {
  const { registrationId } = req.rootuser;
  const record = await PendingAddCourse.findOne({ registrationId });
  if (record) {
    await record.delete();
    res.send("deleted");
  } else {
    res.send("record deleted");
  }
});
//delete specific data from courseCode
router.delete(
  "/DeleteSpecificRecord/:courseName",
  S_authenticate,
  async (req, res) => {
    const { courseName } = req.params;
    console.log(courseName);
    const { registrationId } = req.rootuser;
    const record = await PendingAddCourse.findOne({ registrationId });
    if (!record) {
      res.status(400).send("no record found");
    } else {
      for (let i = 0; i < record.courses.length; i++) {
        if (record.courses.length === 1) {
          await record.delete();
          res.status(200).json("deleted");
        } else {
          if (record.courses[i].courseName === courseName) {
            await record.courses.splice(i, 1);
            await record.save();
          }
          res.status(200).json("deleted");
        }
      }
    }
  }
);

//submit button
router.post(
  "/submit_AddForm",
  upload1.single("fee"),
  S_authenticate,
  async (req, res) => {
    const student = req.rootuser;
    const {
      batch,
      registrationId,
      semester,
      name,
      email,
      section,
      address,
      request,
      contactNo,
    } = student;
    const { CGPA } = student.Result[0];
    // const result = await cloudinary.uploader.upload(req.file.path);
    // res.send(result);
    let courses = [];
    const addcourses = await PendingAddCourse.findOne({ registrationId });
    if (!addcourses) {
      res.send("do not have any course to add");
    } else {
      // res.send(addcourses);
      for (let i = 0; i < addcourses.courses.length; i++) {
        courses.push({
          courseCode: addcourses.courses[i].courseCode,
          courseName: addcourses.courses[i].courseName,
          credits: addcourses.courses[i].credits,
          courseSection: addcourses.courses[i].section,
          preTest: addcourses.courses[i].preTest,
          preReqCourse: addcourses.courses[i].preReqCourse,
          reason: addcourses.courses[i].reason,
        });
      }

      // res.send(courses);
      const result = await cloudinary.uploader.upload(req.file.path);
      // res.send(result);
      const fee = result.secure_url;
      const data = await AddCourse.findOne({ registrationId });
      // res.send(data);
      if (!data || data === false) {
        const add = new AddCourse({
          fee,
          batch,
          registrationId,
          semester,
          name,
          email,
          section,
          address,
          request,
          contactNo,
          CGPA,
        });
        for (let i = 0; i < courses.length; i++) {
          await add.add_course(
            courses[i].courseName,
            courses[i].courseCode,
            courses[i].credits,
            courses[i].courseSection,
            courses[i].preTest,
            courses[i].preReqCourse,
            courses[i].reason
          );
          await add.save();
        }
        // res.send(add);
        //add in student record
        const student = await Student.findOne({ registrationId });
        if (student.semester === 1) {
          // const record = req.rootuserSemester1;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester1.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 2) {
          // const record = req.rootuserSemester1;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester2.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 3) {
          // const record = req.rootuserSemester1;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester3.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 4) {
          // const record = req.rootuserSemester1;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester4.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 5) {
          // const record = req.rootuserSemester1;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester5.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 6) {
          // const record = req.rootuserSemester1;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester6.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 7) {
          // const record = req.rootuserSemester1;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester7.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 8) {
          // const record = req.rootuserSemester1;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester8.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 9) {
          // const record = req.rootuserSemester1;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester9.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              // marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 10) {
          // const record = req.rootuserSemester1;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester10.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              // marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 11) {
          // const record = req.rootuserSemester1;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester11.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              // marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 12) {
          // const record = req.rootuserSemester1;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester12.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              // marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        }
      } else {
        // console.log(data.courses);
        data.fee = fee;
        for (let i = 0; i < courses.length; i++) {
          await data.add_course(
            courses[i].courseName,
            courses[i].courseCode,
            courses[i].credits,
            courses[i].courseSection,
            courses[i].preTest,
            courses[i].preReqCourse,
            courses[i].reason
          );
          await data.save();
        }
        const student = await Student.findOne({ registrationId });
        if (student.semester === 1) {
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester1.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 2) {
          // const record = req.rootuserSemester2;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester2.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 3) {
          // const record = req.rootuserSemester3;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester3.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 4) {
          // const record = req.rootuserSemester4;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester4.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 5) {
          // const record = req.rootuserSemester5;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester5.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 6) {
          // const record = req.rootuserSemester6;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester6.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 7) {
          // const record = req.rootuserSemester7;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester7.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 8) {
          // const record = req.rootuserSemester8;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester8.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 9) {
          // const record = req.rootuserSemester9;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester9.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 10) {
          // const record = req.rootuserSemester10;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester10.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 11) {
          // const record = req.rootuserSemester11;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester11.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        } else if (student.semester === 12) {
          // const record = req.rootuserSemester12;
          for (let i = 0; i < courses.length; i++) {
            await student.Result[0].Semester12.push({
              courseName: courses[i].courseName,
              courseCode: courses[i].courseCode,
              credits: courses[i].credits,
              courseSection: courses[i].courseSection,
              marks: 0,
              // gp: 0,
              status: "Add Pending",
            });
          }
          await student.save();
          //remove courses from pending add course
          await addcourses.delete();
          res.send(student);
        }
      }
    }
  }
);
//----------------------------home page of student
//----------------------credits hours
router.get("/Home_credits", S_authenticate, async (req, res) => {
  const student = req.rootuser;
  const { registrationId, semester } = student;
  let cred = 0;
  if (semester === 1) {
    for (let i = 0; i < student.Result[0].Semester1.length; i++) {
      if (student.Result[0].Semester1[i].status === "enrolled") {
        cred += student.Result[0].Semester1[i].credits;
      }
    }
    res.json(cred);
  } else if (semester === 2) {
    for (let i = 0; i < student.Result[0].Semester2.length; i++) {
      if (student.Result[0].Semester2[i].status === "enrolled") {
        cred += student.Result[0].Semester2[i].credits;
      }
    }
    res.json(cred);
  } else if (semester === 3) {
    for (let i = 0; i < student.Result[0].Semester3.length; i++) {
      if (student.Result[0].Semester3[i].status === "enrolled") {
        cred += student.Result[0].Semester3[i].credits;
      }
    }
    res.json(cred);
  } else if (semester === 4) {
    for (let i = 0; i < student.Result[0].Semester4.length; i++) {
      if (student.Result[0].Semester4[i].status === "enrolled") {
        cred += student.Result[0].Semester4[i].credits;
      }
    }
    res.json(cred);
  } else if (semester === 5) {
    for (let i = 0; i < student.Result[0].Semester5.length; i++) {
      if (student.Result[0].Semester5[i].status === "enrolled") {
        cred += student.Result[0].Semester5[i].credits;
      }
    }
    res.json(cred);
  } else if (semester === 6) {
    for (let i = 0; i < student.Result[0].Semester6.length; i++) {
      if (student.Result[0].Semester6[i].status === "enrolled") {
        cred += student.Result[0].Semester6[i].credits;
      }
    }
    console.log(cred);
    res.json(cred);
  } else if (semester === 7) {
    for (let i = 0; i < student.Result[0].Semester7.length; i++) {
      if (student.Result[0].Semester7[i].status === "enrolled") {
        cred += student.Result[0].Semester7[i].credits;
      }
    }
    res.json(cred);
  } else if (semester === 8) {
    for (let i = 0; i < student.Result[0].Semester8.length; i++) {
      if (student.Result[0].Semester8[i].status === "enrolled") {
        cred += student.Result[0].Semester8[i].credits;
      }
    }
    res.json(cred);
  } else if (semester === 9) {
    for (let i = 0; i < student.Result[0].Semester9.length; i++) {
      if (student.Result[0].Semester9[i].status === "enrolled") {
        cred += student.Result[0].Semester9[i].credits;
      }
    }
    res.json(cred);
  } else if (semester === 10) {
    for (let i = 0; i < student.Result[0].Semester10.length; i++) {
      if (student.Result[0].Semester10[i].status === "enrolled") {
        cred += student.Result[0].Semester10[i].credits;
      }
    }
    res.json(cred);
  } else if (semester === 11) {
    for (let i = 0; i < student.Result[0].Semester11.length; i++) {
      if (student.Result[0].Semester11[i].status === "enrolled") {
        cred += student.Result[0].Semester11[i].credits;
      }
    }
    res.json(cred);
  } else if (semester === 12) {
    for (let i = 0; i < student.Result[0].Semester12.length; i++) {
      if (student.Result[0].Semester12[i].status === "enrolled") {
        cred += student.Result[0].Semester12[i].credits;
      }
    }
    res.json(cred);
  }
});
module.exports = router;
