const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/posts", verify, (req, res) => {
    res.json({posts: {title: "my first post", description: "random data"}})
})



module.exports = router;