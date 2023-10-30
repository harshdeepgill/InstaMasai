const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./Routes/user.route");
const { PostModel } = require("./Model/post.model");
const { auth } = require("./middleware/auth");
const cors = require("cors");


const PORT = process.env.PORT || 8080


const app = express();
app.use(cors());
app.use(express.json());

app.use("/users",userRouter);

// Restricted routes

app.get("/posts",auth, async(req, res) => {
    const page = req.query.page || 1;
    const {userId} = req.body;
    try {
        const posts = await PostModel.find({userId}).skip((+page-1)*3).limit(3);
        res.status(200).send({"posts": posts});
        
    } catch (err) {
        res.send({"msg": err})
    }
})

app.get("/posts/top",auth, async(req, res) => {
    const {userId} = req.body;
    try {
        const posts = await PostModel.find({userId}).limit(3).sort({no_of_comments:-1});
        res.status(200).send({"posts": posts});
        
    } catch (err) {
        res.send({"msg": err})
    }
})

app.post("/posts/add",auth,  async(req, res) => {
    try {
        const post = new PostModel(req.body);
        post.save();
        res.status(200).send({"msg": "Post is added", "post": post});
    } catch (err) {
        res.send({"msg": err})
    }
})

app.patch("/posts/update/:id",auth,  async(req, res) => {
    const id = req.params.id;
    try {
        const post = await PostModel.findOne({_id:id});
        if(post.userId == req.body.userId){
            const updatedPost = await PostModel.findByIdAndUpdate( {_id:id} ,req.body);
            res.status(200).send({"msg": `Post with id ${id} is updated.`, "Updated post": updatedPost});
        }else{
            res.status(400).send({"msg": "You are not authorized to update this post."})
        }
    } catch (err) {
        res.send({"msg": err})
    }
})

app.delete("/posts/delete/:id",auth,  async(req, res) => {
    const id = req.params.id;
    try {
        const post = await PostModel.findOne({_id:id});
        if(post.userId == req.body.userId){
            await PostModel.findByIdAndDelete({_id:id});
            res.status(200).send({"msg": `Post with id ${id} is delete.`});
        }else{
            res.status(400).send({"msg": "You are not authorized to delete this post."})
        }
    } catch (err) {
        res.send({"msg": err})
    }
})


app.listen(PORT, async () =>{
    try {
        await connection;
        console.log("DB connected")
        console.log("Server started")
    } catch (err) {
        console.log(err)
    }
})