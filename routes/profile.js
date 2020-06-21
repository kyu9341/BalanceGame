const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

router.get('/', isLoggedIn, async(req, res, next) => {
    try {
        await res.render('/profile', {
            user:req.user,
            title: 'Profile page',
        });
        console.log("profile response");
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/edit', isLoggedIn, async(req, res, next) =>{
    try{
        await res.render('profile/edit',{
            user:req.user,
            title: 'profile edit page',

        });

        console.log("edit");
    } catch(error){
        console.error(error);
        next(error);
    }
});


router.post('/edit/submit', isLoggedIn, async (req, res, next) => {
    console.log("tomaot");
    const { nickname, password, introduce } = req.body;
    try {
        const exUser = await User.findOne({ where: { nickname }});

        if (exUser) {
            req.flash('profileEditError', '이미 존재하는 닉네임입니다.');
            return res.redirect('/profile/edit');
        }
        const hash = await bcrypt.hash(password, 12);

        await User.update({
            nickname,
            password: hash,
            introduce,
        },{
            where: {id: req.user.id},
        });
        return res.redirect('/profile/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;
