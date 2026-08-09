const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../midlleware/auth');

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => { 
    try {
    
  }catch(error){
    res.status(500).send("ERROR: " + error.message);
  }
})
  
module.exports = requestRouter;