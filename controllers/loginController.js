const User = require("../models/People");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

async function login(req, res, next) {
    const username = req.body.email;

    try{
        const user = await User.findOne({email: username});
        if(user) {
            const isValidPassword = await bcrypt.compare(req.body.password, user.password);
            if(isValidPassword) {
                const userObject = {
                    userid: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    role: user.role || "user",
                };
                const token = jwt.sign(userObject, process.env.JWT_SECRET_KEY, {
                    expiresIn: process.env.JWT_EXPIRY,
                })
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY,
                    httpOnly: true,
                    signed: true
                })
                res.status(200).json({
                   ...userObject
                })
            }
            else {
                res.status(403).json({
                    message: "Wrong email or password."
                })
            }
        } else{
            res.status(403).json({
                message: "Wrong email or password."
            })
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Server error",
            error: err
        })
    }
}

module.exports = login;