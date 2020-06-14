window.addEventListener('load', function(){
    var submit = document.getElementById('send');
    submit.addEventListener('click',function(){
        var name = document.getElementById('Name');
	    var pw1 = document.getElementById('PW');
	    var pw2 = document.getElementById('PWCheck');	
        var email = document.getElementById('Email');
        var namehelp = document.getElementById('NameHelp');
        var emailhelp = document.getElementById('emailHelp1');
        var pwhelp1 = document.getElementById('pwHelp1');
        var pwhelp2 = document.getElementById('pwHelp2');
        
        //이메일 정규식
    	var emaliRegExp = /^[0-9a-zA-Z][0-9a-zA-Z\_\-\.\+]+[0-9a-zA-Z]@[0-9a-zA-Z][0-9a-zA-Z\_\-]*[0-9a-zA-Z](\.[a-zA-Z]{2,6}){1,2}$/i;
    	//비밀번호 정규식 : #?!@$%^&*- 만 허용
    	var pwRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    	
        if(name.value == '' || name.value.length < 4){
            namehelp.style.display = 'inline';
            return false;
        }
        else if(name.value != '' && name.value.length > 4){
            namehelp.style.display = 'none';
            return false;
        }
        else if(email.match(emaliRegExp) == null || email =='' || email==null){
            emailhelp.style.display ='inline';
            return false;
        }
        else if(email.match(emaliRegExp) != null && email !='' || email==null){
            emailhelp.style.display ='none';
            return false;
        }

        else if(pw1.value == '' || pw1.value.length < 8 && pw1.value.length > 12){
            pwhelp.style.display ='inline';
            return false;
        }

        else if(pw1.value != '' && pw1.value.length > 8 && pw1.value.length < 12){
            pwhelp.style.display ='none';
            return false;
        }
        else if(!pw1.match(pwRegExp)){
            pwhelp1.style.display ='inline';
            return false;
        }

        else if(pw1.match(pwRegExp)){
            pwhelp1.style.display ='none';
            return false;
        }

        else if(pw1 != pw2){
            pwhelp2.style.display ='inline';
            return false;
        }

        else if(pw1 == pw2){
            pwhelp2.style.display ='none';
            return false;
        }

        else{         
            location.href("./login.html");
        }

    });
});