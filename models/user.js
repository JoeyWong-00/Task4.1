const mongoose = require('mongoose');
const ObjectId = require('mongoose').ObjectId;

const userSchema = mongoose.Schema({
    id: String,
    country: String, 
    fname: String, 
    lname: String, 
    email: String, 
    password: String, 
    confirm_password: String, 
    address: String, 
    city: String,  
    state: String,
    ZIP: String,
    mobile: String
})

module.exports = mongoose.model('user', userSchema);