//เรียกใช้งาน Mongoose
const mongoose = require('mongoose')

//เชื่อมไปยัง MongoDB
const dbUrl = 'mongodb://localhost:27017/workshopDB'
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err => console.log(err))
