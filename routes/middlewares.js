exports.isLoggedIn = (req, res, next) => { // 로그인 한 사용자인지 확인
    if (req.isAuthenticated()) { // 로그인 여부
        next();
    } else {
        res.redirect('/login');
    }
};

exports.isNotLoggedIn = (req, res, next) => { // 로그인 하지 않은 사용자인지 확인
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}