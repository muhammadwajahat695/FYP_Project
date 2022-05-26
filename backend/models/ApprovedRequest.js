// name,regId,section,email,cgpa,phone,address,course(code,title,credith),reason
const mongoose = require("mongoose");
const approvedRequestSchema = mongoose.Schema({
  registrationId: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  credits: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ["Add Course", "Drop Course", "Withdraw Course"],
  },
});

//create the collection in database
const ApprovedRequest = mongoose.model(
  "ApprovedRequest",
  approvedRequestSchema
);
module.exports = ApprovedRequest;
