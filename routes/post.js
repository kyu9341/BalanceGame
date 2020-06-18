const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Like, Comment } = require('../models');
const multer = require('multer');
const path = require('path');

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
        const post = await Post.findOne({
            where: { id },
            include: [{
                model: User, // 작성자를 가져옴
                attributes: ['id', 'nickname'],
            }, {
                model: User, // 좋아요를 누른 사람들을 가져옴
                attributes: ['id', 'nickname'],
                as: 'Liker', // include 에서 같은 모델이 여러개면 as로 구분
            },],
        });
        const comments = await Comment.findAll({
           where: { postId: req.params.id },
           include: {
              model: User,
              attributes: ['id', 'nickname'],
           } ,
        });
        res.render('board/free-detail', {
            title: 'board - free',
            post: post,
            comments: comments,
            user: req.user,
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/free/:id/like', async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id }});
        await post.addLiker(req.user.id); // 현재 포스트와 Liker를 연결
        const likeCount = await Like.findAndCountAll({
            where: { postId: req.params.id },
        });
        await Post.update({
            like: likeCount.count,
        },{
            where: { id: req.params.id },
        });

        console.log("likeCount: " + likeCount.count);
        res.status(200).send({
            title: 'board - free',
            post: post,
            user: req.user,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/free/:id/like', async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id }});
        await Like.destroy({ where: { userId: req.user.id, postId: req.params.id }});
        res.status(200).send({
            title: 'board - free',
            post: post,
            user: req.user,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});



router.get('/free/:id/comment', async (req, res, next) => {
    try {
        const comments = await Comment.findAll({
            include: [{
                model: Post,
                where: { id: req.params.id },
            }, {
                model: User,
                attributes: ['id', 'nickname'],
            }],
        });
        res.json(comments);
    } catch (error) {
        console.error(error);
        next(error);
    }
});


router.post('/free/:id/comment', async (req, res, next) => {
    try {
        await Comment.create({
            content: req.body.content,
            userId: req.user.id,
            postId: req.params.id,
        });
        res.redirect('/post/free/' + req.params.id);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.patch('/free/:id/comment', async (req, res, next) => {
   try {
       await Comment.update({
          content: req.body.content,
          where: { postId: req.params.id, userId: req.user.id },
       });
       res.redirect('/free/:id');
   } catch (error) {
        console.error(error);
        next(error);
   }
});

router.delete('/free/:id/comment', async (req, res, next) => {
   try {
       await Comment.destroy({
          where: { postId: req.params.id, userId: req.user.id },
       });
       res.redirect('/free/:id');
   } catch (error) {
       console.error(error);
       next(error);
   }
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'public/uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    limit: { fileSize: 20 * 1024 * 1024 },
})

router.post('/free/image', upload.single('file'), (req, res) => {
    console.log(req.body, req.file);
    res.json({ url: `/uploads/${req.file.filename}` });
});



module.exports = router;