const express = require("express");
const userRouter = require("./routes/userRoute");
const adminRouter = require("./routes/adminRoute");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const morgan = require("morgan");
const session = require("express-session");
const nocache = require("nocache");

const app = express();

// .env configure
dotenv.config();

//Connect to database
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(nocache());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "thisistheway",
  })
);

app.set("view engine", "ejs");

//route
app.use(userRouter);
app.use(adminRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
