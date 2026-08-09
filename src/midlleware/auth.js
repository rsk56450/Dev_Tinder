const jwt = require("jsonwebtoken");
const User = require("../config/models/user");
const userAuth = async (req, res, next) => {
  try {
    const cookiesToken = req.cookies.token;
    if (!cookiesToken) {
      throw new Error("Token not found");
    }

    const decodedMessage = jwt.verify(cookiesToken, "Rohit@123");
    const userId = decodedMessage._id;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
      
      req.user = user;

    next();
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
};

module.exports = { userAuth };
