const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../midlleware/auth");
const ConnectionRequest = require("../config/models/connectionRequest");

userRouter.get("/requests", userAuth, async (req, res) => { 
    try { 
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id
        })

        res.json({message : 'Connection requests', data: connectionRequests})

    }catch (error) {
        res.status(500).send("ERROR: " + error.message);
    }
})

module.exports = userRouter;