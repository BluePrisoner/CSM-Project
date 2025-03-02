const express = require('express');
const router = express.Router();
const path = require('path');


require('dotenv').config();
const {login,dashboard,register,registerPayload} = require('../controllers/auth.js')

router.use('/user/login/static', express.static(path.join(__dirname, '..', 'public', 'login', 'auth')));

router.route('/user/dashboard').get(dashboard);
router.route('/user/login').get(login);
router.route('/user/register').get(register).post(registerPayload);



module.exports = router;

