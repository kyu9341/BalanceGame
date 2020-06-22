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

exports.lvPrint = async (id)=> {

    try{
        const user = await User.findOne({
            where : { id },
            attributes : ['exp'],
        });
        const exp = user.exp;

        console.log(id+exp+"exptest");
        //const exp = await
        let lv = 1;
        let next = 0;
        let imgUrl = '/images/egg.png';

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
            next = 5000;
        }

        switch(lv) {
            case 1 :
                imgUrl = '/images/egg.png';
                break;
            case 2 :
                imgUrl = '/images/breakegg.png';
                break;
            case 3 :
                imgUrl = '/images/toleft.png';
                break;
            case 4 :
                imgUrl = '/images/toright.png';
                break;
            case 5 :
                imgUrl = '/images/chicken.png';
                break;
            case 6 :
                imgUrl = '/images/chicken.png';
                break;
        }

        const per = Math.round(exp/next*100);

        console.log(imgUrl+'tomato2');
        return lvInfo = {
            level:lv,
            reqExp:next,
            exp:exp,
            per: per,
            imgUrl : imgUrl,
        };

    } catch(error) {
        console.error(error);
        next(error);
    }

}
