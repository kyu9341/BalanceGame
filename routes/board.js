const express = require('express');
const moment = require('moment');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Like, Comment } = require('../models');

router.get('/free/:page', async (req, res, next) => {
   try{
      const curPage = req.params.page;
      const pageSize = 10; // 한 페이지 당 게시글
      const pageListSize = 5; // 페이지의 갯수

      let no = ""; // limit 변수
      let totalPostCount = 0; // 전체 게시글 수

      const post = await Post.findAndCountAll({
      });
      totalPostCount = post.count;

      if (totalPostCount < 0) totalPostCount = 0;

      const totalPage = Math.ceil(totalPostCount / pageSize); // 전체 페이지 수
      const totalSet = Math.ceil(totalPage / pageListSize) // 전체 세트 수
      const curSet = Math.ceil(curPage / pageListSize); // 현재 세트 번호
      const startPage = ((curSet - 1) * pageListSize) + 1; // 현재 세트 내 출력될 시작 페이지
      let endPage = (startPage + pageListSize) - 1; // 현재 세트 내 출력될 마지막 페이지
      if (totalPage < endPage) endPage = totalPage;

      if (curPage < 0) {
         no = 0;
      } else {
         no = (curPage - 1) * 10;
      }

      const posts = await Post.findAll({
         include: [{
            model: User, // 작성자를 가져옴
            attributes: ['id', 'nickname'],
         },],
         offset: no,
         limit: pageSize,
         order: [['createdAt', 'DESC']],
      });

      res.render('board/free-board', {
         title: 'free-board',
         posts: posts,
         user: req.user,
         count: totalPostCount,
         totalPage,
         curSet,
         pageSize,
         pageListSize,
         curPage,
         totalSet,
         startPage,
         endPage,
         moment,

      });

   } catch (error) {
      console.error(error);
      next(error);
   }


});


module.exports = router;