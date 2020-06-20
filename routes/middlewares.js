exports.isLoggedIn = (req, res, next) => { // req, res, next 가 있으면 미들웨어
    if (req.isAuthenticated()) { // 로그인 여부
        next();
    } else {
        res.redirect('/login');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}