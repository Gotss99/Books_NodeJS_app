const express = require('express')
const path = require('path')

const router = require('./routes/useRouter')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')

const port = process.env.PORT || 5000;


const app = express()



//ตั้งค่่าให้เป็น Engine สำหรับรันแอพ
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.use(cookieParser())

//เรียกใช้งาน session
app.use(session({
    secret: 'mysession',
    resave:false,
    saveUninitialized:false
}))


app.use(flash())


//กรณีที่รับส่งข้อมูลแบบ POST 
app.use(express.urlencoded({extended:false}))



//ใช้ router เรียกใช้งานไฟล์ใน views ในกรณีที่เป็น Dynamic File
app.use(router)


//เรียกใช้งานไฟล์ใน public ในกรณีที่เป็น Static File
app.use(express.static(path.join(__dirname, 'public')))



//รัน Server
app.listen(port, () => {
    console.log(`Server Running in Port ${port}`)
})