const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const AppError = require("./utils/appError");
const globalErrorController = require("./controller/errorController");
const cookieParser = require("cookie-parser");
const taskRoutes = require("./routes/taskRoutes");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.CLOUD_DATABASE)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/v1/users", userRoute);
app.use("/api/v1/tasks", taskRoutes);

app.get("/api", (req, res, next) => {
  //   console.log(req.cookies);
  return res.status(200).json({ message: "api working good" });
});

// app.all("*", (req, res, next) => {
//   next(new AppError(`can't find ${req.originalUrl} on thier server`));
// });

app.use(globalErrorController);

const Port = process.env.PORT || 5000;
app.listen(Port, () => {
  console.log(`server is running on ${Port}`);
});
