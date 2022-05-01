const express = require("express");
const Books = require("../models/books");
const Cart = require("../models/cart");

//import class จาก module
const router = express.Router();

router.get("/product", (req, res) => {
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
                console.log(count);
                res.render("../views/products/product", { books: doc, amount: count, username: username }); // ส่งค่า property กลับไป
                
            });
        });
    } else {
        Books.find().exec((err, doc) => {
            res.render("../views/products/product", { books: doc });

        });
    }
});

module.exports = router;
