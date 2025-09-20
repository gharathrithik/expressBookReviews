const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let validUser = users.filter(user => {
        return(user.username === username);
    })
    if(validUser.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let filteredUser = users.filter(user =>{
        return (user.username === username && user.password === password);
    });
    if (filteredUser.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    res.status(404).json({ message : "Error logging in!"});
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
        data : password
    }, "access", {expiresIn: 60 * 60});

    req.session.authorization = {
        accessToken, username
    }

    res.send("User successfully logged in")
  }
  else {
    res.status(404).json({ message : "Invalid login! Please check credentials."})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const isbn = req.params.isbn;
    const userId = req.session.authorization['username'];
    const review = req.query.review;
    if (books[isbn]){
        let book = books[isbn];
        book.reviews[userId] = review;
        res.send("Review successfully added.");
    } else {
            res.status(404).json({ message : "Invalid ISBN!"});
        }
});

// Delete review by isbn
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]){
        let book = books[isbn];
        delete book.reviews[username];
        res.send("Review deleted successfully.");
    } else {
            res.status(404).json({ message : "Invalid ISBN!"});
        }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
