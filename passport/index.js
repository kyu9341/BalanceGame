const local = require('./localStrategy');

const { User } = require('../models');
// TODO 캐싱 필요
module.exports = (passport) => {
    // 세션에 저장할 때 serializeUser 가 실행됨. - 유저 정보 중 아이디만 세션에 저장
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // 세션에 저장된 유저 id 를 db 에서 찾아와 완전한 유저 정보를 얻는다.
    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id }})
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local(passport);
};