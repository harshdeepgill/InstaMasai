const express = require("express");
const { UserModel } = require("../Model/user.model");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();


userRouter.post("/register", async (req, res) => {
    const {email} = req.body;
    try {
        const alreadyUser = await UserModel.findOne({email});
        if(alreadyUser){
            res.status(200).send({"msg": "User already exist, please login"});

        }else{
            const user = new UserModel(req.body);
            await user.save();
            res.status(200).send({"msg": "New User Registered!", "user": user});
        }
        
    } catch (err) {
        res.send({"msg": err})
    }
})

userRouter.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email});
        if(user.password === password){
            var token = jwt.sign({ userId: user._id }, process.env.key, {expiresIn: "7d"});
            res.status(200).send({"msg": "Login Successful", "token": token})
        }else{
            res.status(400).send({"msg": "Password did not match!"})
        }
        
    } catch (err) {
        res.send({"msg": err});
    }
})

module.exports = {userRouter};