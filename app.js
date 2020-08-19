const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 3000;
const validator = require('validator');
const user = require('./models/user');
const SendEmail = require('./features/sendEmail');

// Express app
const app = express();

// Connect to MongoDB database
const URI = "mongodb+srv://jw980521:jw980521@cluster0.w00bz.mongodb.net/task?retryWrites=true&w=majority";
mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT))
    .catch(err => console.log(err))

// Middileware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}))

// Routes
app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, "/views/index.html"));
})
app.post('/', (request, response) => {
    if(validateUserInfo(request)) {
        // Send welcome email function
        SendEmail(request.body.email);
        const newUser = new user({...request.body, address: request.body.address + request.body.address1});
        newUser
            .save()
            .then(() => response.send("Registered Successfully"))
            .catch(err => console.log(err))
    } else {
        response.send("Error");
    }
})


// Function to validate user's info
function validateUserInfo(request) {
    const { 
        country, 
        fname, 
        lname, 
        email, 
        password, 
        confirm_password, 
        address, 
        city,  
        state,
        ZIP,
        mobile
    } = request.body;
    if(validator.isEmpty(country.trim())) {
        return false;
     }
 
     if(validator.isEmpty(fname.trim())) {
         return false;
     }
 
     if(validator.isEmpty(lname.trim())) {
         return false;
     }
 
     if(!validator.isEmail(email.trim())) {
         return false;
     }
 
     if(!validator.isLength(password, {min: 8})) {
         return false;
     }
 
     if(!validator.equals(password, confirm_password)) {
         return false;
     }
 
     if(validator.isEmpty(address[0].trim())) {
         return false;
     }
 
     if(validator.isEmpty(city.trim())) {
         return false;
     }
 
     if(validator.isEmpty(state.trim())) {
         return false;
     }
 
     if(mobile && !validator.isMobilePhone(mobile.trim(), [
         "en-AU",
         "en-US",
         "en-NZ",
         "en-UK"
     ])) {
         return false;
     }
    return true;
}