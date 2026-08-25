const BASE_URL = "http://localhost:8082";

// Show / Hide Password
$("#togglePassword").click(function(){

let pass=$("#password");

let icon=$(this).find("i");

if(pass.attr("type")=="password"){

pass.attr("type","text");

icon.removeClass("fa-eye");

icon.addClass("fa-eye-slash");

}
else{

pass.attr("type","password");

icon.removeClass("fa-eye-slash");

icon.addClass("fa-eye");

}

});

// Register

$("#registerForm").submit(function(e){

e.preventDefault();

let user={

fullName:$("#fullName").val().trim(),

email:$("#email").val().trim(),

mobile:$("#mobile").val().trim(),

password:$("#password").val().trim()

};

$.ajax({

url:BASE_URL+"/users/register",

type:"POST",

contentType:"application/json",

data:JSON.stringify(user),

success:function(){

alert("Registration Successful");

window.location.href="login.html";

},

error:function(xhr){

if(xhr.responseText){

alert(xhr.responseText);

}
else{

alert("Registration Failed");

}

}

});

});