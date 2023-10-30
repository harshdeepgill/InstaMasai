const express = require("express");
const { UserModel } = require("../Model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { BlacklistModel } = require("../Model/blacklist.model");

const userRouter = express.Router();


userRouter.post("/register", async (req, res) => {
    const {email, password} = req.body;
    try {
        const alreadyUser = await UserModel.findOne({email});
        if(alreadyUser){
            res.status(200).send({"msg": "User already exist, please login"});

        }else{
            bcrypt.hash(password, 5, async (err, hash)=> {
                if(err){
                    res.status(400).send({"msg": "User Not registred!"})
                }else{
                    req.body.password = hash;
                    const user = new UserModel(req.body);
                    await user.save();
                    res.status(200).send({"msg": "New User Registered!", "user": user});
                }
            });
        }
        
    } catch (err) {
        res.send({"msg": err})
    }
})

userRouter.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email});
        bcrypt.compare(password, user.password, function(err, result) {
            if(result){
                var token = jwt.sign({ userId: user._id }, process.env.key, {expiresIn: "7d"});
                res.status(200).send({"msg": "Login Successful", "token": token})
            }else{
                res.status(400).send({"msg": "Password did not match!"})
            } 
        });
        
    } catch (err) {
        res.send({"msg": err});
    }
})

userRouter.get("/logout", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const blacklist = new BlacklistModel({token});
        await blacklist.save();
        res.status(200).send({"msg": "Sucessfully Logged out!"})
    } catch (err) {
        res.send({"msg": err})
    }
})

module.exports = {userRouter};