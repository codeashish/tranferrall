const mongoose=require('mongoose')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        minlength:3,
        maxlength:40,
        required:true,
        unique:true

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }  


},{timestamps:true})


userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  });


userSchema.methods.createjwttoken = async function () {
    const user = this;
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "14d",
      }
    );
    await user.save();
    return token;
  };
const User=mongoose.model('User',userSchema)
module.exports=User