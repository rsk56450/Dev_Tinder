const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../midlleware/auth');
const { validateProfileEditData } = require('../utils/validation');
const User = require('../config/models/user');
const bcrypt = require('bcrypt');

profileRouter.get("/getProfile",userAuth, async (req, res) => { 
    try { 
      const user = req.user;
      res.status(200).send(user);
  
    }catch(error){
      res.status(500).send("ERROR: " + error.message);
    }
})
  
profileRouter.patch("/editProfile", userAuth, async (req, res) => {
  try {

    if(!validateProfileEditData(req.body)) {
      return res.status(400).send("ERROR: Invalid fields");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]))
    await loggedInUser.save();
    res.status(200).json({updatedUserData: loggedInUser});
  }catch(error){
    res.status(500).send("ERROR: " + error.message);
  }
})

profileRouter.patch("/forgotPassword", async (req, res) => { 
  try {
    const { email, newPassword } = req.body;
    const isStrongPassword = validator.isStrongPassword(newPassword);
    if (!isStrongPassword) {
      return res.status(400).send("ERROR: Password is not strong");
    }
    console.log("-----newPassword-->", email, newPassword);
    if (email) {
      const user = await User.findOne({ email });
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.status(200).send("Password updated successfully");
    } else {
      res.status(400).send("ERROR: Email not found");
    }
   }catch(error){
    res.status(500).send("ERROR: " + error.message);
  }
})

module.exports = profileRouter;