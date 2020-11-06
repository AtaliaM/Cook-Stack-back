const express = require('express');
require('./db/mongoose'); //makes sure the file runs
const userRouter = require("./routers/user");

const app = express();
const port = process.env.PORT || 8000;

//customize our server
app.use(express.json())
app.use(userRouter);

app.listen(port, () => {
    console.log(`server is up on port ${port}`);
})