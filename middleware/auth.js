const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../Model/blacklist.model");
require("dotenv").config();


const auth = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const blacklist = await BlacklistModel.findOne({token});
        if(blacklist){
            res.status(400).send({"msg": "Login Again!"});
        }else{
            jwt.verify(token, process.env.key, function(err, decoded) {
                if(decoded){
                    req.body.userId = decoded.userId;
                    next();
                }else{
                    res.status(400).send({"msg": "You are not authorized."});
                }
              });
        }
    } catch (err) {
        res.send({"msg": err});
    }
}

module.exports = {auth};