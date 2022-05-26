const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/db");
// const Students=require("./routers/Student");
// const BatchAdvisors=require("./routers/BatchAdvisor");
// const Guidancebox=require("./routers/Guidancebox");
// const PastPaper=require("./routers/PastPaper");

// require("./routers/auth");
// const bodyParser = require("body-parser")
// const products=require("./data/product");
// const User = require("./models/userschema");

const app = express();
app.use(cookieParser());
connectDb();
app.use(express.json());
// app.use(bodyParser.json())
app.use(require("./routers/auth"));
// app.use(Students);
// app.use(BatchAdvisors);
// app.use(Guidancebox);
// app.use(PastPaper);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`connect ${port}`);
});
