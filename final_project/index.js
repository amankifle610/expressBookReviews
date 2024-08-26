const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware
app.use("/customer/auth/*", (req, res, next) => {
    // Check if session has a valid token
    if (req.session && req.session.token) {
        jwt.verify(req.session.token, 'your_secret_key', (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = decoded; // Store user info in request
            next();
        });
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
