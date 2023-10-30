const jwt = require("jsonwebtoken");
require("dotenv").config();


const auth = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    try {
        jwt.verify(token, process.env.key, function(err, decoded) {
            if(decoded){
                req.body.userId = decoded.userId;
                next();
            }else{
                res.status(400).send({"msg": "You are not authorized."});
            }
          });
    } catch (err) {
        res.send({"msg": err});
    }
}

module.exports = {auth};