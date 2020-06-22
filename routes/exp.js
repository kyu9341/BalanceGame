const {User} = require('../models');

exports.addExp = async (req, id, exp)=> {
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
    }
}

exports.lvPrint =  (req)=> {

    const exp = req.user.exp;
    console.log("tomato2"+req);
    let lv = 1;
    let next = 0;
    if(exp<100){
        lv=1;
        next = 100;
    }
    else if(exp<250){
        lv=2;
        next = 250;
    }
    else if(exp<450){
        lv=3;
        next = 450;
    }
    else if(exp<750){
        lv=4;
        next = 750;
    }
    else if(exp<1200){
        lv=5;
        next = 1200;
    }
    else{
        lv=6;
    }

    const per = Math.round(exp/next*100);

    return lvInfo = {
        level:lv,
        reqExp:next,
        exp:exp,
        per: per,
    };

}
