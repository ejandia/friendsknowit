/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
    
    Parse.initialize("ApkjMsw5SD6ZhyPHCDgBv7eNrrmJeoZ8g3ozbIzy", "es1uOLYLknSdh78mOKdmLeoEWAka8sP3qjf7ZDdB");

    var currentUser = Parse.User.current();
        if (currentUser) {
            // show the signup or login page
            window.location.replace("main.html");
        }
        
    user = new Parse.User();
    
    $("#btn-signup").click(function(){
        user.set("username",$('#email').val());
        user.set("fullName",$('#fname').val());
        user.set("password", $('#passwd').val());
        
        user.set("imageUrl", "https://graph.facebook.com/meaninglabs/picture");
        
        alert (user.get("username") + user.get("password") + user.get("email") + user.get("imageUrl"));
        

        user.signUp(null, {
            success: function(user) {
                // Hooray! Let them use the app now.
                window.location.replace("main.html");
                
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
                window.location.replace("index.html");

            }
        });
        return false;
    });
});
