window.addEventListener('load', function(){
    var info = document.getElementById('info');
    var pw = document.getElementById('pw_change');
    var Myinfo = document.getElementById('infomation');
    var pw_sreen=document.getElementById('PW_Change');
    info.addEventListener('click',function(){
        pw.style.backgroundColor="white";
        info.style.backgroundColor="yellow";
        pw.style.textDecorationColor="black";
        info.style.textDecorationColor="white";
        if(Myinfo.style.display=='none'){
            Myinfo.style.display='inline-block';
            pw_sreen.style.display='none';
        }
        else{
            pw_sreen.style.display='none';
            Myinfo.style.display='none';
        }
    });

    pw.addEventListener('click',function(){
        pw.style.backgroundColor="yellow";
        info.style.backgroundColor="white";
        
        if(pw.style.display=='none'){
            Myinfo.style.display='none';
            pw_sreen.style.display='inline-block';     
        }
        else{
            Myinfo.style.display='none';
            pw_sreen.style.display='inline-block';     
         }
    });
});