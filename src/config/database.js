const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://rsk56450_db_user:Rsk_9757294157@testprojectcluster1.rnwkp4d.mongodb.net/devTinderDB");
    } catch (error) {
        console.log(error);
    }
}



module.exports = {connectDB};