// name,regId,section,email,cgpa,phone,address,course(code,title,credith),reason
const mongoose = require("mongoose");
const pendingAddCourseSchema = mongoose.Schema({
  registrationId: {
    type: String,
    required: true,
  },
  courses: [
    {
      courseCode: {
        type: String,
        required: true,
      },
      courseName: {
        type: String,
        required: true,
      },
      credits: {
        type: Number,
        required: true,
      },
      section: {
        type: String,
        required: true,
      },
      preReqCourse: {
        type: String,
        required: true,
      },
      preTest: {
        type: String,
        required: true,
      },
      reason: {
        type: String,
        required: true,
      },
    },
  ],
});

//add in courses array
pendingAddCourseSchema.methods.add_courses = async function (
  courseName,
  courseCode,
  credits,
  section,
  preReqCourse,
  preTest,
  reason
) {
  try {
    this.courses = this.courses.concat({
      courseName,
      courseCode,
      credits,
      section,
      preReqCourse,
      preTest,
      reason,
    });
    await this.save();
    return this.courses;
  } catch (error) {
    console.log(error);
  }
};
//create the collection in database
const PendingAddCourse = mongoose.model(
  "PendingAddCourse",
  pendingAddCourseSchema
);
module.exports = PendingAddCourse;
