// name,regId,section,email,cgpa,phone,address,course(code,title,credith),reason
const mongoose = require("mongoose")
const freezeSchema = mongoose.Schema({
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
        default:"Freeze Semester"
    },
    reason:{
        type:String,
        required:true
    },
    section:{
        type:String,
        required:true
    },
    continuationTime:{
        type:String,
        required:true
    }
})

//create the collection in database
const FreezeSemester = mongoose.model("FreezeSemester", freezeSchema);
module.exports = FreezeSemester;