const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const USER_SECRET_KEY = "customer_secret_key";

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.find(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const _user = users.find(u => u.username === username);
  return (_user && _user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const { username, password } = req.body;
  if (!isValid(username) || !authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Wrong user/passw" });

    
  }

  let _token = jwt.sign({ username }, USER_SECRET_KEY, { expiresIn: '2h' });
  users.find(u => u.username === username).token = _token;
  return res.status(200).json({ _token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const _isbn = req.params.isbn;
  const _review = req.body.review;
  const _token = req.headers.authorization.replace("Bearer ", "");
  
  try {
    const _userData = jwt.verify(_token, USER_SECRET_KEY);
    const _username = _userData.username;
    if (!books[_isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[_isbn].reviews) {
      books[_isbn].reviews = [];
    }

    const _bookReviews = books[_isbn].reviews;
    const _userReview = Object.keys(_bookReviews).find(r => r.username === _username);
    if (_userReview) {
      _userReview.review = _review;
    } else {
      books[_isbn].reviews[_username] = _review;
    }
    return res.status(200).json({ message: "Review done!" });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const _isbn = req.params.isbn;
  const _token = req.headers.authorization.replace("Bearer ", "");
  
  try {
    const _userData = jwt.verify(_token, USER_SECRET_KEY);
    const _username = _userData.username;
    if (!books[_isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[_isbn].reviews) {
      books[_isbn].reviews = [];
    }

    const _bookReviews = books[_isbn].reviews;
    books[_isbn].reviews = Object.keys(books[_isbn].reviews).find(r => r.username !== _username);
    return res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
