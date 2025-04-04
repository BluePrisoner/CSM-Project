const express = require('express');
const router = express.Router();
const path = require('path');

const {errorPage} = require('../controllers/errors.js');


router.route('*').get(errorPage);

module.exports = router;

