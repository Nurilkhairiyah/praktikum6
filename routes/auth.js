const express = require ('express');
const router = express.Router();
const bcrypt = require ('bcryptjs');
const db = require ('../config/db');

// Render halaman register
router.get('/register', (req, res) => {
    res.render ('register');
});

// Proses register user
router.post ('/register', (req,res) => {
    const { username, email, password } = req.body;

    const hashedpassword = bcrypt.hashSync (password, 10);

    const query = "INSERT INTO users (username, email, password) VALUES (?,?,?)";
    db.query (query, [username, email, hashedpassword], (err, result) => {
        if (err) throw err;
        res.redirect ('/auth/login');
    });
});

// Render halaman login
router.get('/login', (req,res) => {
    res.render ('login');
});

//Proses login user
router.post ('/login', (req,res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [username, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const user = result[0];

        if (bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.redirect ('/auth/profile');
        } else {
            res.send ('incorrect password');
        }
     } else {
        res.send ('user not found');
     }
    }]);
});

// Render halaman profil user
router.get ('/logout', (req, res) => {
    req.session.destroy();
    res.redirect ('/auth/login');
});

module.exports = router;