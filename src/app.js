const express = require("express");
const { connectDB } = require("./config/database");
const server = express();
const User = require("./config/models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./midlleware/auth");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

server.use(express.json());
server.use(cookieParser());

// server.get("/getuser", userAuth, async (req, res) => {
//   const userEmail = req.body.email;

//   try {
//     const users = await User.findOne({ email: userEmail });
//     if (users?.length > 0 || (typeof users === "object" && users !== null)) {
//       res.status(201).send(users);
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "User retrieval failed" });
//   }
// });

// server.get("/feed", userAuth, async (req, res) => {
//   try {
//     const users = await User.find({});
//     res.status(200).send(users);
//   } catch (error) {
//     res.status(500).json({ message: "Feed retrieval failed" });
//   }
// });

// server.delete("/deleteuser", userAuth, async (req, res) => {
//   const userEmail = req.body.email;
//   try {
//     const deletedUser = await User.deleteOne({ email: userEmail });
//     console.log(deletedUser);
//     if (deletedUser?.deletedCount > 0) {
//       res.status(200).json({ message: "User deleted successfully" });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "User deletion failed" });
//   }
// });

// server.patch("/updateuser/:email", userAuth, async (req, res) => {
//   console.log(req.body);
//   const userEmail = req.params?.email;
//   // const userId = req.params.id;

//   try {
//     const allowedUpdates = [
//       "firstName",
//       "lastName",
//       "age",
//       "photoUrl",
//       "about",
//       "skills",
//       "gender",
//     ];
//     const isValidUpdate = Object.keys(req.body).every((update) =>
//       allowedUpdates.includes(update),
//     );
//     if (!isValidUpdate) {
//       return res.status(400).json({ message: "Invalid updates" });
//     }
//     const updatedUser = await User.updateOne(
//       { email: userEmail },
//       { $set: { ...req.body } },
//       { runValidators: true },
//     );
//     if (updatedUser?.modifiedCount > 0) {
//       res.status(200).json({ message: "User updated successfully" });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "User update failed" });
//   }
// });

// server.use("/auth", authRouter);
// server.use("/profile", profileRouter);
// server.use("/requests", requestRouter);

server.use("/auth", authRouter);
server.use("/profile", profileRouter);
server.use("/requests", requestRouter);
server.use("/user", userRouter);

connectDB()
  .then(() => {
    console.log("data base connection established...");
    server.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
