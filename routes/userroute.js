const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const User = require("./../models/user");

router.get("/", (req, res) => {
  res.send("working");
});

router.post("/register", async (req, res) => {
  const errors = {};
  const usernameexist = await User.findOne({
    username: req.body.username,
  });
  if (usernameexist) {
    errors.username = "Username already taken";
    return res.status(400).send(errors);
  }
  const emailexist = await User.findOne({
    email: req.body.email,
  });
  if (emailexist) {
    errors.email = "Email already exist try Login";
    return res.status(400).send(errors);
  }

  try {
    const user = new User(req.body);
    const token = await user.createjwttoken();
    await user.save();
    res.send({
      user,
      token,
    });
  } catch (e) {
    res.status(500).send({
      error: e,
    });
  }
});

router.post("/login", async (req, res) => {
  const errors = {};
  if (req.body.username) {
    var user = await User.findOne({ username: req.body.username });
  } else if (req.body.email) {
    var user = await User.findOne({ email: req.body.email });
  }
  if (!user) {
    errors.username = "User Not found";
    return res.status(400).send(errors);
  }

  const isMatched = await bcrypt.compare(req.body.password, user.password);
  if (!isMatched) {
    errors.password = "Password not matched";
    return res.status(400).send(errors);
  }
  const token = await user.createjwttoken();

  res.send({
    user,
    token,
  });
});

module.exports = router;
