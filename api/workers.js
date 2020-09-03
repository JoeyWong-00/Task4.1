const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');

// Retrieving, adding and removing workers
router.get('/', async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.json({ users });

    } catch(err) {
        res.json({ users: [], err})
    }
})
router.post('/', async (req, res) => {
    const { users } = req.body;
    try {
        for  (const user of users) {
            const resultValidation = await validateUserInfo(user);
            if(resultValidation.process) {
                const salt = await bcrypt.genSalt();
                user.password = await bcrypt.hash(user.password, salt);
                await UserModel.create(user).then(() => console.log("Created")).then(err => console.log(err));
            } else {
                res.json({ users: [], err: resultValidation.message})
                break;
            }
        }
    } catch(err) {
        res.json({ users: [], err: "Error"})
    }
    await UserModel.find({}).then(users => res.json({users})).catch(err => console.log(err));
})
router.delete('/', (req, res) => {
   UserModel.deleteMany({}).then(() => res.json({ users: []})).catch((err) => res.json({err}));
})
// Retrieving, updating and removing a specific worker
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let user = await UserModel.find({ id});
        if(user.length !== 0) {
            res.json({user})
        } else {
            user = await UserModel.findById(id);
            res.json({user})
        }
    } catch(err) {
        res.json({user: "", err})
    }
})
router.post('/:id', async (req, res) => {
    const body = req.body;
    const user = body.user;
    const id = req.params.id;
    try {
        const resultValidation = await validateUserInfo(user);
        if(resultValidation.process) {
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(user.password, salt);
            user.id = id;
            await UserModel.create(user).then(() => res.json({user})).catch(() => res.json({ user: "", err: " Not created"}) );
        } else {
            res.json({ user: "", err: resultValidation.message})
        }
    } catch {
        res.json({ user: "", err: "Incorrect Info"})
    }
})
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let user = await UserModel.deleteOne({ id});
        if(user.n !== 0) {
            res.json({process: "success"})
        } else {
            user = await UserModel.deleteOne({_id: id});
            res.json({process: "success"})
        }
    } catch(err) {
        res.json({err})
    }

})
//  Updating a specific worker’s address and mobile phone
router.put('/:id/address', async (req, res) => {
    const id = req.params.id;
    const address = req.body.address;
    if(address === "") {
        res.json({message: "Provide address"});
    } else {
        try {
            let user = await UserModel.findOneAndUpdate({ id }, {address});
            if(user !== null) {
                user.address = address;
                res.json({user})
            } else {
                user = await UserModel.findByIdAndUpdate(id, {address});
                user.address = address;
                res.json({user})
            }
        } catch(err) {
            res.json({user: "", err})
        }
    }
})
router.put('/:id/mobile', async (req, res) => {
    const id = req.params.id;
    const mobile = req.body.mobile;
     if(mobile && !validator.isMobilePhone(mobile.trim(), [
         "en-AU",
         "en-US",
         "en-NZ",
         "en-UK"
     ])) {
        res.json({message: "Incorrect phone number"});
    } else {
        try {
            let user = await UserModel.findOneAndUpdate({ id }, {mobile});
            if(user !== null) {
                user.mobile = mobile;
                res.json({user})
            } else {
                user = await UserModel.findByIdAndUpdate(id, {mobile});
                user.mobile = mobile;
                res.json({user})
            }
        } catch(err) {
            res.json({user: "", err})
        }
    }
})
// Updating a specific worker’s password
router.put('/:id/password', async (req, res) => {
    const id = req.params.id;
    let password = req.body.password;
    if(password.length < 8) {
        res.json({message: "at least 8 character"});
    } else {
        try {
            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);
            let user = await UserModel.findOneAndUpdate({ id }, {password});
            if(user !== null) {
                user.password = password;
                res.json({user})
            } else {
                user = await UserModel.findByIdAndUpdate(id, {password});
                user.password = password;
                res.json({user})
            }
        } catch(err) {
            res.json({user: "", err})
        }
    }
})


async function validateUserInfo(user) {
    const { 
        country, 
        fname, 
        lname, 
        email, 
        password, 
        address, 
        city,  
        state,
        ZIP,
        mobile
    } = user;
    if(validator.isEmpty(country.trim())) {
        return { process: false, message: "Provide country"};
     }
 
     if(validator.isEmpty(fname.trim())) {
        return { process: false, message: "Provide first name"};
     }
 
     if(validator.isEmpty(lname.trim())) {
        return { process: false, message: "Provide last name"};
     }
 
     if(!validator.isEmail(email.trim())) {
        return { process: false, message: "Provide email"};
     }
 
     if(!validator.isLength(password, {min: 8})) {
        return { process: false, message: "Password should be at least 8 character"};
     }
 
     if(validator.isEmpty(address[0].trim())) {
        return { process: false, message: "Provide address"};
     }
 
     if(validator.isEmpty(city.trim())) {
        return { process: false, message: "Provide city"};
     }
 
     if(validator.isEmpty(state.trim())) {
        return { process: false, message: "Provide state"};
     }
 
     if(mobile && !validator.isMobilePhone(mobile.trim(), [
         "en-AU",
         "en-US",
         "en-NZ",
         "en-UK"
     ])) {
        return { process: false, message: "Incorrect phone number"};
     }
    return { process: true, message: "Success"};
}
module.exports = router;