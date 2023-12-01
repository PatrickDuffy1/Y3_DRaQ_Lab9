const express = require('express')
const app = express()
const port = 4000; // Port that will be used

// Use cors to allow cross origin requests
const cors = require('cors');
app.use(cors());
app.use(function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
res.header("Access-Control-Allow-Headers",
"Origin, X-Requested-With, Content-Type, Accept");
next();
});

// Use body-parser for POST method
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://adminadmin:adminadmin@cluster0.g7sn3k5.mongodb.net/MyDatabase?retryWrites=true&w=majority');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// The schema of bookSchema
const bookSchema = new mongoose.Schema({
  title: String,
  cover: String,
  author: String
});

const bookModel = mongoose.model('my_books', bookSchema) // Add to the bookSchema

// Find book by id and delete it from the database
app.delete('/api/book/:id', async(req, res) =>{

   console.log("Delete: " + req.params.id);

   let book = await bookModel.findByIdAndDelete(req.params.id); // Find book by id and delete it from the database
   res.send(book); // Will not ecxecute unitl book has been deleted
})

// Find book by id and update it based on the values the user submitted
app.put('/api/book/:id', async(req, res) =>{

    console.log("Update: " + req.params.id);

    let book = await bookModel.findByIdAndUpdate(req.params.id, req.body, {new:true}); // Find book by id and update it based on the values the user submitted
    res.send(book); // Will not send until book has been found
})

// Route point that sends 'Hello World!' when passed /
app.get('/', (req, res) => {
    res.send('Hello World!')
})

// Route point that sends the new book when passed /api/book
app.post('/api/book', (req, res)=>{
    console.log(req.body);

    // Create new book and set attributes
    bookModel.create({
        title:req.body.title,
        cover:req.body.cover,
        author:req.body.author
    })
    .then(()=>{res.send('Book created')}) // Callback function
    .catch(()=>{res.send('Book NOT created')}); // Callback function

   // res.send("Data Recieved!");
})

app.get('/api/book/:identifier', async (req,res)=>{
    console.log(req.params.identifier);

    let book = await bookModel.findById(req.params.identifier); // // Asynchronus MongoDB command to book by id
    res.send(book);
})

// Route point that sends the books JSON when passed /api/books
app.get('/api/books', async(req, res)=>{

    let books = await bookModel.find({}); // Asynchronus MongoDB command to get all of the books in the database
    res.json(books);
})

// Listen on the selected port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})