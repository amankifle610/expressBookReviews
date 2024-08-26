const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // This should be replaced with a proper database in a real application

const isValid = (username) => {
    // Check if the username exists in the users array
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    // Check if the username and password match
    return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }
    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username" });
    }
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid password" });
    }
    // Create a JWT token
    const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
    req.session.token = token; // Save token in session
    return res.status(200).json({ message: "Logged in successfully", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query;
    const token = req.session.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const username = decoded.username;
        const book = books.find(book => book.isbn === isbn);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (!book.reviews) {
            book.reviews = {};
        }
        book.reviews[username] = review;
        return res.status(200).json({ message: "Review added/updated successfully" });
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const token = req.session.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const username = decoded.username;
        const book = books.find(book => book.isbn === isbn);
        if (!book || !book.reviews || !book.reviews[username]) {
            return res.status(404).json({ message: "Review not found" });
        }
        delete book.reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
