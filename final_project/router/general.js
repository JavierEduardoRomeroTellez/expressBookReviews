const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(username && password){
    if(!isValid(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let nbooks = Object.values(books);
  let author = req.params.author;

  let filtered_books = nbooks.filter((book) => book.author === author);

  res.send(JSON.stringify(filtered_books, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let nbooks = Object.values(books);
  let title = req.params.title;

  let filtered_books = nbooks.filter((book) => book.title === title);

  res.send(JSON.stringify(filtered_books, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.send(JSON.stringify({"reviews" : books[isbn].reviews}, null, 4));
});

const getAllBooks = async () => {
  const response = await axios.get('http://localhost:3300/');
  console.log(response.data);
}

const getBookDetails = async () => {
  const response = await axios.get('http://localhost:3300/isbn/1');
  console.log(response.data);
}

const getDetailsAuthor = async () => {
  const response = await axios.get('http://localhost:3300/author/Unknown');
  console.log(response.data);
}

const getDetailsTitle = async () => {
  const response = await axios.get('http://localhost:3300/title/Fairy%20tales');
  console.log(response.data);
}

module.exports.general = public_users;
