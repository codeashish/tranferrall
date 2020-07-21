const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("./../models/user");
const passport = require("passport");
const upload = multer({
  limits: {
    fileSize: 2000000000,
  },
  fileFilter(req, file, cb) {


    cb(undefined, true);
  },
});

router.post(
  "/file",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  async (req, res) => {
    console.log(req.file);
  }
);

module.exports = router;
