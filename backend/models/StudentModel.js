const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const studentSchema = mongoose.Schema({
  batch: {
    type: String,
    required: [true, "Please enter batch"],
    maxLength: [4, "Batch should not exceed 4 characters"],
    minLength: [4, "Batch should be 4 characters long"],
  },
  department: {
    type: String,
    default: "BCS",
  },
  regNo: {
    type: String,
    required: [true, "Please enter registration number"],
    maxLength: [3, "Please enter 3 characters long registartion number"],
    minLength: [3, "Please enter 3 characters long registartion number"],
  },
  registrationId: {
    type: String,
    required: [true, "Please enter registration Id"],
    maxLength: [12, "Please enter 3 characters long registartion ID"],
    minLength: [12, "Please enter 3 characters long registartion ID"],
    unique: [true, "This registration Id already exist"],
  },
  section: {
    type: String,
    required: [true, "Please enter section"],
    maxLength: [10, "Section should be only of 10 characters i.e FA18-BCS-A"],
    minLength: [10, "Section should be only of 10 character i.e FA18-BCS-A"],
  },
  semester: {
    type: Number,
    required: [true, "Please enter semester"],
    maxLength: [1, "Section should be only of 1 digit"],
  },
  name: {
    type: String,
    required: [true, "Please enter name"],
    maxLength: [30, "Name should not exceed 30 characters"],
  },
  fatherName: {
    type: String,
    required: [true, "Please enter father name"],
    maxLength: [30, "Father name should not exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    maxLength: [30, "Email should not exceed 30 characters"],
    unique: [true, "This email Id already exist"],
    // validate: {
    //   validator: function (v) {
    //     return /^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/.test(v);
    //   },
    //   message: "Email incorrect",
    // },
  },
  contactNo: {
    type: Number,
    required: [true, "Please enter contact no"],
    maxLength: [10, "Contact number should contain 11 digits"],
    minLength: [10, "Contact number should contain 11 digits"],
    // validate: {
    //   validator: function (v) {
    //     return /^\d{10}$/.test(v);
    //   },
    //   message: "ContactNo format XXXXXXXXXX",
    // },
  },
  address: {
    type: String,
    required: [true, "Please enter address"],
    maxLength: [50, "Address should not exceed 50"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    // maxLength: [12, "Password should contain minimum 8 and maximum 12 characters"],
    // minLength: [8, "Password should contain minimum 8 and maximum 12 characters"],
  },
  batchAdvisorName: {
    type: String,
    required: [true, "Please enter batch advisor name"],
    maxLength: [30, "Batch advisor name should not exceed 30 characters"],
  },
  batchAdvisorEmail: {
    type: String,
    required: [true, "Please enter batch advisor email"],
    maxLength: [30, "Batch Advisor email should not exceed 30 characters"],
  },
  profilePic: {
    type: String,
    required: true,
  },
  Result: [
    {
      Semester1: [
        {
          courseName: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [50, "Course Title should not exceed 30 characters"],
          },
          courseCode: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [6, "Course code should contain 6 characters"],
            minLength: [6, "Course code should contain 6 characters"],
          },
          credits: {
            type: Number,
            required: [true, "Please enter credit hours"],
            maxLength: [1, "Credit hours should be only of 1 digit"],
          },
          courseSection: {
            type: String,
            maxLength: [
              10,
              "Section should be only of 10 characters i.e FA18-BCS-A",
            ],
            minLength: [
              10,
              "Section should be only of 10 character i.e FA18-BCS-A",
            ],
          },
          marks: {
            type: Number,
            maxLength: [3, "Marks should not exceed 3 digits"],
            minLength: [1, "Marks should contain at least 1 digit"],
          },
          gp: {
            type: Number,
          },
          status: {
            type: String,
          },
        },
      ],
      Semester2: [
        {
          courseName: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [50, "Course Title should not exceed 30 characters"],
          },
          courseCode: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [6, "Course code should contain 6 characters"],
            minLength: [6, "Course code should contain 6 characters"],
          },
          credits: {
            type: Number,
            required: [true, "Please enter credit hours"],
            maxLength: [1, "Credit hours should be only of 1 digit"],
          },
          marks: {
            type: Number,
            maxLength: [3, "Marks should not exceed 3 digits"],
            minLength: [1, "Marks should contain at least 1 digit"],
          },
          courseSection: {
            type: String,
            maxLength: [
              10,
              "Section should be only of 10 characters i.e FA18-BCS-A",
            ],
            minLength: [
              10,
              "Section should be only of 10 character i.e FA18-BCS-A",
            ],
          },
          gp: {
            type: Number,
          },
          status: {
            type: String,
          },
        },
      ],
      Semester3: [
        {
          courseName: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [50, "Course Title should not exceed 30 characters"],
          },
          courseCode: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [6, "Course code should contain 6 characters"],
            minLength: [6, "Course code should contain 6 characters"],
          },
          credits: {
            type: Number,
            required: [true, "Please enter credit hours"],
            maxLength: [1, "Credit hours should be only of 1 digit"],
          },
          courseSection: {
            type: String,
            maxLength: [
              10,
              "Section should be only of 10 characters i.e FA18-BCS-A",
            ],
            minLength: [
              10,
              "Section should be only of 10 character i.e FA18-BCS-A",
            ],
          },
          marks: {
            type: Number,
            maxLength: [3, "Marks should not exceed 3 digits"],
            minLength: [1, "Marks should contain at least 1 digit"],
          },
          gp: {
            type: Number,
          },
          status: {
            type: String,
          },
        },
      ],
      Semester4: [
        {
          courseName: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [50, "Course Title should not exceed 30 characters"],
          },
          courseCode: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [6, "Course code should contain 6 characters"],
            minLength: [6, "Course code should contain 6 characters"],
          },
          credits: {
            type: Number,
            required: [true, "Please enter credit hours"],
            maxLength: [1, "Credit hours should be only of 1 digit"],
          },
          courseSection: {
            type: String,
            maxLength: [
              10,
              "Section should be only of 10 characters i.e FA18-BCS-A",
            ],
            minLength: [
              10,
              "Section should be only of 10 character i.e FA18-BCS-A",
            ],
          },
          marks: {
            type: Number,
            maxLength: [3, "Marks should not exceed 3 digits"],
            minLength: [1, "Marks should contain at least 1 digit"],
          },
          gp: {
            type: Number,
          },
          status: {
            type: String,
          },
        },
      ],
      Semester5: [
        {
          courseName: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [50, "Course Title should not exceed 30 characters"],
          },
          courseCode: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [6, "Course code should contain 6 characters"],
            minLength: [6, "Course code should contain 6 characters"],
          },
          credits: {
            type: Number,
            required: [true, "Please enter credit hours"],
            maxLength: [1, "Credit hours should be only of 1 digit"],
          },
          courseSection: {
            type: String,
            maxLength: [
              10,
              "Section should be only of 10 characters i.e FA18-BCS-A",
            ],
            minLength: [
              10,
              "Section should be only of 10 character i.e FA18-BCS-A",
            ],
          },
          marks: {
            type: Number,
            maxLength: [3, "Marks should not exceed 3 digits"],
            minLength: [1, "Marks should contain at least 1 digit"],
          },
          gp: {
            type: Number,
          },
          status: {
            type: String,
          },
        },
      ],
      Semester6: [
        {
          courseName: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [50, "Course Title should not exceed 30 characters"],
          },
          courseCode: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [6, "Course code should contain 6 characters"],
            minLength: [6, "Course code should contain 6 characters"],
          },
          credits: {
            type: Number,
            required: [true, "Please enter credit hours"],
            maxLength: [1, "Credit hours should be only of 1 digit"],
          },
          courseSection: {
            type: String,
            maxLength: [
              10,
              "Section should be only of 10 characters i.e FA18-BCS-A",
            ],
            minLength: [
              10,
              "Section should be only of 10 character i.e FA18-BCS-A",
            ],
          },
          marks: {
            type: Number,
            maxLength: [3, "Marks should not exceed 3 digits"],
            minLength: [1, "Marks should contain at least 1 digit"],
          },
          gp: {
            type: Number,
          },
          status: {
            type: String,
          },
        },
      ],
      Semester7: [
        {
          courseName: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [50, "Course Title should not exceed 30 characters"],
          },
          courseCode: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [6, "Course code should contain 6 characters"],
            minLength: [6, "Course code should contain 6 characters"],
          },
          credits: {
            type: Number,
            required: [true, "Please enter credit hours"],
            maxLength: [1, "Credit hours should be only of 1 digit"],
          },
          courseSection: {
            type: String,
            maxLength: [
              10,
              "Section should be only of 10 characters i.e FA18-BCS-A",
            ],
            minLength: [
              10,
              "Section should be only of 10 character i.e FA18-BCS-A",
            ],
          },
          marks: {
            type: Number,
            maxLength: [3, "Marks should not exceed 3 digits"],
            minLength: [1, "Marks should contain at least 1 digit"],
          },
          gp: {
            type: Number,
          },
          status: {
            type: String,
          },
        },
      ],
      Semester8: [
        {
          courseName: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [50, "Course Title should not exceed 30 characters"],
          },
          courseCode: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [6, "Course code should contain 6 characters"],
            minLength: [6, "Course code should contain 6 characters"],
          },
          credits: {
            type: Number,
            required: [true, "Please enter credit hours"],
            maxLength: [1, "Credit hours should be only of 1 digit"],
          },
          courseSection: {
            type: String,
            maxLength: [
              10,
              "Section should be only of 10 characters i.e FA18-BCS-A",
            ],
            minLength: [
              10,
              "Section should be only of 10 character i.e FA18-BCS-A",
            ],
          },
          marks: {
            type: Number,
            maxLength: [3, "Marks should not exceed 3 digits"],
            minLength: [1, "Marks should contain at least 1 digit"],
          },
          gp: {
            type: Number,
          },
          status: {
            type: String,
          },
        },
      ],
      Semester9: [
        {
          courseName: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [50, "Course Title should not exceed 30 characters"],
          },
          courseCode: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [6, "Course code should contain 6 characters"],
            minLength: [6, "Course code should contain 6 characters"],
          },
          credits: {
            type: Number,
            required: [true, "Please enter credit hours"],
            maxLength: [1, "Credit hours should be only of 1 digit"],
          },
          courseSection: {
            type: String,
            maxLength: [
              10,
              "Section should be only of 10 characters i.e FA18-BCS-A",
            ],
            minLength: [
              10,
              "Section should be only of 10 character i.e FA18-BCS-A",
            ],
          },
          marks: {
            type: Number,
            maxLength: [3, "Marks should not exceed 3 digits"],
            minLength: [1, "Marks should contain at least 1 digit"],
          },
          gp: {
            type: Number,
          },
          status: {
            type: String,
          },
        },
      ],
      Semester10: [
        {
          courseName: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [50, "Course Title should not exceed 30 characters"],
          },
          courseCode: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [6, "Course code should contain 6 characters"],
            minLength: [6, "Course code should contain 6 characters"],
          },
          credits: {
            type: Number,
            required: [true, "Please enter credit hours"],
            maxLength: [1, "Credit hours should be only of 1 digit"],
          },
          courseSection: {
            type: String,
            maxLength: [
              10,
              "Section should be only of 10 characters i.e FA18-BCS-A",
            ],
            minLength: [
              10,
              "Section should be only of 10 character i.e FA18-BCS-A",
            ],
          },
          marks: {
            type: Number,
            maxLength: [3, "Marks should not exceed 3 digits"],
            minLength: [1, "Marks should contain at least 1 digit"],
          },
          gp: {
            type: Number,
          },
          status: {
            type: String,
          },
        },
      ],
      Semester11: [
        {
          courseName: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [50, "Course Title should not exceed 30 characters"],
          },
          courseCode: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [6, "Course code should contain 6 characters"],
            minLength: [6, "Course code should contain 6 characters"],
          },
          credits: {
            type: Number,
            required: [true, "Please enter credit hours"],
            maxLength: [1, "Credit hours should be only of 1 digit"],
          },
          courseSection: {
            type: String,
            maxLength: [
              10,
              "Section should be only of 10 characters i.e FA18-BCS-A",
            ],
            minLength: [
              10,
              "Section should be only of 10 character i.e FA18-BCS-A",
            ],
          },
          marks: {
            type: Number,
            maxLength: [3, "Marks should not exceed 3 digits"],
            minLength: [1, "Marks should contain at least 1 digit"],
          },
          gp: {
            type: Number,
          },
          status: {
            type: String,
          },
        },
      ],
      Semester12: [
        {
          courseName: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [50, "Course Title should not exceed 30 characters"],
          },
          courseCode: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [6, "Course code should contain 6 characters"],
            minLength: [6, "Course code should contain 6 characters"],
          },
          credits: {
            type: Number,
            required: [true, "Please enter credit hours"],
            maxLength: [1, "Credit hours should be only of 1 digit"],
          },
          courseSection: {
            type: String,
            maxLength: [
              10,
              "Section should be only of 10 characters i.e FA18-BCS-A",
            ],
            minLength: [
              10,
              "Section should be only of 10 character i.e FA18-BCS-A",
            ],
          },
          marks: {
            type: Number,
            maxLength: [3, "Marks should not exceed 3 digits"],
            minLength: [1, "Marks should contain at least 1 digit"],
          },
          gp: {
            type: Number,
          },
          status: {
            type: String,
          },
        },
      ],
      CGPA: {
        type: Number,
        required: true,
      },
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  //for reset passwords
  resettoken: {
    type: String,
  },
  expiretoken: {
    type: Date,
  },
});

//hashing the password

studentSchema.pre("save", async function (next) {
  console.log("password hash");
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

//generating the token
studentSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};
//create the collection in database
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
