const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const env = require("dotenv");
const port = process.env.PORT || 8080;
const userroute = require("./routes/userroute");
const passport = require("passport");
const uploadroute=require('./routes/upload')
env.config();
mongoose
  .connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Success"))
  .catch((e) => console.log(e));

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);




app.use(bodyParser.json({ limit: "50mb" }));

app.use(passport.initialize());
require("./auth/passport")(passport);


app.use("/users", userroute);
app.use('/upload',uploadroute)

app.listen(port, () => console.log("Connected"));
