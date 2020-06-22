const {User} = require('../models');

exports.addExp = async (id, type)=> {

    try{
        let exp;
        switch(type){
            case "vs":
                exp = 30;
                break;
            case "free":
                exp = 20;
                break;
            case "like":
                exp = 5;
                break;
            case "comment" :
                exp = 5;
                break;
            case "deLike" :
                exp = -5;
                break;
            case "deComment" :
                exp = -5;
                break;
        }

        console.log(id+type+"expup")
        const user = await User.findOne({where : { id }});

        let lv;
        if(user.exp<100)
            lv=1;
        else if(user.exp<250)
            lv=2;
        else if(user.exp<450)
            lv=3;
        else if(user.exp<750)
            lv=4;
        else if(user.exp<1200)
            lv=5;
        else
            lv=6;


        await User.update({
            exp: user.exp+exp,
            level : lv,
        },{
            where: { id },
        });
    }
    catch (error) {
        console.error(error);
        return error;
    }
}

exports.lvPrint = async (id)=> {

    try{
        const user = await User.findOne({
            where : { id },
        });
        const exp = user.exp;

        console.log(id+exp+"exptest");
        //const exp = await
        let next = 0;

        if(exp<100)
            next = 100;
        else if(exp<250)
            next = 250;
        else if(exp<450)
            next = 450;
        else if(exp<750)
            next = 750;
        else if(exp<1200)
            next = 1200;
        else
            next = 5000;


        const per = Math.round(exp/next*100);

        return lvInfo = {
            reqExp:next,
            exp:exp,
            per: per,
            level : user.level,
        };

    } catch(error) {
        console.error(error);
        return error;
    }

}
