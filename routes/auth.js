const express = require('express');
const router = express.Router();
const path = require('path');


require('dotenv').config();
const {login,dashboard,register,registerPayload,loginPayLoad, logout, adminLogin, adminLoginPayload, adminDashboard, logoutAdmin} = require('../controllers/auth.js')
const {authenticateUser, authenticateAdmin} = require('../middleware/authMiddleware.js')
const {redirectIfAuthenticated, redirectIfAuthenticatedAdmin} = require('../middleware/redirectAlreadyAuth.js');


router.use('/user/login/static', express.static(path.join(__dirname, '..', 'public', 'login', 'auth')));

//user routes

router.route('/user/dashboard').get(authenticateUser,dashboard);
router.route('/user/login').get(redirectIfAuthenticated,login).post(loginPayLoad);
router.route('/user/register').get(redirectIfAuthenticated,register).post(registerPayload);
router.route('/user/logout').post(logout)


//admin routes

router.route('/admin/login').get(redirectIfAuthenticatedAdmin,adminLogin).post(adminLoginPayload);
router.route('/admin/dashboard').get(authenticateAdmin,adminDashboard);
router.route('/admin/logout').post(logoutAdmin);



module.exports = router;

