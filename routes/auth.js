const express = require('express');
const router = express.Router();
const path = require('path');


require('dotenv').config();
const {login,dashboard} = require('../controllers/auth.js')

router.use('/login/static', express.static(path.join(__dirname, '..', 'public', 'login', 'auth')));

router.route('/login').get(dashboard).post(login);



module.exports = router;

