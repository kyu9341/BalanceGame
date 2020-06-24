const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, postLike, Comment, commentLike, Vote, report } = require('../models');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const exp = require('./exp');

const router = express.Router();
const vsUpload = multer();
// 게시글 작성 기능
router.post('/write', isLoggedIn, vsUpload.any(), async (req, res, next) => {
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

        await exp.addExp(req.user.id,type=req.body.board_type);

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
                attributes: ['id', 'nickname', 'level'],
            }, {
                model: User, // 좋아요를 누른 사람들을 가져옴
                attributes: ['id', 'nickname'],
                as: 'postLiker', // include 에서 같은 모델이 여러개면 as로 구분
            },{
                model: User, // 좋아요를 누른 사람들을 가져옴
                attributes: ['id', 'nickname'],
                as: 'Voter', // include 에서 같은 모델이 여러개면 as로 구분
            },{
                model: User, // 신고를 누른 사람들을 가져옴
                attributes: ['id', 'nickname'],
                as: 'reporter', // include 에서 같은 모델이 여러개면 as로 구분
            }],
        });
        // 조회수 업데이트
        await Post.update({
            views: post.views + 1,
        },{
            where: { id },
        });

        const comments = await Comment.findAll({
           where: { postId: req.params.id },
           include: [{
              model: User,
              attributes: ['id', 'nickname', 'level'],
           }, {
            model: User, // 좋아요를 누른 사람들을 가져옴
                attributes: ['id', 'nickname'],
                as: 'commentLiker', // include 에서 같은 모델이 여러개면 as로 구분
            },],
        });
        let leftPer = Math.round((post.score_left / (post.score_left + post.score_right)) * 100);
        console.log("leftPer : " + leftPer);
        let rightPer = Math.round((post.score_right / (post.score_left + post.score_right)) * 100);
        console.log("rightPer : " + rightPer);

        res.render('board/' + req.params.type + '-detail', {
            title: 'board - ' + req.params.type,
            post: post,
            comments: comments,
            user: req.user,
            moment,
            leftPer,
            rightPer,
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 게시글 좋아요 기능
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


        const postUser = await User.findOne({where: {id: post.userId}});
        await exp.addExp(postUser.id,type="like");


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

// 게시글 좋아요 취소 기능
router.delete('/:type/:id/like', isLoggedIn, async (req, res, next) => {
    try {
        await postLike.destroy({ where: { userId: req.user.id, postId: req.params.id }});
        const likeCount = await postLike.findAndCountAll({
            where: { postId: req.params.id },
        });
        await Post.update({
            like: likeCount.count,
        },{
            where: { id: req.params.id },
        });

        const post = await Post.findOne({where : {id: req.params.id}});
        const postUser = await User.findOne({where : {id : post.userId}});
        await exp.addExp(postUser.id,type="deLike");

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

// 게시글 삭제 기능
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

// 투표 기능
router.post('/:type/:id/vote', isLoggedIn, async (req, res, next) => {
    try {
        console.log("vote : " + req.body.target);

        await Vote.create({
            postId: req.params.id,
            userId: req.user.id,
            target: req.body.target,
        }); // 현재 포스트와 Voter를 연결

        // 각 득표수 count
        const voteLeft = await Vote.count({
            where: { postId: req.params.id, target: 'left' },
        });
        const voteRight = await Vote.count({
            where: { postId: req.params.id, target: 'right' },
        });
        // 득표수 update
        await Post.update({
            score_left: voteLeft,
            score_right: voteRight
        },{
            where: { id: req.params.id },
        });

        let post = await Post.findOne({
            include: [{
                model: User, // 좋아요를 누른 사람들을 가져옴
                attributes: ['id', 'nickname'],
                as: 'Voter', // include 에서 같은 모델이 여러개면 as로 구분
            }],
            where: { id: req.params.id }
        });

        // 득표수 %로 환산
        let leftPer = Math.round((post.score_left / (post.score_left + post.score_right)) * 100);
        let rightPer = Math.round((post.score_right / (post.score_left + post.score_right)) * 100);


        res.status(200).send({
            title: 'board - ' + req.params.type,
            post: post,
            user: req.user,
            leftPer,
            rightPer,
        });
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

        await exp.addExp(req.user.id,type="comment");

        res.redirect('/post/' + req.params.type + '/' + req.params.id);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 댓글 삭제 기능
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

       await exp.addExp(req.user.id,type="deComment");

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

// 댓글 좋아요 기능
router.post('/:type/:id/like/comment/:commentId', isLoggedIn, async (req, res, next) => {
    try {
        let comment = await Comment.findOne({ where: { id: req.params.commentId }});
        await comment.addCommentLiker(req.user.id); // 현재 댓글과 Liker를 연결
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

// 댓글 좋아요 취소 기능
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

// 신고 기능
router.post('/:type/:id/report', isLoggedIn, async (req, res, next) => {
    try {
        console.log("rpttest");
        await report.create({
            postId: req.params.id,
            userId: req.user.id,
            content: req.body.content,
        })
        const reportCount = await report.count({
            where: { postId: req.params.id},
        });

        await Post.update({
            report: reportCount,
        },{
            where: { id: req.params.id },
        });

        res.redirect('/post/'+ req.params.type + '/' + req.params.id);

    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;