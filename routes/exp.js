const {User} = require('../models');

exports.addExp = async (req, res, next)=> {
    try{
        const exp = req.body.exp;
        await User.update({
            exp: req.user.exp+exp,
        },{
            where: { id: req.user.id },
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }c
}
