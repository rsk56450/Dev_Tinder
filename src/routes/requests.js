const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../midlleware/auth");
const ConnectionRequest = require("../config/models/connectionRequest");
const User = require("../config/models/user");

requestRouter.post(
  "/sendConnectionRequest/:status/:toUserId",
  userAuth,
  async (req, res, next) => {
    try {
      const { status, toUserId } = req.params;
      console.log("-----wwww-->", status, toUserId);
      const fromUserId = req.user._id;

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).send("ERROR: User not found");
      }

      const allowedStatus = ["ignore", "intrested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("ERROR: Invalid status");
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId , status},
          { fromUserId: toUserId, toUserId: fromUserId , status},
        ],
      });
      if (existingRequest) {
        return res.status(400).send("ERROR: Connection request already exists");
      } else {
        const connectionRequest = new ConnectionRequest({
          fromUserId,
          toUserId,
          status,
        });

        const savedConnectionRequest = await connectionRequest.save();

        res.json({
          message: "Connection request sent successfully",
          savedConnectionRequest,
        });
      }
    } catch (error) {
      res.status(500).send("ERROR: " + error.message);
    }
  },
);

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;
    const loggedInUser = req.user;
    const allowedStatus = ["accept", "reject"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).send("ERROR: Invalid status");
    }

    console.log("---reached-----q4444--->", requestId, loggedInUser._id, status)

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "intrested",
    })

    if (!connectionRequest) { 
      return res.status(404).send("ERROR: Connection request not found");
    }

    connectionRequest.status = status;
   const updatedConnectionRequest = await connectionRequest.save();
   res.json({
    message: "Connection request reviewed successfully",
    updatedConnectionRequest,
   });
  } catch (error) {
    res.status(500).send("ERROR: " + error.message);
  }
});

module.exports = requestRouter;
