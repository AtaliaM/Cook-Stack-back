const express = require('express');
require('./db/mongoose'); //makes sure the file runs
const userRouter = require("./routers/user");
const recipesRouter = require("./routers/recipe");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;

//customize our server
app.use(express.json())
app.use(cors());
app.use(userRouter);
app.use(recipesRouter);

app.listen(port, () => {
    console.log(`server is up on port ${port}`);
})