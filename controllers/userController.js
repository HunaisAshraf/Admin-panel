const {
  validateEmail,
  hashPassword,
  comparePassword,
} = require("../helper/helper");
const UserModel = require("../model/userModel");
const data = require("../data");

const getLoginPage = (req, res) => {
  if (!req.session.isLogin && !req.session.isAdmin) {
    res.render("userPages/login", { notValid: req.session.notValid });
    req.session.notValid = false;
    req.session.save();
  } else if (req.session.isAdmin) {
    res.redirect("/admin-dashboard");
  } else {
    res.redirect("/home");
  }
};

const getSignUpPage = (req, res) => {
  res.render("userPages/signUp", {
    inputErr: req.session.inputErr,
    errMsg: req.session.errorMessage,
    userExist: req.session.userExist,
  });
  req.session.userExist = false;
  req.session.inputErr = false;
  req.session.save();
};

const getHome = (req, res) => {
  if (req.session.isLogin) {
    res.render("userPages/home", { data, user: req.session.user });
  } else {
    res.redirect("/");
  }
};

const addUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    //validating fields

    const errMsg = {};
    req.session.inputErr = false;
    if (name === "" || !/^[A-Za-z]+$/.test(name)) {
      errMsg["name"] = "Name is not valid";
      req.session.inputErr = true;
    }
    if (!validateEmail(email)) {
      errMsg["email"] = "Email is not valid";
      req.session.inputErr = true;
    }

    if (phone.length < 10 || phone.length > 10) {
      errMsg["phone"] = "Number is not valid";
      req.session.inputErr = true;
    }
    if (password.length < 6) {
      errMsg["password"] = "Password should be grater than 6 character";
      req.session.inputErr = true;
    }

    const existingUser = await UserModel.findOne({ email });

    if (req.session.inputErr) {
      req.session.errorMessage = errMsg;
      res.redirect("/signup");
    } else if (existingUser) {
      req.session.userExist = true;
      res.redirect("/signup");
    } else {
      const hashedPassword = await hashPassword(password);

      let addUser = await new UserModel({
        name,
        email,
        phone,
        password: hashedPassword,
      }).save();
      res.redirect("/home");
    }
  } catch (error) {
    console.log("error in registering " + error);
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await UserModel.findOne({ email });

    const passwordMatch = await comparePassword(password, foundUser.password);
    if (!foundUser || !passwordMatch) {
      req.session.notValid = true;
      res.redirect("/");
    } else {
      req.session.isLogin = true;
      req.session.user = foundUser;
      res.redirect("/home");
    }
  } catch (error) {
    console.log("error in login ", error);
  }
};

const logOut = (req, res) => {
  res.redirect("/");
  req.session.destroy();
};

module.exports = {
  addUser,
  getLoginPage,
  getSignUpPage,
  getHome,
  logIn,
  logOut,
};
