const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.find((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username: username, password: password });

  return res.status(201).json({ message: "User successfully registered" });
});

// Task 10: Get the book list available in the shop using async/await
public_users.get('/', async function (req, res) {
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book by ISBN" });
  }
});

// Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    let matchingBooks = {};

    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author === author) {
        matchingBooks[isbn] = books[isbn];
      }
    });

    if (Object.keys(matchingBooks).length > 0) {
      return res.status(200).json(matchingBooks);
    }

    return res.status(404).json({ message: "No books found by this author" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Task 13: Get books based on title using async/await
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    let matchingBooks = {};

    Object.keys(books).forEach((isbn) => {
      if (books[isbn].title === title) {
        matchingBooks[isbn] = books[isbn];
      }
    });

    if (Object.keys(matchingBooks).length > 0) {
      return res.status(200).json(matchingBooks);
    }

    return res.status(404).json({ message: "No books found with this title" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;