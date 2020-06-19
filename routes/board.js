const express = require('express');
const moment = require('moment');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Like, Comment } = require('../models');
const paging = require('./paging');
const sequelize = require('sequelize');


router.get('/:type/:page', async (req, res, next) => {
   try{
      const board_type = req.params.type;
      const path = '/board/' + board_type + '/';
      const type = board_type === 'free' ? '자유 게시판' : 'vs 게시판';
      const curPage = req.params.page;
      const pageSize = 10; // 한 페이지 당 게시글
      const pageListSize = 5; // 페이지의 갯수
      const searchWordUrl = '';

      let offset = ""; // limit 변수
      let totalPostCount = 0; // 전체 게시글 수

      const post = await Post.findAndCountAll({
         where: { board_type }
      });
      totalPostCount = post.count;

      // 페이징
      let result = paging(totalPostCount, curPage, pageSize, pageListSize, offset);

      const posts = await Post.findAll({
         include: [{
            model: User, // 작성자를 가져옴
            attributes: ['id', 'nickname'],
         }, {
            model: Comment,
            // attributes: { include: [[ sequelize.fn('count', '*'), 'commentsCount' ]]},
            // group: 'postId',
         }],
         offset: result.offset,
         limit: pageSize,
         // attributes: { include: [[await Comment.count({}) ], 'count'] },
         order: [['createdAt', 'DESC']],
         where: { board_type },
      });
      // console.log("comment: " + posts[0].comments);
      res.render('board/board', {
         title: board_type + '-board',
         type,
         posts: posts,
         user: req.user,
         count: totalPostCount,
         pageSize,
         pageListSize,
         curPage,
         result,
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