const validator = require('validator');

const validateSignUpData = (requestBody) => { 
    const {firstName, lastName, email, password, gender , age} = requestBody;
    if (!firstName || firstName.length < 3) {
        throw new Error("First name is required and must be at least 3 characters long");
    }
    if (!lastName || lastName.length < 3) {
        throw new Error("Last name is required and must be at least 3 characters long");
    }
    if (!email || !validator.isEmail(email)) {
        throw new Error("Invalid email");
    }
    if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    }
    if (!gender || !['male', 'female', 'other'].includes(gender)) {
        throw new Error("Invalid gender");
    }
    if (!age || age < 18) {
        throw new Error("Age is required and must be at least 18");
    }
}

const validateProfileEditData = (requestBody) => { 
    const allowedEditableFields = ['firstName', 'lastName', 'gender', 'age', 'photoUrl', 'about', 'skills'];
    const isEditableFields = Object.keys(requestBody).every(field => { 
        return allowedEditableFields.includes(field);
    });
    console.log("------->",isEditableFields);
    return isEditableFields;
}

module.exports = { validateSignUpData, validateProfileEditData };