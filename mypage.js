window.addEventListener('load', function(){
    var bookmark = document.getElementById('bookmark');
    var account = document.getElementById('account');
    var business = document.getElementById('business');
    var CAI = doucment.getElementById('Change_Account_info');
    bookmark.addEventListener('click',function(){
        CAI.style.display="none";
    });
    account.addEventListener('click',function(){
        CAI.style.display="inline-block";
    });
    business.addEventListener('click', function(){
        CAI.style.display="none";
    });
});