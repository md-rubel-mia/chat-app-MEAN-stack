const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);


const signupRouter = require("./routers/signupRouter");
const loginRouter = require('./routers/loginRouter');
const userRouter = require('./routers/userRouter');
const inboxRouter = require('./routers/inboxRouter');

const io = require('socket.io')(server, {
    cors: {origin : 'http://localhost:4200'}
});
global.io = io;

dotenv.config();
app.use(cors({credentials: true, origin: 'http://localhost:4200'}));

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then( () => console.log("Database connection successful."))

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET_KEY));

app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/user", userRouter);
app.use("/inbox", inboxRouter);

server.listen(process.env.PORT, () => {
    console.log(`Application is listening to port ${process.env.PORT}`);
})