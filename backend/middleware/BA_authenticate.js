const jwt = require("jsonwebtoken");
const BatchAdvisor = require("../models/BatchAdvisorModel");

const authenticate = async(req, res, next) => {
    try {
        const token = await req.cookies.Bjwtoken;
        // console.log(token);
        const verifytoken = jwt.verify(token, process.env.SECRET_KEY);
        const rootuser = await BatchAdvisor.findOne({ _id: verifytoken._id, "tokens.token": token });
        if (!rootuser) {
            throw new Error("user not found")
        }
        req.token = token;
        req.rootuser = rootuser;
        req.userID = rootuser._id;
        next();

    } catch (error) {
        res.status(401).send("unauthorized: no token provided")
        console.log(error);
    }
}
module.exports = authenticate;