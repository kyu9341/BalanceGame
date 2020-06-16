const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Like } = require('../models');

router.get('/list/:page', async (req, res, next) => {
   try{
      const curPage = req.params.page;
      const pageSize = 10; // 한 페이지 당 게시글
      const pageListSize = 5; // 페이지의 갯수

      let no = ""; // limit 변수
      let totalPageCount = 0; // 전체 게시글 수

      const post = await Post.findAndCountAll({
      });
      totalPageCount = post.count;

      if (totalPageCount < 0) totalPageCount = 0;

      const totalPage = Math.ceil(totalPageCount / pageSize); // 전체 페이지 수
      const totalSet = Math.ceil(totalPage / pageListSize) // 전체 세트 수
      const curSet = Math.ceil(curPage / pageListSize); // 현재 세트 번호
      const startPage = ((curSet - 1) * pageListSize) + 1; // 현재 세트 내 출력될 시작 페이지
      let endPage = (startPage + pageListSize) - 1;

      if (curPage < 0) {
         no = 0;
      } else {
         no = (curPage - 1) * 10;
      }

      const posts = await Post.findAll({
         offset: no,
         limit: pageSize,
         order: 'createAt DESC',
      });

      res.render('/free-board', {
         title: 'free-board',
         posts: posts,
         user: req.user,
         count: post.count,
      });

   } catch (error) {
      console.error(error);
      next(error);
   }


});


module.exports = router;