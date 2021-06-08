// external imports
const express = require("express");

// internal imports
const { getUsers, addUser, removeUser } = require("../controller/usersController");
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const avatarUpload = require("../middlewares/users/avatarUpload");
const { addUserValidators, addUserValidationHandler } = require("../middlewares/users/userValidators");
const router = express.Router();

// user page
router.get("/", decorateHtmlResponse("Users"), getUsers);

router.post(
    "/", 
    avatarUpload,
    addUserValidators,
    addUserValidationHandler,
    addUser
);

// remove user
router.delete(":/id", removeUser);

module.exports = router;