const express = require("express");
const Books = require("../models/books");

//import class จาก module
const router = express.Router();

router.get("/product", (req, res) => {
    Books.find().exec((err, doc) => {
        res.render("../views/products/product", { books: doc }); // ส่งค่า property กลับไป
    })
});

module.exports = router;
