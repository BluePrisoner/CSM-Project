const express = require('express');
const router = express.Router();
const path = require('path');

require('dotenv').config();

const {
  login, dashboard, register, registerPayload,
  loginPayLoad, logout, adminLogin, adminLoginPayload,
  adminDashboard, logoutAdmin
} = require('../controllers/auth.js');

const { authenticateUser, authenticateAdmin } = require('../middleware/authMiddleware.js');
const { redirectIfAuthenticated, redirectIfAuthenticatedAdmin } = require('../middleware/redirectAlreadyAuth.js');
const {setUserDisplayName} = require('../middleware/fetchUserName.js'); 
const { renderPlanPage, updatePlanStatus, renderSubPage, renderRechargePage, handleRecharge, renderBilling } = require('../controllers/userDashboardController.js');




router.use('/user/login/static', express.static(path.join(__dirname, '..', 'public', 'login', 'auth')));

// User Auth Routes
router.route('/user/login').get(redirectIfAuthenticated, login).post(loginPayLoad);
router.route('/user/register').get(redirectIfAuthenticated, register).post(registerPayload);
router.route('/user/logout').post(logout);

// Dashboard Home
router.route('/user/dashboard').get(authenticateUser, dashboard);
router.route('/user/dashboard/plan').get( authenticateUser, setUserDisplayName, renderPlanPage).post(updatePlanStatus);
router.route('/user/dashboard/subscription').get(authenticateUser,setUserDisplayName,renderSubPage)
router.route('/user/dashboard/recharge').get(authenticateUser,setUserDisplayName,renderRechargePage).post(authenticateUser,handleRecharge);
router.route('/user/dashboard/billing').get(authenticateUser,setUserDisplayName,renderBilling);



// Sub-pages under dashboard
const dashboardRoutes = [

    { path: 'userinfo', view: 'user/userinfo', title: 'User Info' },
    { path: 'support', view: 'user/support', title: 'Support' }
  ];
  
  dashboardRoutes.forEach(({ path, view, title }) => {
    router.get(`/user/dashboard/${path}`, authenticateUser, setUserDisplayName, (req, res) => {
      res.render(view, {}, (err, html) => {
        if (err) {
          console.log(`Error rendering ${view}:`, err);
          return res.status(500).send("Internal error");
        }
        res.render('dashboard', { title, body: html }); // res.locals.user will be available in all templates
      });
    });
  });
  

// Admin Routes
router.route('/admin/login').get(redirectIfAuthenticatedAdmin, adminLogin).post(adminLoginPayload);
router.route('/admin/dashboard').get(authenticateAdmin, adminDashboard);
router.route('/admin/logout').post(logoutAdmin);

module.exports = router;
