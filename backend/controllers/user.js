// --- REDIS SETUP
const redis = require('redis');
const client = redis.createClient({legacyMode:true});
client.on('error', err => console.log('Redis Client Error', err)); 
client.connect();

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
        
  client.hSet(user.email, {
    "email": user.email,
    "password": user.password,
    });

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
    //JUST TESTING REDIS
    console.log("REDIS TEST")
    client.hGetAll("caca@gmail.com", (err, res) => {
        if (err) {
            console.err("redis test : ",err);
        } else {
            console.log("redis test : ",res);
        }
    })
    console.log("END REDIS TEST")
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

        let userData = {"email": user.email, "connected":true,"nbLogin":1,"lastLogin":Date.now()}
        client.set(user.email,JSON.stringify(userData));
            

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
                client.get(user.email, (err, reply) => {
                    console.log("Redis callback");
                    //error
                    if (err) {
                        console.error("redis test : ",err);
                        return res.status(500).json({ err: "Redis error" });
                    //null or undefined
                    } else if (reply === null || reply === undefined) {
                        console.log("No data in Redis for this key");
                        return res.status(404).json({ err: "No data in Redis for this key" });
                    //data
                    } else {
                        let stringData = reply;
                        console.log(stringData);
                        let data = JSON.parse(stringData);
                        console.log(data);
                        //time since the last login in ms (for now) 
                        const TIMELIMIT = 100000; //could be modified later 
                        const LOGINLIMIT = 10 //could be modified later
                        let now = Date.now();
                        let interval = now - data.lastLogin;
                        console.log(interval);
                        if(interval < TIMELIMIT){
                            console.log("Connected less than ", TIMELIMIT, "ms ago");
                            if(data.nbLogin < LOGINLIMIT){
                                console.log("Connected less than ", TIMELIMIT, "ms ago and less than ", LOGINLIMIT, "times");
                                data.nbLogin++;
                                data.lastLogin = now;
                                data.isconnected = true;
                                client.set(user.email,JSON.stringify(data));
                            } else {
                                console.log("Connected less than ", TIMELIMIT, "ms ago and more than ", LOGINLIMIT, "times");
                                data.isconnected = false;
                                client.set(user.email,JSON.stringify(data));
                                // return res.status(401).json({type: "login", message: "Too many login attempts"});
                                //WHAT WE SHOULD DO HERE ???
                            }

                        }else{
                            //CASE WHERE WE CAN CONNECTED
                            console.log("Connected more than ", TIMELIMIT, "ms ago");
                            data.nbLogin = 1;
                            data.lastLogin = now;
                            data.isconnected = true;
                            client.set(user.email,JSON.stringify(data));


                        }

                        
                    }
                    res.status(200).json( user );
                })

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