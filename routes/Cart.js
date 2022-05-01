const express = require("express");
const { off } = require("../models/cart");

const Cart = require("../models/cart");

//import class จาก module
const router = express.Router();

router.get("/cart", (req, res) => {
    const username = req.session.username;
    if (username) {
        Cart.aggregate([
            {
                $match: { username: req.session.username },
            },
        ]).exec((err, doc) => {
            Cart.aggregate([
                {
                    $match: { username: req.session.username },
                },
                {
                    $group: {
                        _id: null,
                        amount: { $sum: "$amount" },
                        totalPrice: { $sum: "$totalPrice" },
                    },
                },
            ]).exec((err, total) => {
                res.render("cart", {
                    cart: doc,
                    amount: total,
                    totalPrice: total,
                    username: username,
                });
            });
        });
    } else {
        res.render("form-login");
    }
});

router.post("/add_to_cart", (req, res) => {
    if (req.session.username) {

        console.log(req.body);
        const cart_data = new Cart({
            cart_id: req.body.cart_id,
            name: req.body.name,
            author: req.body.author,

            image: req.body.image,
            amount: req.body.amount,

            price: req.body.price,
            totalPrice: req.body.price * req.body.amount,

            username: req.session.username,
        });

        Cart.findOne({
            cart_id: cart_data.cart_id,
            username: cart_data.username,
        }).exec((err, rows) => {
            if (!rows) {
                Cart.addTocart(cart_data, (err, result) => {
                    if (result) {
                        req.flash("success", "Cart successfully added");
                        res.redirect("/product");
                    } else {
                        console.log(err);
                    }
                });
            } else {
                const amount = rows.amount;
                const price = rows.price;
                const totalPrice = rows.totalPrice;

                Cart.findOneAndUpdate(
                    {
                        cart_id: cart_data.cart_id,
                        username: cart_data.username,
                    },
                    {
                        amount: cart_data.amount + amount,
                        price: cart_data.price + price,

                        totalPrice: totalPrice * amount,
                    },
                    {
                        new: true,
                    }
                ).exec((err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        req.flash("success", "Cart successfully added");
                        res.redirect("/product");
                    }
                });
            }
        });
    } else {
        res.render("form-login");
    }
});

router.post("/cart/update", (req, res) => {
    if (req.session.login) {
        console.log(req.body);

        const cart_data = {
            cart_id: req.body.cart_id,
            amount: req.body.amount,
        };

        Cart.find({
            cart_id: cart_data.cart_id,
            username: req.session.username,
        }).exec((err, docs) => {
            if (docs) {
                const price = docs.price;
                console.log("docs: " + docs);
    
                Cart.findOneAndUpdate(
                    {
                        cart_id: cart_data.cart_id,
                        username: req.session.username,
                    },
                    {
                        $set: [
                            {
                                amount: cart_data.amount,
                                totalPrice: price * cart_data.amount,
                            },
                        ],
                    },
                    { multi: true, upsert: true }
                ).exec((err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Update: " + result);
                        req.flash("success", "Cart successfully added");
                        res.redirect("/cart");
                    }
                });
            } else {
                console.log('docs: ' + err);
            }
        });
    } else {
        res.render("form-login");
    }
});

router.get("/cart/delete/:id", (req, res) => {
    //ลบข้อมูล เฉพาะ id
    Cart.findByIdAndDelete(req.params.id, {
        useFindAndModify: false,
    }).exec((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/cart");
        }
    });
});

module.exports = router;
