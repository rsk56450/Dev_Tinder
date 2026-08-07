const express = require("express");
const { connectDB } = require("./config/database");
const server = express();
const User = require("./config/models/user")

server.use(express.json());

server.post("/signup", async (req, res) => {
  const requestBody = req.body;
  const user = new User(requestBody);

  try {
    await user.save();
  
    res.status(201).json({ message: "User created successfully" });
  }catch(error){
    res.status(500).json({ message: "User creation failed" });
  }
})

connectDB()
  .then(()=>{
    console.log("data base connection established...");
    server.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error)=>{
    console.log(error);
  });



