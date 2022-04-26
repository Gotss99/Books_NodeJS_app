//เรียกใช้งาน Mongoose
const mongoose = require('mongoose')

//เรียกใช้งาน dbConnect
require('./dbConnect')


//ออกแบบ Schema
const usersSchema = mongoose.Schema({
    username:String,
    password:String
   
})

//สร้างโมเดล
const User = mongoose.model('users', usersSchema) // สร้าง Collection

//ส่งออกโมเดล
module.exports = User

//สร้าง function สำหรับบันทึกข้อมูล
module.exports.register = (model, data) => {
    model.save(data)
}