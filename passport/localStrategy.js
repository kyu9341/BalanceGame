const LocalStrategy = require('passport-local').Strategy; // 설치했던 passport-local 사용
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
    // urlencoded 미들웨어가 해석한 req.body의 값들을 usernameField, passwordField 에 연결한다.
    passport.use(new LocalStrategy({
        usernameField: 'email', // req.body.email
        passwordField: 'password', // req.body.password
    }, async (email, password, done) => { // done(에러, 성공, 실패)
        try {
            const exUser = await User.findOne({ where: { email }});
            if (exUser) {
                // 비밀번호 검사
                const result = await bcrypt.compare(password, exUser.password);
                if (result) { // 비밀번호가 일치하는 경우
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' })
            }
        } catch (error) {
            console.log(error);
            done(error);
        }
        /*
            done(서버에러)
            done(null, 사용자 정보)
            done(null, false, 실패 정보)
         */
    }));
};