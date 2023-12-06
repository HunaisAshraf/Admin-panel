const UserModel = require("../model/userModel");
const {
  comparePassword,
  validateEmail,
  hashPassword,
} = require("../helper/helper");

const adminLoginPage = (req, res) => {
  if (!req.session.isAdmin) {
    res.render("adminPages/adminLogin", {
      notAdmin: req.session.notAdmin,
      noUser: req.session.noUser,
    });
    req.session.notAdmin = false;
    req.session.noUser = false;
    req.session.save();
  } else {
    res.redirect("/admin-dashboard");
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "") {
      req.session.notAdmin = false;
      req.session.noUser = true;
      return res.redirect("/admin-login");
    }
    if (password === "") {
      req.session.notAdmin = false;
      req.session.noUser = true;
      return res.redirect("/admin-login");
    }

    const foundUser = await UserModel.findOne({ email });

    let matchPassword;

    if (foundUser) {
      matchPassword = await comparePassword(password, foundUser.password);
    }

    if (!foundUser || !matchPassword) {
      req.session.notAdmin = false;
      req.session.noUser = true;
      return res.redirect("/admin-login");
    }

    if (!foundUser.isAdmin) {
      req.session.isAdmin = false;
      req.session.notAdmin = true;
      req.session.noUser = false;
      return res.redirect("/admin-login");
    } else {
      req.session.isAdmin = true;
      req.session.adminId = foundUser._id;
      return res.redirect("/admin-dashboard");
    }
  } catch (error) {
    console.log("error in login", error);
  }
};

const getAdminDashboard = async (req, res) => {
  if (req.session.isAdmin) {
    const users = await UserModel.find();
    res.render("adminPages/adminDashboard", {
      users,
    });
  } else {
    res.redirect("/admin-login");
  }
};

const adminLogout = (req, res) => {
  req.session.destroy();
  res.redirect("/admin-login");
};

const getAddUserPage = async (req, res) => {
  try {
    res.render("adminPages/adminAddUser", {
      inputErr: req.session.inputErr,
      errMsg: req.session.errorMessage,
      userExist: req.session.userExist,
    });
    req.session.userExist = false;
    req.session.inputErr = false;
    req.session.save();
  } catch (error) {
    console.log("error in getting add user page ", error);
  }
};

const addUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

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
      res.redirect("/add-user");
    } else if (existingUser) {
      req.session.userExist = true;
      res.redirect("/add-user");
    } else {
      const hashedPassword = await hashPassword(password);

      let addUser = await new UserModel({
        name,
        email,
        phone,
        password: hashedPassword,
      }).save();
      res.redirect("/admin-dashboard");
    }
  } catch (error) {
    console.log("error in adding user", error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findByIdAndDelete(id);

    res.redirect("/admin-dashboard");
  } catch (error) {
    console.log("error in deleting data", error);
  }
};

const editUser = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const { id } = req.params;

    const user = await UserModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          name,
          email,
          phone,
        },
      }
    );

    res.redirect("/admin-dashboard");
  } catch (error) {
    console.log(error);
  }
};

const searchUser = async (req, res) => {
  try {
    const { search } = req.body;

    const users = await UserModel.find({
      name: { $regex: search, $options: "i" },
    });
    res.render("adminPages/adminDashboard", { users });
  } catch (error) {
    console.log("error in searching ", error);
  }
};

module.exports = {
  adminLoginPage,
  adminLogin,
  getAdminDashboard,
  adminLogout,
  getAddUserPage,
  addUser,
  deleteUser,
  editUser,
  searchUser,
};
