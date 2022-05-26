
const mongoose = require("mongoose")
const result = mongoose.Schema({
Result:[{
            semester:[{
                name:{
                    type:String,
                    required:true
                },
                fatherName:{
                    type:String,
                    required:true
                },                
                registrationId:{
                    type:String,
                    required:true
                },
                program:{
                    type:String,
                    required:true
                },
                scholastic_status:{
                    type:String,
                    required:true
                },
                semester:{
                    type:String,
                    required:true
                },
                CGPA:{
                    type:String,
                    required:true
                },
                courses:[
                    {
                        courseCode:{
                            type:String,
                            required:true
                        },
                        courseName:{
                            type:String,
                            required:true
                        },
                        credits:{
                            type:String,
                            required:true
                        },
                        status:{
                            type:String,
                            required:true
                        },
                        gp:{
                            type:String,
                            required:true
                        }

                }]
            }]  
    }]

})
//create the collection in database
const Studentresult = mongoose.model("Studentresult", result);
module.exports = Studentresult;