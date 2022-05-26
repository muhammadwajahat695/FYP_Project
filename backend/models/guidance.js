const mongoose = require("mongoose");

const Guidanceboxschema = new mongoose.Schema({
    registrationId: {
        type: String,
        required:true
    },   
     name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    contactNo:{
    type:String,
    default:"--"
    },
    courses: [{
        course: {
            type: String,
        }
    }],
})

// store the courses
Guidanceboxschema.methods.add = async function(course) {
    try {
        this.courses = this.courses.concat({ course })
        await this.save();
        return this.courses;
    } catch (error) {
        console.log(error);
    }
}
//add contact no
Guidanceboxschema.methods.Contact = async function(contactNo) {
    try {
        this.contactNo = contactNo
        await this.save();
        return this.contactNo;
    } catch (error) {
        console.log(error);
    }
}

//create the collection in database
const GuidanceBox = mongoose.model("GuidanceBox", Guidanceboxschema);
module.exports = GuidanceBox;