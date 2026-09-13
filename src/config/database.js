const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING);
    } catch (error) {
        console.log(error);
    }
}



module.exports = {connectDB};