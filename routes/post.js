const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

const router = express.Router();

router.post('/write', isLoggedIn, async (req, res, next) => {
    try  {
        const post = await Post.create({
            title: req.body.title, // 제목
            content: req.body.content, // 게시글
            board_type: req.body.board_type, // 게시판 종류
            userId: req.user.id, // 작성자 아이디를 넣어준다.
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error); // 에러처리 미들웨어로 넘김
    }
});



module.exports = router;