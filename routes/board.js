const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Like } = require('../models');

router.get('/list/:page', async (req, res, next) => {
   const page = req.params.page;

});


module.exports = router;