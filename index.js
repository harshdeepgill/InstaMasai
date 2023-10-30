const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./Routes/user.route");


const PORT = process.env.PORT || 8080


const app = express();
app.use(express.json());

app.use("/users",userRouter);

// Restricted routes


app.listen(PORT, async () =>{
    try {
        await connection;
        console.log("DB connected")
        console.log("Server started")
    } catch (err) {
        console.log(err)
    }
})