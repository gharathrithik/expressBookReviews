const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if(!isValid(username)) {
        users.push({
            "username" : username,
            "password" : password
        });
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    }
    else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

/*
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});
*/

// Task 10
function getBookList () {
    return new Promise ((resolve, reject) => {
        resolve(books);
    })
}
public_users.get('/',function (req, res) {
    getBookList().then(
        (book) => res.send(JSON.stringify(book, null, 4)),
        (error) => res.send("Error Occured")
    );
});

/*
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
*/

// Task 11
function getBookByIsbn(isbn) {
    let book = books[isbn];
    return new Promise ((resolve, reject) => {
        if (book) {
            resolve(book);
        } else {
            reject("Invalid ISBN");
        }
    }) 
}
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getBookByIsbn(isbn).then(
        (book) => res.send(book),
        (error) => res.send(error)
    )
});

/*
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const keys = Object.keys(books);
  keys.forEach(key => {
    if(books[key].author === author) {
        res.send(books[key]);
    }
  })
});
*/

// Task 12
function getBookByAuthor(author) {
    let result = [];
    return new Promise((resolve, reject) => {
        for (let isbn in books) {
            let book = books[isbn];
            if (book.author === author) {
                result.push(book);
            }
        }
        if (result.length != 0) {
            resolve(result);
        } else {
            reject("Invalid author name!");
        }
    })
}
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBookByAuthor(author).then(
        (book) => res.send(book),
        (error) => res.send(error)
    );
});

/*
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const keys = Object.keys(books);
  keys.forEach(key => {
    if(books[key].title === title) {
        res.send(books[key]);
    }
  })
});
*/

//Task 13
function getBookByTitle (title) {
    let result = [];
    return new Promise ((resolve, reject) => {
        for (let isbn in books){
            let book = books[isbn];
            if(book.title === title){
                result.push(book);
            }
        }
        if(result.length != 0){
            resolve(result);
        } else {
            reject("Invalid book title!");
        }
    })
}
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBookByTitle(title).then(
        (book) => res.send(book),
        (error) => res.send(error)
    )
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
