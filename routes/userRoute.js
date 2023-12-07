const express = require("express");
const {
  addUser,
  getLoginPage,
  getSignUpPage,
  getHome,
  logIn,
  logOut,
  getErrorPage,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getLoginPage);

router.post("/login", logIn);

router.get("/signup", getSignUpPage);

router.post("/register", addUser);

router.get("/home", getHome);

router.get("/logout", logOut);

router.get("*",getErrorPage)

module.exports = router;
