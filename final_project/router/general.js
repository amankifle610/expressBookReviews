const express = require('express');
const axios = require('axios'); // Import axios for HTTP requests
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Get the book list available in the shop (Task 10)
public_users.get('/', async function (req, res) {
    try {
        // Simulating fetching data from an external source
        // For local testing, we're using a static data source (booksdb.js)
        const response = await axios.get('http://localhost:5000/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list" });
    }
});

// Get book details based on ISBN (Task 11)
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const book = books[isbn];
        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details" });
    }
});

// Get book details based on author (Task 12)
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();
    try {
        const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author);
        if (booksByAuthor.length > 0) {
            return res.status(200).json(booksByAuthor);
        } else {
            return res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Get all books based on title (Task 13)
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();
    try {
        const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title);
        if (booksByTitle.length > 0) {
            return res.status(200).json(booksByTitle);
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by title" });
    }
});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const book = books[isbn];
        if (book && book.reviews) {
            return res.status(200).json(book.reviews);
        } else {
            return res.status(404).json({ message: "Reviews not found for this book" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book reviews" });
    }
});

module.exports.general = public_users;
