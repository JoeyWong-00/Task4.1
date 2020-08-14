const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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