const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../midlleware/auth");
const ConnectionRequest = require("../config/models/connectionRequest");
const User = require("../config/models/user");
const populateFromUserCollection = ["firstName","lastName","photoUrl","about","age","gender"]

userRouter.get("/requests/received", userAuth, async (req, res) => { 
    try { 
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:'intrested'
        }).populate("fromUserId", populateFromUserCollection).populate("toUserId", populateFromUserCollection)

        res.json({message : 'Connection requests', data: connectionRequests})

    }catch (error) {
        res.status(500).send("ERROR: " + error.message);
    }
})

userRouter.get("/requests/connections", userAuth, async (req, res) => { 
    try { 
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: 'accepted'},
                {fromUserId: loggedInUser._id, status: 'accepted'}
            ]
        }).populate("fromUserId", populateFromUserCollection).populate("toUserId", populateFromUserCollection)

        const data = connectionRequests.map(row => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        }
        );
        res.json({message : 'Connections', data})
    }catch (error) {
        res.status(500).send("ERROR: " + error.message);
    }
})

userRouter.get("/requests/feed", userAuth, async (req, res) => { 
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
       limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        })

        const users = await User.find({
            $and: [
                {_id: {$nin : Array.from(hideUsersFromFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        }).select(populateFromUserCollection).skip(skip).limit(limit)

        res.json({message : 'Feed', data: users})
    }catch (error) {
        res.status(500).send("ERROR: " + error.message);
    }
})

module.exports = userRouter;