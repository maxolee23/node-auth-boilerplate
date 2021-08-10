const router = require("express").Router();
const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {

    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    })
    try {
        if (!(user.firstName && user.lastName && user.email && user.password)){
            res.statusCode(406).send("Please fill out all fields.")
        }

        const matchedEmail = await User.findOne({email: user.email});
        if (matchedEmail){
            res.statusCode(406).send("Email already exists in the database");
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;

        const savedUser = await user.save();
        res.send({user: user._id})
    } catch (err) {
        res.statusCode(400).send(err)
    }
})

router.post("/login", async (req, res) => {
    if (!(req.body.email && req.body.password)){
        res.status(406).send("Please fill out all the input fields.")
    }

    const user = await User.findOne({email: req.body.email});
    if (!user) {
        res.status(400).send("Email does not exist in the database.")
    };

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        res.status(400).send("Incorrect password")
    };

    // res.send("success")
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_KEY, {expiresIn: "10m"});
    res.header("auth-token", token).send(token);
    try {

    } catch (err) {
        res.status(500).send(err)
    }


})


module.exports = router;