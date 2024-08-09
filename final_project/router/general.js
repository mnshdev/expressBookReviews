const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "username or password missing" });
  }

  
  if (!isValid(username)) {
    users.push({username,password})
      return res.send("Register success");
  } else {
    return res.status(400).json({ message: "username already exists" });
  }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    new Promise((resolve, reject) => {
        resolve(JSON.stringify(books));
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({ message: "Error internal msg" });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    new Promise((resolve, reject) => {
        const _isbn = req.params.isbn;
        const _book = books[_isbn];
        if (!_book) {
            reject("book dont found!");
        } else {
            resolve(_book);
        }
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => { res.status(404).json({ message: error }); });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  new Promise((resolve, reject) => {
    const _author = req.params.author;
    const _resultBooks = Object.values(books).filter(book => book.author === _author);
        if (_resultBooks.length === 0) {
            reject("no results");
        } else {
            resolve(_resultBooks);
        }
    }).then(data => { res.status(200).json(data); })
    .catch(error => { res.status(404).json({ message: error }); });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  new Promise((resolve, reject) => {
    const _title = req.params.title;
    const _resultBooks = Object.values(books).filter(book => book.title === _title);
        if (_resultBooks.length === 0) {
            reject("no results");
        } else {
            resolve(_resultBooks);
        }
    }).then(data => { res.status(200).json(data); })
    .catch(error => { res.status(404).json({ message: error });
  });

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  new Promise((resolve, reject) => {
    const _isbn = req.params.isbn;
    const _resultReviews = books[_isbn];
    if (!_resultReviews) {
        reject("book dont found!");
    } else {
        resolve(_resultReviews.reviews);
    }
  }).then(data => { res.status(200).json(data); })
    .catch(error => { res.status(404).json({ message: error });
  });
});

module.exports.general = public_users;
