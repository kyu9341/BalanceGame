const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();
// router.get(미들웨어1, 미들웨어2, 미들웨어3) 순서대로 진행
// POST /auth/join
// isNotLoggedIn : 로그인하지 않은 경우 진행
router.post('/sign-up', isNotLoggedIn, async (req, res, next) => {
    const { email, nickname, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email }});
        if (exUser) {
            req.flash('signUpError', '이미 가입된 이메일입니다.');
            return res.redirect('/sign-up');
        }
        const hash = await bcrypt.hash(password, 12); // salt 가 커질수록 암호화가 복잡해짐
        await User.create({
            email,
            nickname,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST /auth/login
// isNotLoggedIn : 로그인하지 않은 경우 진행
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => { // localStrategy 의 done(에러, 성공, 실패)
        if (authError) { // 에러의 경우
            console.error(authError);
            return next(authError);
        }
        if (!user) { // 실패의 경우
            req.flash('loginError', info.message); // 실패 1회성 메세지
            return res.redirect('/');
        }
        // 성공의 경우
        return req.login(user, (loginError) => { // req 의 login (passport 가 지원)
            if (loginError) { // 성공했는데 로그인 에러
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
            // req.user 에서 앞으로 사용자 정보를 찾을 수 있음 (세선에 저장됨)
        })
    })(req, res, next);
});

// GET /auth/logout
// isLoggedIn : 로그인한 경우 진행
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout(); // 로그아웃 처리
    req.session.destroy(); // req.user
    res.redirect('/');
});

module.exports = router;