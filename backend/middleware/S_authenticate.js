const jwt = require("jsonwebtoken");
const Student = require("../models/StudentModel");

const authenticate = async (req, res, next) => {
  try {
    const token = await req.cookies.jwtoken;
    console.log(token);
    const verifytoken = jwt.verify(token, process.env.SECRET_KEY);
    const rootuser = await Student.findOne({
      _id: verifytoken._id,
      "tokens.token": token,
    });
    if (!rootuser) {
      throw new Error("user not found");
    }
    req.token = token;
    req.rootuser = rootuser;
    req.rootuserResult = rootuser.Result[0];
    req.rootuserSemester1 = rootuser.Result[0].Semester1;
    req.rootuserSemester2 = rootuser.Result[0].Semester2;
    req.rootuserSemester3 = rootuser.Result[0].Semester3;
    req.rootuserSemester4 = rootuser.Result[0].Semester4;
    req.rootuserSemester5 = rootuser.Result[0].Semester5;
    req.rootuserSemester6 = rootuser.Result[0].Semester6;
    req.rootuserSemester7 = rootuser.Result[0].Semester7;
    req.rootuserSemester8 = rootuser.Result[0].Semester8;
    req.rootuserSemester9 = rootuser.Result[0].Semester9;
    req.rootuserSemester10 = rootuser.Result[0].Semester10;
    req.rootuserSemester11 = rootuser.Result[0].Semester11;
    req.rootuserSemester12 = rootuser.Result[0].Semester12;
    req.userID = rootuser._id;
    next();
  } catch (error) {
    res.status(401).send("unauthorized: no token provided");
    console.log(error);
  }
};

module.exports = authenticate;
