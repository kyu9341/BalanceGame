const express = require('express');
const moment = require('moment');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Like, Comment } = require('../models');
const paging = require('./paging');

router.get('/free/:page', async (req, res, next) => {
   try{
      const curPage = req.params.page;
      const pageSize = 10; // 한 페이지 당 게시글
      const pageListSize = 5; // 페이지의 갯수

      let offset = ""; // limit 변수
      let totalPostCount = 0; // 전체 게시글 수

      const post = await Post.findAndCountAll({
      });
      totalPostCount = post.count;

      // 페이징
      let result = paging(totalPostCount, curPage, pageSize, pageListSize, offset);

      const posts = await Post.findAll({
         include: [{
            model: User, // 작성자를 가져옴
            attributes: ['id', 'nickname'],
         },],
         offset: result.offset,
         limit: pageSize,
         order: [['createdAt', 'DESC']],
      });

      res.render('board/board', {
         title: 'free-board',
         type: '자유 게시판',
         posts: posts,
         user: req.user,
         count: totalPostCount,
         pageSize,
         pageListSize,
         curPage,
         result,
         moment,

      });

   } catch (error) {
      console.error(error);
      next(error);
   }


});


module.exports = router;