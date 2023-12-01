const isAdmin = async (req, res, next) => {
  try {
    // const { email } = req.body;

    // const user = await UserModel.findOne({ email });

    // if (!user.isAdmin) {
    //   return res.render("adminPages/adminLogin", {
    //     notAdmin: true,
    //     noUser: false,
    //   });
    // } else {
    //   next();
    // }

    if (req.session.isAdmin) {
      next();
    }
  } catch (error) {
    console.log("error in admin middleware ", error);
  }
};

module.exports = {  isAdmin };

// const requireSignIn = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const user = await UserModel.findOne({ email });

//     if (!user) {
//       return res.redirect("/admin-login");
//     }

//     const matchPassword = comparePassword(password, user.password);

//     if (matchPassword) {
//       return res.redirect("/admin-login");
//     }

//     next();
//   } catch (error) {
//     console.log("error in signIn ", error);
//   }
// };
