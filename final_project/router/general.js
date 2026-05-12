const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Check that both username and password were provided
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }
  
    // Check if the username already exists
    if (users.find((user) => user.username === username)) {
      return res.status(409).json({
        message: "Username already exists"
      });
    }
  
    // Add the new user to the shared users array
    users.push({
      username: username,
      password: password
    });
  
    // Return success message
    return res.status(201).json({
      message: "User successfully registered"
    });
  });
  
  
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn]);
  });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = {};

    for (const isbn in books) {
        if (books[isbn].author === author) {
            matchingBooks[isbn] = books[isbn];
        }
    }

    if (Object.keys(matchingBooks).length > 0) {
        return res.status(200).json(matchingBooks);
    }

    return res.status(404).json({ message: "No books found by this author" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let result = {};

    Object.keys(books).forEach((isbn) => {
        if (books[isbn].title === title) {
            result[isbn] = books[isbn];
        }
    });

    return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
