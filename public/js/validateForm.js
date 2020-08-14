let country = document.querySelector("#country");
let fname = document.querySelector("#fname");
let lname = document.querySelector("#lname");
let email = document.querySelector("#email");
let password = document.querySelector("#password");
let confirmPassword = document.querySelector("#confirm_password");
let address = document.querySelector("#address");
let city = document.querySelector("#city");
let state = document.querySelector("#state");
let zip = document.querySelector('#ZIP');
let mobile = document.querySelector("#mobile");


function validateForm(event) {
    // event.preventDefault(); 

    if(validator.isEmpty(country.value.trim())) {
       alert("Provide your country");
       return false;
    }

    if(validator.isEmpty(fname.value.trim())) {
        alert("Provide your first name");
        return false;
    }

    if(validator.isEmpty(lname.value.trim())) {
        alert("Provide your last name");
        return false;
    }

    if(!validator.isEmail(email.value.trim())) {
        alert("Provide a correct email")
        return false;
    }

    if(!validator.isLength(password.value, {min: 8})) {
        alert("Your password must be at least 8 characters")
        return false;
    }

    if(!validator.equals(password.value, confirmPassword.value)) {
        alert("Your password does not match with the confirmed password");
        return false;
    }

    if(validator.isEmpty(address.value.trim())) {
        alert("Provide your address");
        return false;
    }

    if(validator.isEmpty(city.value.trim())) {
        alert("Provide your city");
        return false;
    }

    if(validator.isEmpty(state.value.trim())) {
        alert("Provide your state");
        return false;
    }

    if(mobile.value && !validator.isMobilePhone(mobile.value.trim(), [
        "en-AU",
        "en-US",
        "en-NZ",
        "en-UK"
    ])) {
        alert("Provdie the correct phone number");
        return false;
    }
    return true;
}