const Redis = require('../functionalities/redis');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');

// ---- CRUD


// CREATE
exports.createUser = (req, res, next) => {

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    photo_url: "proutPHOTO"
  });
//REDIS CREATION
  Redis.create(user);

  user.save()
    .then(() => res.status(201).json({ message: 'User enregistré !'}))
    .catch(error => res.status(400).json({ error }));
}

// DELETE
exports.deleteUser = (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'User supprimé !'}))
    .catch(error => res.status(400).json({ error }));
}


// UPDATE
exports.updateUser = (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .then(user => {
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.status(200).json({ message: 'User updated!', user: user });
    })
    .catch(error => res.status(400).json({ error }));
}

// GET BY ID
exports.getUserById = (req, res, next) => {
    User.findOne({ _id: req.params.id })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }));
}

// GET ALL USER ONLINE
exports.getAllUserOnline = (req, res, next) => {
    User.find({ online: true })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }));


}

// GET ALL
exports.getAllUser = (req, res, next) => {
    User.find()

    .then(users => res.status(200).json(users))
    .catch(error => res.status(400).json({ error }));
}




// ---- CONNEXION
exports.signup = (req, res, next) => {

    console.log(req);

    bcrypt.hash(req.body.password, 10)
      .then(hash => {

        if(!validator.isEmail(req.body.email)) {
            return res.status(400).json({type: "email", message: "E-mail isn't in a valid format"});
        }

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash, 
            // photo_url: `${req.protocol}://${req.get('host')}/images/user/${req.file.filename}`
            photo_url: "proutPHOTO"
        });
        //REDIS SIGNUP
        Redis.signup(user);


        user.save()
          .then((user) => res.status(201).json({ message: 'Utilisateur créé !', user_id: user._id }))
          .catch(error => {

            let errorToSend = Object.keys(error.keyPattern)[0] === 'username' ? {type: "username", message: `Username ${error.keyValue.username} already exist`} : {type: "email", message: `E-mail ${error.keyValue.email} already exist`};
            res.status(400).json(errorToSend)
          });
      })
      .catch(error => res.status(500).json({message: "Error for the hashing", error: error.toString() }));
};

exports.login = (req, res, next) => {
    console.log("Login start");
    User.findOne({email: req.body.email})
        .then(user => {
            console.log("User found");
            if(!user) {
                console.log("No user found");
                return res.status(401).json({type: "email", message: "E-mail doesn't exist"});
            }
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                console.log("Password checked");
                if (!valid) {
                    console.log("Invalid password");
                    return res.status(401).json({type: "password", message: "Password incorrect"});
                }
                //REDIS LOGIN

                Redis.login(user,res);

                

            })
            .catch(error => {
                console.error("Error in password check", error);
                res.status(500).json({ prout: "prout" });
            });
        })
        .catch(error => {
            console.error("Error in user find", error);
            res.status(500).json({ err: "lala" });
        });
};