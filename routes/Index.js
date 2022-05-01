const express = require("express");
const { where, count } = require("../models/books");
const Books = require("../models/books");
const Cart = require("../models/cart");

//import class จาก module
const router = express.Router();

router.get("/", (req, res) => {
    const username = req.session.username
    if (username) {
        Books.find().exec((err, doc) => {
            Cart.aggregate([
                {
                    $match: { username: req.session.username }
                },
                {
                    $group: {
                        _id: null,
                        amount: { $sum: "$amount" }
                    }
               
                },
                
            ]).exec((err, count) => {

                res.render("index", { books: doc, amount: count, username: username }); // ส่งค่า property กลับไป
            });
        });
    } else {
        Books.find().exec((err, doc) => {
            res.render("index", { books: doc });
        });
    }
});

module.exports = router;
