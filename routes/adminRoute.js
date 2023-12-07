const express = require("express");
const {
  adminLogin,
  adminLoginPage,
  getAdminDashboard,
  adminLogout,
  deleteUser,
  editUser,
  addUser,
  getAddUserPage,
  searchUser,
} = require("../controllers/adminController");
const { isAdmin } = require("../middlewares/adminMiddlewares");

const router = express.Router();

router.get("/admin-login", adminLoginPage);

router.post("/admin-login", adminLogin);

router.get("/admin-dashboard", getAdminDashboard);

router.get("/admin-logout", adminLogout);

router.get("/add-user", isAdmin, getAddUserPage);

router.post("/add-user", isAdmin, addUser);

router.post("/delete-user/:id", isAdmin, deleteUser);

router.post("/edit-user/:id", isAdmin, editUser);

router.post("/search-user", isAdmin, searchUser);


module.exports = router;
