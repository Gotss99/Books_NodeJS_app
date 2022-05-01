const express = require("express");

const Books = require("../models/books");
const Cart = require("../models/cart");

const multer = require("multer"); // module อัพโหลดไฟล์

//import class จาก module
const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/books"); //ตำแหน่งจัดเก็บ
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + ".jpg"); //เปลี่ยนชื่อไฟล์ ป้องกันชื่อซ้ำ
    },
});

//เริ่มต้น upload
const upload = multer({
    storage: storage,
})


router.get("/books/", (req, res) => {
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
                
            ]).exec((err, data) => {
                // console.log(doc);
                res.render("../views/books/index", { books: doc, amount: data, username: username }); // ส่งค่า property กลับไป
            });
        
             
        })
        // return res.send({ data: doc})
       
    } else {
        res.render("form-login")
    }
})


router.get("/books/add", (req, res) => {
    //    console.log(req.body)
    res.render("../views/books/add");
});


router.post("/books/add", upload.single("image"),(req, res) => {
    const books_data = new Books({
        name: req.body.name,
        author: req.body.author,
        price: req.body.price,
        image: req.file.filename,
    });

    Books.insertBooks(books_data, (err) => {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Book successfully added");
            res.redirect("/books/");
        }
    });
});


router.get("/books/edit/:id", (req, res) => {
    const book_id = req.params.id;

    // console.log(book_id);
    Books.findOne({ _id: book_id }).exec((err, data) => {
        if (err) {
            console.log(err);
        } else {
            //นำข้อมูลเดิมไปแสดงใน form
            res.render("../views/books/edit", { books: data });
        }
    });
});

//อัพเดตข้อมูล
router.post("/books/update", upload.single('image'), (req, res) => {
    const book_id = req.body.book_id;
    //ข้อมูลใหม่จาก form-edit

    if(!req.file) {
        const book_data = {
            name: req.body.name,
            author: req.body.author,
            price: req.body.price,
    
            // description: req.body.description,
        }

        Books.findByIdAndUpdate(book_id, book_data, {
            useFindAndModify: false,
        }).exec((err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/books/");
            }
        });
    }else {
        const book_data = {
            name: req.body.name,
            author: req.body.author,
            price: req.body.price,
            image: req.file.filename,
            // description: req.body.description,
        }
        //     console.log(book_id);
        //  console.log(book_data);
        Books.findByIdAndUpdate(book_id, book_data, {
            useFindAndModify: false,
        }).exec((err) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/books/");
            }
        });
    }
   
});


router.get("/books/delete/:id", (req, res) => {
    //ลบข้อมูล เฉพาะ id
    Books.findByIdAndDelete(req.params.id, {
        useFindAndModify: false,
    }).exec((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/books/");
        }
    });
});




module.exports = router;
