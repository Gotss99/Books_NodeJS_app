const express = require("express");

const Cart = require("../models/cart");

//import class จาก module
const router = express.Router();

router.get("/contact", (req, res) => {
    const username = req.session.username;
    if (username) {
        Cart.aggregate([
            {
                $match: { username: req.session.username },
            },
            {
                $group: {
                    _id: null,
                    amount: { $sum: "$amount" },
                },
            },
        ]).exec((err, count) => {
            res.render("../views/contents/contact", {
                amount: count,
                username: username,
            }); // ส่งค่า property กลับไป
        });
    } else {
        res.render("../views/contents/contact");
    }
});

module.exports = router;
