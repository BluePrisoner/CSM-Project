const express = require('express');
const router = express.Router();
const {authenticateUser}  = require('../middleware/authMiddleware');

router.get('/dashboard/plan', authenticateUser, (req, res) => {
  res.render('layout', {
    title: 'Plan',
    body: res.render('user/plan', { user: req.user }, (err, html) => html)
  });
});

router.get('/dashboard/subscription', authenticateUser, (req, res) => {
  res.render('layout', {
    title: 'Subscription',
    body: res.render('user/subscription', { user: req.user }, (err, html) => html)
  });
});

router.get('/dashboard/recharge', authenticateUser, (req, res) => {
  res.render('layout', {
    title: 'Recharge',
    body: res.render('user/recharge', { user: req.user }, (err, html) => html)
  });
});

router.get('/dashboard/billing', authenticateUser, (req, res) => {
  res.render('layout', {
    title: 'Billing',
    body: res.render('user/billing', { user: req.user }, (err, html) => html)
  });
});

router.get('/dashboard/userinfo', authenticateUser, (req, res) => {
  res.render('layout', {
    title: 'User Info',
    body: res.render('user/userinfo', { user: req.user }, (err, html) => html)
  });
});

router.get('/dashboard/support', authenticateUser, (req, res) => {
  res.render('layout', {
    title: 'Support',
    body: res.render('user/support', { user: req.user }, (err, html) => html)
  });
});

module.exports = router;
