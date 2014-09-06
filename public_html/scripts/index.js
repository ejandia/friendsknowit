/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* Loading scripts */
/* TODO: create a script loader function */

//var js = document.createElement("script");
//js.type = "text/javascript";
//js.src = jsFilePath;
//document.body.appendChild(js);


$(document).ready(function(){
    Parse.initialize("ApkjMsw5SD6ZhyPHCDgBv7eNrrmJeoZ8g3ozbIzy", "es1uOLYLknSdh78mOKdmLeoEWAka8sP3qjf7ZDdB");
    //User management
    var currentUser = Parse.User.current();
    if (currentUser) {
            // show the signup or login page
            window.location.replace("main.html");
        }
    
    
    $('#signin :button').click(function(){
        var email = $('#email').val();
        var password = $('#password').val();
        Parse.User.logIn(email, password, {
  success: function(user) {
    // Redirect to main
    window.location.replace("main.html");
    
    
  },
  error: function(user, error) {
    // The login failed. Check error to see why.
    alert("Error: " + error.code + " " + error.message);
  }
    });
    return false;
});
    $('#btn-signup').click(function(){
        //
        window.location.replace("signup.html");
        
    });
});