// --- REDIS SETUP
const redis = require('redis');
const client = redis.createClient({legacyMode:true});
client.on('error', err => console.log('Redis Client Error', err)); 
client.connect();



// --- REDIS CREATE

function create(user){
    client.hSet(user.email, {
        "email": user.email,
        "password": user.password,
        });
    console.log("REDIS CREATE")
}





// --- REDIS SIGNUP

function signup(user){
    let userData = {"email": user.email, "isconnected":true,"nbLogin":1,"lastLogin":Date.now()};
    client.set(user.email,JSON.stringify(userData));
    console.log("REDIS SIGNUP")
};

// --- REDIS LOGOUT

function logout(user,res){
    client.get(user.email, (err, reply) => {
        console.log("Redis callback");
        //error
        if (err) {
            console.error("redis test : ",err);
            return res.status(500).json({ err: "Redis error" + err.message });
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
            data.isconnected = false;
            client.set(user.email,JSON.stringify(data));
            return res.status(200).json({type: "logout", message: "User disconnected"});
        }
        
    })
}

// --- REDIS LOGIN

function login(user,res){
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
                    return res.status(200).json( user );
                } else {
                    console.log("Connected less than ", TIMELIMIT, "ms ago and more than ", LOGINLIMIT, "times");
                    data.isconnected = false;
                    client.set(user.email,JSON.stringify(data));
                    return res.status(401).json({type: "login", message: "Too many login attempts"});
                    //WHAT WE SHOULD DO HERE ???
                }

            }else{
                //CASE WHERE WE CAN CONNECTED
                console.log("Connected more than ", TIMELIMIT, "ms ago");
                data.nbLogin = 1;
                data.lastLogin = now;
                data.isconnected = true;
                client.set(user.email,JSON.stringify(data));
                res.status(200).json( user );


            }

            
        }
        
    })

}




// --- REDIS module


module.exports = {
    signup: signup,
    create: create,
    login: login,
    logout: logout,
};


