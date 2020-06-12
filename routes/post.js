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

router.get('/free/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await Post.findOne({
            where: { id },
            include: [{
                model: User, // 작성자를 가져옴
                attributes: ['id', 'nickname'],
            }, {
                model: User, // 좋아요를 누른 사람들을 가져옴
                attributes: ['id', 'nickname'],
                as: 'Liker', // include 에서 같은 모델이 여러개면 as로 구분
            }],
        })
            .then((post) => {
                console.log(post);
                res.render('free-detail', {
                    title: 'board - free',
                    post: post,
                    user: req.user,
                });
            })
            .catch((error) => {
                console.error(error);
                next(error);
            });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/free/:id/like', async (req, res, next) => {
    try {
        const post = await Post.find({ where: { id: req.params.id }});
        await post.addLikers(req.params.id);
        res.send('OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/free/:id/like', async (req, res, next) => {
    try {

    } catch (error) {
        console.error(error);
        next(error);
    }
});



module.exports = router;