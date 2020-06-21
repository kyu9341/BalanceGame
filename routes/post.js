const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, postLike, Comment, commentLike } = require('../models');
const multer = require('multer');
const path = require('path');
const moment = require('moment');

const router = express.Router();

const vsUpload = multer();
router.post('/write', isLoggedIn, vsUpload.none(), async (req, res, next) => {
    try  {
        const post = await Post.create({
            title: req.body.title, // 제목
            content: req.body.content, // 게시글
            board_type: req.body.board_type, // 게시판 종류
            userId: req.user.id, // 작성자 아이디를 넣어준다.
            img_left: req.body.url_left,
            img_right: req.body.url_right,
            description_left: req.body.description_left,
            description_right: req.body.description_right,
        });
        res.redirect('/board/' + req.body.board_type + '/1');
    } catch (error) {
        console.error(error);
        next(error); // 에러처리 미들웨어로 넘김
    }
});

router.get('/:type/:id', async (req, res, next) => {
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
                as: 'postLiker', // include 에서 같은 모델이 여러개면 as로 구분
            },],
        });
        const comments = await Comment.findAll({
           where: { postId: req.params.id },
           include: [{
              model: User,
              attributes: ['id', 'nickname'],
           }, {
            model: User, // 좋아요를 누른 사람들을 가져옴
                attributes: ['id', 'nickname'],
                as: 'commentLiker', // include 에서 같은 모델이 여러개면 as로 구분
            }],
        });
        res.render('board/' + req.params.type + '-detail', {
            title: 'board - ' + req.params.type,
            post: post,
            comments: comments,
            user: req.user,
            moment,
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:type/:id/like', isLoggedIn, async (req, res, next) => {
    try {
        let post = await Post.findOne({ where: { id: req.params.id }});
        await post.addPostLiker(req.user.id); // 현재 포스트와 Liker를 연결
        const likeCount = await postLike.findAndCountAll({
            where: { postId: req.params.id },
        });
        console.log("likeCount1: " + likeCount.count);

        await Post.update({
            like: likeCount.count,
        },{
            where: { id: req.params.id },
        });

        console.log("likeCount2: " + likeCount.count);
        res.status(200).send({
            title: 'board - ' + req.params.type,
            post: post,
            user: req.user,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:type/:id/like', isLoggedIn, async (req, res, next) => {
    try {
        await postLike.destroy({ where: { userId: req.user.id, postId: req.params.id }});
        const likeCount = await postLike.findAndCountAll({
            where: { postId: req.params.id },
        });
        const post = await Post.update({
            like: likeCount.count,
        },{
            where: { id: req.params.id },
        });
        // const post = await Post.findOne({ where: { id: req.params.id }});
        res.status(200).send({
            title: 'board - ' + req.params.type,
            post: post,
            user: req.user,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:id/delete', isLoggedIn, async (req, res, next) => {
    try {
        await Post.destroy({
            where: { id: req.params.id, userId: req.user.id },
        });
        res.redirect('/my-posts/1');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 댓글 입력
router.post('/:type/:id/comment', isLoggedIn, async (req, res, next) => {
    try {
        await Comment.create({
            content: req.body.content,
            userId: req.user.id,
            postId: req.params.id,
        });
        let count = await Comment.count({ where: { postId: req.params.id } });
        await Post.update({
           comment_count: count,
        },{
            where: { id: req.params.id }
          },
        );
        res.redirect('/post/' + req.params.type + '/' + req.params.id);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:type/:id/comment/:commentId/delete', isLoggedIn, async (req, res, next) => {
   try {
       await Comment.destroy({
          where: { id: req.params.commentId, userId: req.user.id },
       });
       let count = await Comment.count({ where: { postId: req.params.id } });
       await Post.update({
               comment_count: count,
           },{
               where: { id: req.params.id }
           },
       );
       res.redirect('/post/'+ req.params.type + '/' + req.params.id);
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

router.post('/image', upload.single('file'), (req, res) => {
    console.log(req.body, req.file);
    res.json({ url: `/uploads/${req.file.filename}` });
});


router.post('/:type/:id/like/comment/:commentId', isLoggedIn, async (req, res, next) => {
    try {
        // let post = await Post.findOne({ where: { id: req.params.id }});
        let comment = await Comment.findOne({ where: { id: req.params.commentId }});
        await comment.addCommentLiker(req.user.id); // 현재 포스트와 Liker를 연결
        const likeCount = await commentLike.findAndCountAll({
            where: { commentId: req.params.commentId },
        });
        console.log("likeCount1: " + likeCount.count);

        await Comment.update({
            like: likeCount.count,
        },{
            where: { id: req.params.commentId },
        });

        console.log("likeCount2: " + likeCount.count);
        res.redirect('/post/'+ req.params.type + '/' + req.params.id);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:type/:id/like/comment/:commentId/delete', isLoggedIn, async (req, res, next) => {
    try {
        await commentLike.destroy({ where: { userId: req.user.id, commentId: req.params.commentId }});
        const likeCount = await commentLike.findAndCountAll({
            where: { commentId: req.params.commentId },
        });
        await Comment.update({
            like: likeCount.count,
        },{
            where: { id: req.params.commentId },
        });

        res.redirect('/post/'+ req.params.type + '/' + req.params.id);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;