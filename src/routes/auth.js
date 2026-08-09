const express = require("express");
const authRouter = express.Router();
const User = require("../config/models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  const requestBody = req.body;
  console.log(requestBody);
  const { firstName, lastName, email, password, gender, age } = requestBody;

  try {
    validateSignUpData(requestBody);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      age,
    });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const requestBody = req.body;
    const { email, password } = requestBody;
    const user = await User.findOne({ email });
    console.log(user, "---------");
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = await user.getJWT();
    console.log(token, "---------");
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.status(200).send({ message: "Login successful" });
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => { 
  try {
    const token = req.cookies.token;
    if (!token) { 
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, "Rohit@123");
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.clearCookie("token");
    // res.cookie("token", null, {
    //   expires: new Date(Date.now())
    // });
    res.status(200).send({ message: "Logout successful" });
  }catch(error){
    res.status(500).send("ERROR: " + error.message);
  }
})

module.exports = authRouter;
