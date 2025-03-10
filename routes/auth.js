const express = require('express');
const router = express.Router();
const path = require('path');


require('dotenv').config();
const {login,dashboard,register,registerPayload,loginPayLoad, logout} = require('../controllers/auth.js')
const {authenticateUser} = require('../middleware/authMiddleware.js')
const {redirectIfAuthenticated, logoutRedirected} = require('../middleware/redirectAlreadyAuth.js');


router.use('/user/login/static', express.static(path.join(__dirname, '..', 'public', 'login', 'auth')));

router.route('/user/dashboard').get(authenticateUser,dashboard);
router.route('/user/login').get(redirectIfAuthenticated,login).post(loginPayLoad);
router.route('/user/register').get(redirectIfAuthenticated,register).post(registerPayload);
router.route('/user/logout').post(logout)



module.exports = router;

