const express = require('express');
const router = express.Router();
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const { Post, User, Comment } = require('../models');
const sequelize = require('sequelize');
const paging = require('./paging');
const moment = require('moment');

// 프로필 페이지
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', {title: 'profile - BalanceGame', user: null});
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
router.get('/', async (req, res, next) => {
    try {
        let limitValue = 5;
        const freePosts = await Post.findAll({
            include: [{
                model: User, // 작성자를 가져옴
                attributes: ['id', 'nickname'],
            },],
            limit: limitValue,
            // attributes: { include: [[await Comment.count({}) ], 'count'] },
            order: [['createdAt', 'DESC']],
            where: { board_type: 'free' },
        });

        const vsPosts = await Post.findAll({
            include: [{
                model: User, // 작성자를 가져옴
                attributes: ['id', 'nickname'],
            },],
            limit: limitValue,
            // attributes: { include: [[await Comment.count({}) ], 'count'] },
            order: [['createdAt', 'DESC']],
            where: { board_type: 'vs' },
        });

        const bestVsPosts = await Post.findAll({
            include: [{
                model: User, // 작성자를 가져옴
                attributes: ['id', 'nickname'],
            },],
            limit: limitValue,
            // attributes: { include: [[await Comment.count({}) ], 'count'] },
            order: [['like', 'DESC'], ['createdAt', 'DESC']],
            where: { board_type: 'vs' },
        });


        const bestFreePosts = await Post.findAll({
            include: [{
                model: User, // 작성자를 가져옴
                attributes: ['id', 'nickname'],
            },],
            limit: limitValue,
            // attributes: { include: [[await Comment.count({}) ], 'count'] },
            order: [['like', 'DESC'], ['createdAt', 'DESC']],
            where: { board_type: 'free' },
        });

        res.render('index', {
            title: 'BalanceGame',
            user: req.user,
            freePosts,
            vsPosts,
            bestFreePosts,
            bestVsPosts,
            moment,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }

});

// 로그인 페이지
router.get('/login', (req, res, next) => {
    res.render('login', {
        title: 'login - BalanceGame',
        user: req.user,
        loginError: req.flash('loginError'),
    });
});

router.get('/write', isLoggedIn, (req, res, next) => {
    res.render('board/write', {
        title: 'post - write',
        user: req.user,
        postError: req.flash('postError'),
    });
});

router.get('/search/:page', async (req, res, next) => {
    try {
        const path = '/search/';
        const searchWord = req.query.search;
        const searchWordUrl = '?search=' + searchWord;
        const curPage = req.params.page;
        const pageSize = 10; // 한 페이지 당 게시글
        const pageListSize = 5; // 페이지의 갯수
        console.log("searchWord : " + searchWord);
        let offset = ""; // limit 변수
        let totalPostCount = 0; // 전체 게시글 수

        const post = await Post.findAndCountAll({
          where: {
            title: {
              [sequelize.Op.like]: '%' + searchWord + '%'
            }
          }
        });
        totalPostCount = post.count;

        // let { totalPage, totalSet, curSet, startPage, endPage, no } = paging(totalPostCount, curPage, pageSize, pageListSize, offset);
        let result = paging(totalPostCount, curPage, pageSize, pageListSize, offset);

        const posts = await Post.findAll({
            include: [{
              model: User, // 작성자를 가져옴
              attributes: ['id', 'nickname'],
            },],
            offset: result.offset,
            limit: pageSize,
            order: [['createdAt', 'DESC']],
            where: {
                title: {
                  [sequelize.Op.like]: '%' + searchWord + '%'
                }
            }
        });
        res.render('board/board', {
            title: 'board',
            type: '검색 결과',
            posts: posts,
            user: req.user,
            count: totalPostCount,
            result,
            pageSize,
            pageListSize,
            curPage,
            moment,
            path,
            searchWordUrl,
        });


    } catch (error) {
      console.error(error);
      next(error);
    }
});

module.exports = router;
