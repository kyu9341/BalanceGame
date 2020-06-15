const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Like } = require('../models');




module.exports = router;