const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const signupRouter = require("./routers/signupRouter");

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then( () => console.log("Database connection successful."))

app.use(express.json());

app.use("/signup", signupRouter);

app.listen(process.env.PORT, () => {
    console.log(`Application is listening to port ${process.env.PORT}`);
})