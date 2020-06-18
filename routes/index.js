const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

// 프로필 페이지
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', {title:'profile - BalanceGame', user:null });
});

// 회원가입 페이지
router.get('/sign-up', isNotLoggedIn, (req, res) => {
  res.render('sign-up', {
    title: '회원가입 - BalanceGame',
    user: req.user, // 회원 정보 - sign-up.pug 의 회원 정보 렌더링 하는 곳에 회원 정보가 들어감
    signUpError: req.flash('signUpError'),
  });
});


// 메인 페이지 www
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'BalanceGame',
    user: req.user,
  });
});

// 로그인 페이지
router.get('/login', (req, res, next) => {
  res.render('login', {
    title: 'login - BalanceGame',
    user: req.user,
    loginError: req.flash('loginError'),
  });
});

router.get('/write', (req, res, next) => {
  res.render('board/write', {
    title: 'post - write',
    user: req.user,
    postError: req.flash('postError'),
  });
});

module.exports = router;
