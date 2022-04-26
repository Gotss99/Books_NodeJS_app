const express = require("express");

const User = require("../models/users");

//import class จาก module
const router = express.Router();



router.get("/form-regis", (req, res) => {
    res.render("form-regis");
});


router.post("/register",  (req, res) => {
    //    console.log(req.body)
    const users_data = new User({
        username: req.body.username,
        password: req.body.password
    })
    if(req.body.password !== req.body.c_password) {
        res.redirect("/form-regis");
    }else {
        User.register(users_data, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/form-login");
            }
        });
    }
   
});


router.get("/form-login", (req, res) => {
    res.render("form-login");
});



router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const timeExpire = 3600000; //1 ชั่วโมง
    const user = await User.findOne({
        username,
        password
      });

      if (user) {
        req.session.username = username
        req.session.password = password
        req.session.login = true
        req.session.cookie.maxAge = timeExpire
      
        res.redirect("/books/");
      } else {
        res.render('form-login', { message: 'Username or Password incorrect'});
      }
    

  
});



router.get("/logout", (req, res) => {
    //ลบ cookie 
    // res.clearCookie("username");
    // res.clearCookie("password");
    // res.clearCookie("login");

    //ลบ session
    req.session.destroy((err) => {
        res.redirect("/books/");
    })


});

module.exports = router;
