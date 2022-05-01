//เรียกใช้งาน Mongoose
const mongoose = require('mongoose')

//เรียกใช้งาน dbConnect
require('./dbConnect')

//ออกแบบ Schema
const cartSchema = mongoose.Schema({
    cart_id:String,
    name:String,
    author:String,
    price:Number,
    image:String,
    amount:Number,
    totalPrice:Number,
    username:String,
    

})

//สร้างโมเดล
const Cart = mongoose.model('carts', cartSchema) // สร้าง Collection

//ส่งออกโมเดล
module.exports = Cart

//สร้าง function สำหรับบันทึกข้อมูล

module.exports.addTocart = (model, data) => {
    model.save(data)
}


module.exports.amountCart = () => {
   Cart.aggregate([
       
        {
            $group: {
                _id: null,
                amount: { $sum: "$amount" }
            }
    
        },
    
    ])
}