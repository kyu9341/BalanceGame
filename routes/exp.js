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
        if(user.exp+exp<100)
            lv=1;
        else if(user.exp+exp<250)
            lv=2;
        else if(user.exp+exp<450)
            lv=3;
        else if(user.exp+exp<750)
            lv=4;
        else if(user.exp+exp<1200)
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
        let nextLv;
        let prsntlv;

        if(exp<100) {
            prsntlv = 0;
            nextLv = 100;
        }
        else if(exp<250) {
            prsntlv = 100;
            nextLv = 250;
        }
        else if(exp<450) {
            prsntlv = 250;
            nextLv = 450;
        }
        else if(exp<750){
            prsntlv = 450;
            nextLv = 750;
        }
        else if(exp<1200){
            prsntlv = 450;
            nextLv = 1200;
        }
        else{
            prsntlv = 0;
            nextLv = exp;
        }

        const prsntexp = exp-prsntlv;
        const forNext = nextLv-prsntlv;
        const per = Math.round(prsntexp/forNext*100);

        return lvInfo = {
            reqExp:nextLv,
            exp:exp,
            per: per,
            level : user.level,
            forNext : forNext,
            prsntlv :prsntlv,
            prsntexp : prsntexp,
        };

    } catch(error) {
        console.error(error);
        return error;
    }

}
