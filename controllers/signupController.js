const bcrypt = require('bcrypt');
const People = require('../models/People');

async function signup(req, res, next) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new People({
        ...req.body,
        password: hashedPassword
    })

    try {
       await newUser.save();
       res.status(200).json({
       message: "User has been signed up successfully."
    })
    }
    catch(err) {
        res.status(500).json({
            message: "An unknown error occured."
        })
    }
  
}

module.exports = signup;