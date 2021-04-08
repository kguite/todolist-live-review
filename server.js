// to do app steps:
// mkdir
// open in VS code, open terminal
// npm init - press enter through - this creates the package.json file
// npm express --save
// npm nomgodb --save
// npm ejs --save
// npm dotenv --save
// (can also use shorthand - npm i ejs dotenv --save)
// mkdir two folders: public, and views
// touch server.js
// next steps.....






// require the use of express
const express = require('express')
// define express as 'app' so further references to express can be called as 'app'
const app = express()
// require the use of MongoDB
const MongoClient = require('mongodb').MongoClient
// choose a port (any number)
const PORT = 2121
require('dotenv').config()

// Get connection string from MongoDBAtlas, after creating a cluster, new username/pass, make sure IP address connected
// change the username/pass and database names in your string

// db is the connection to the database.  it needs the connection string and name

// let can be used once with all variables underneath

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'


// MongoClient is taking in the connection string as above, and also unifiedTopology: true, which is a special Mongo thing to prevent errors.
// MongoClient is a promise. When we get the response back from Mongo Atlas, we get a .then (async/await is also possible, depending - .then is the old way)
// inside the .then is the connection to our client, the connection to our database
// client is holding the connection. this .then is going to fire once it resolves/connected
// console log is just to see if it's connected. template literal the dbname 
// db = client (what we got back) - connected to db, able to grab that connection and store it in the db variable.
// this is cool - we are storing the connection in the db variable. db anywhere else in our codebase is the connection to our database.

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', async (req,res)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
})

app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

app.put('/markComplete', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: true
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.put('/undo', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{
        $set: {
            completed: false
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.delete('/deleteTodo', (req, res)=>{
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})

// this is starting the server, with it's declared port with the console log to see if it's connected

 
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    
