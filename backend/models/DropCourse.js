// name,regId,section,email,cgpa,phone,address,course(code,title,credith),reason
const mongoose = require("mongoose")
const pendingrequestSchema = mongoose.Schema({
    batch:{
        type: String,
        required:true
    },
    registrationId:{
        type: String,
        required:true,        
    },
    semester: {
        type: Number,
        required:true,
    },
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required:true
    },
    address: {
        type: String,
        required:true
    },
    CGPA: {
        type: Number,
        required: true 
    },
    request:{
        type:String,
        required:true,
        default:"Drop Pending"
    },
    section:{
        type:String,
        required:true
    },
    courses:[{
        courseCode:{
            type:String,
            required:true
        },
        reason:{
            type:String,
            required:true
        },
        courseName:{
            type:String,
            required:true,
        },
        credits:{
            type:String,
            required:true
        }
    }],
})

//add drop requests
pendingrequestSchema.methods.Courses1 = async function(courseCode,reason,courseName,credits,section) {
    try {
        this.courses = this.courses.concat({courseCode:courseCode,reason:reason,courseName:courseName,credits:credits,section:section})
        await this.save();
        return this.courses;
    } catch (error) {
        console.log(error);
    }
}
//create the collection in database
const CourseRequest = mongoose.model("CourseRequest", pendingrequestSchema);
module.exports = CourseRequest;