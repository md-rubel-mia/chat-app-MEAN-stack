const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const signupRouter = require("./routers/signupRouter");
const loginRouter = require('./routers/loginRouter');

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then( () => console.log("Database connection successful."))

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET_KEY));

app.use("/signup", signupRouter);
app.use("/login", loginRouter);

app.listen(process.env.PORT, () => {
    console.log(`Application is listening to port ${process.env.PORT}`);
})