const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../midlleware/auth");
const ConnectionRequest = require("../config/models/connectionRequest");

requestRouter.post(
  "/sendConnectionRequest/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;
      console.log("-----wwww-->", status, toUserId);
      const fromUserId = req.user._id;

      const allowedStatus = ['ignore', 'intrested']
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("ERROR: Invalid status");
      }
      

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

    const savedConnectionRequest = await connectionRequest.save();
    res.status(200).send(savedConnectionRequest);
    } catch (error) {
      res.status(500).send("ERROR: " + error.message);
    }
  },
);

module.exports = requestRouter;
