//เรียกใช้งาน Mongoose
const mongoose = require('mongoose')

//เรียกใช้งาน dbConnect
require('./dbConnect')

//ออกแบบ Schema
const booksSchema = mongoose.Schema({
    name:String,
    author:String,
    price:Number,
    image:String
   
})

//สร้างโมเดล
const Books = mongoose.model('books', booksSchema) // สร้าง Collection

//ส่งออกโมเดล
module.exports = Books

//สร้าง function สำหรับบันทึกข้อมูล

module.exports.insertBooks = (model, data) => {
    model.save(data)
}