//import mudules
const express = require('express')


const index = require('./Index')
const product = require('./Product')
const users = require('./Users')

const books = require('./Books')
const cart = require('./Cart')

const static = require('./Static')

const app = express()


 
app.use(index)
app.use(product)

app.use(users)
app.use(books)
app.use(cart)

app.use(static)




module.exports = app

 





