const express = require("express");

const server = express();

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});

server.get("/Hello", (req, res) => {
  res.send("Hello World");
});


server.get("/",(req,res)=>{
  res.send("Home Page1111");
});