//import mudules
const express = require('express')


const index = require('./Index')
const product = require('./Product')
const users = require('./Users')

const books = require('./Books')

const app = express()


 
app.use(index)
app.use(product)

app.use(users)
app.use(books)



module.exports = app

 





