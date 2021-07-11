const People = require('../models/People');
async function getUsers(req, res, next) {
      try{
        const usersData = await People.find({});
        const users = [];
        usersData.forEach(user => {
            users.push({
                name: user.name,
                id: user._id
            })
        });
        if(users) {
            res.status(200).json({users});
        }
        else {
            res.status(500).json({
                message: "Intenal server error"
            })
        }
      }
      catch(err) {
          res.status(500).json({
              message : "Internal server error"
          })
      }
}

async function getUser(req, res, next) {
    try{
        const userData =  await People.find({_id: req.body.id});
        const user = {
            name: userData[0].name
        }
        if(user) {
            res.status(200).json({...user});
        }
        else {
            res.status(500).json({
                message : "Internal server error"
            })
        }
    }
    catch(err) {
        res.status(500).json({
            message : "Internal server error"
        })
    }
}

module.exports = { getUsers, getUser };