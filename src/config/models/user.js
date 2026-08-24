const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong");
            }
        }
    },
    gender: {
        type: String,
        validate(value){
            if(value !== "male" && value !== "female" && value !== "other"){
                throw new Error("Gender must be either male or female");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    photoUrl: {
        type: String,
        default : "https://i.pinimg.com/564x/66/ff/cb/66ffcb56482c64bdf6b6010687938835.jpg"
    },
    about: {
        type: String,
        default : "This is defualt description of user",
    },
    skills: {
        type: [String],
        validate(value) {
            console.log("-----",value);
            if(value.length > 3){
                throw new Error("Skills must be at least 3 characters long");
            }
        }
    }
    
}, { timestamps: true })

userSchema.index({firstName: 1, lastName: 1});

userSchema.methods.getJWT = async function () {
    const user = this;
   const token = await jwt.sign({_id: user._id}, "Rohit@123" , {expiresIn: "7d"});
  return token;
};

userSchema.methods.verifyPassword = async function (userInputPassword) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(userInputPassword, user.password);
    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);