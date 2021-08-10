const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");

const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();


//connect to db
mongoose.connect(process.env.MONGOURI, {useCreateIndex: true, useFindAndModify: true, useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("connected to mongodb")
})

//middleware
app.use(morgan("dev"));
app.use(express.json())
//route middleware
app.use('/api/user', authRoute);
app.use("/api", postRoute);

app.listen(process.env.PORT, () => {
    console.log("we be listenin")
})



