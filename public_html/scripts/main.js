/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Parse.initialize("ApkjMsw5SD6ZhyPHCDgBv7eNrrmJeoZ8g3ozbIzy", "es1uOLYLknSdh78mOKdmLeoEWAka8sP3qjf7ZDdB");

var autolinker = new Autolinker( {
		newWindow : false,
        truncate  : 200,
        className : 'referralLink'
} );

var currentUser = Parse.User.current();
if (!currentUser) {
    // show the signup or login page
    window.location.replace("index.html");
}

// 2. Create a Parse Query for Post objects

var query = new Parse.Query("Post");

query.include("user");
query.find({
    success: function(objects) {
        
        for (var i = 0; i < objects.length; i++)
        {

            //var object = objects[i];

            (function(object) {
                //do stuff with object;

                var query = new Parse.Query("Comment");
                query.equalTo("post", object);
                query.ascending("createdAt");
                query.include("user");
                query.find({
                    success: function(comments) {
                        $('#previouspost').append(insertPost(object.id, object.get("user").get("fullName"),object.get("user").get("imageUrl"), object.get('text'), comments));



                    }

                });
            })(objects[i]);
        }

    },
    error: function(error) {
        console.log("An error occured :(");
    }
});


$(document).ready(function() {

    $('body').prepend(addHeader());
    $('body').append(addFooter());

    $('#btn-post').click(function() {
        var Post = Parse.Object.extend("Post");
        var post = new Post();
        post.set('user', Parse.User.current());
        post.set('text', $("#post-message").val());
        post.save(null, {
            success: function(post) {
                alert("Post succesfully updated");
                location.reload();
                
            },
            error: function(post, error) {
                alert("Something went wrong");
            }
        });
    });

    $(document).on('click', '#btn-comment', function() {

        var Comment = Parse.Object.extend("Comment");
        var comment = new Comment();
        comment.set('user', Parse.User.current());
        var Post = Parse.Object.extend("Post");
        var post = new Post();
        var id = $(this).closest('form').attr('id');
        post.id = id;
        comment.set("post", post);
        comment.set('text', autolinker.link($(this).siblings('textarea').val()));
        alert(comment.get('text'));
        comment.save().then(
            function(comment) {
                
                    alert("Comment succesfully updated");
                
                console.log(post.id);
                Parse.Cloud.run('mailNotify', { postId: post.id }, {
  success: function(ratings) {
    console.log("Cloud guay")
  },
  error: function(error) {
      console.log("Cloud kk")
  }
});
                //notifyFriends(post.id);
                //location.reload();
                
                
            },
            function(post, error) {
                alert("Something went wrong");
            }
        );
    });
    
    
    $(document).on('click', '.referralLink', function(){	
		event.preventDefault();

		//Parse id comenta id friend url id 	   
		var Click = Parse.Object.extend("Click");
		var click = new Click();
		click.set('url',$(this).attr("href"));
		var Comment = Parse.Object.extend("Comment");
		var comment = new Comment();
		comment.id = $(this).parent().attr("id"); 
		click.set('comment', comment);
		click.set('clicker', Parse.User.current());
		
		click.save().then(function(click) {
			// the object was saved successfully
			//alert('New object created with objectId: ' + click.id);
			window.location.href = "link_process.php?id=" + click.id + "&url=" + encodeURIComponent(click.get('url'));
			//window.open('link_process.php?id=' + click.id + '&url=' + encodeURIComponent(click.get('url')), '_SELF'); 		
		}, function(error) {
			// the save failed.
			alert('Failed to create new object, with error code: ' + error.description);
		});
	});
});

function logout(){
    
    Parse.User.logOut();
    window.location.replace("index.html");
}


function insertPost(id, fullName, imageUrl, text, comments) {

    PostHTML = '<div class="media"> \n\
                <a class="pull-left" href="#"> \n\
                    <img class="media-object" src="' + imageUrl + '" alt=" "> \n\
                    </a> \n\
                    <div class="media-body"> \n\
                        <span class="badge">' + fullName + '</span> \n\
                        <h5 class="media-heading">' + text + '</h5> \n\
                        <h6>';
    
    
    PostHTML += insertComments(comments);

    PostHTML += insertCommentTextBox(id);

    PostHTML += '</h6></div></div>';

    return PostHTML;

}

function addHeader()
{
    Header = ' \n\
    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation"> \n\
 	<div class="container">  \n\
        <div class="navbar-header"> \n\
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"> \n\
            <span class="sr-only">Toggle navigation</span> \n\
            <span class="icon-bar"></span>\n\
            <span class="icon-bar"></span>\n\
            <span class="icon-bar"></span>\n\
          </button>\n\
           <a class="navbar-brand" href="main.php">FRIENDSKNOW.IT</a>\n\
        </div>\n\
        <div class="navbar-collapse collapse">\n\
           <ul class="nav navbar-nav navbar-right">\n\
		    <li><a href="invite.php">Invite a friend!</a></li>\n\
            <li><a onClick="logout()" id="logout">Log out</a></li>\n\
			<li><img class="media-object" src="' + Parse.User.current().get("imageUrl") + '"></img></li>\n\
          </ul>\n\
        </div>\n\
      </div>\n\
 </div>';
    
    return Header;
}

function addFooter()
{
    Footer = '<div class="container"> \n\
  <div class="row">\n\
   <div class="col-md-6">\n\
	<div class="thumbnail">\n\
	 <div class="caption">\n\
	  <p>Copyright &copy; 2014 Meaning Labs. All Rights Reserved.</p>\n\
	 </div>  \n\
	</div>\n\
  </div>\n\
  <div class="col-md-6">\n\
	<div class="navbar-collapse collapse">\n\
   <ul class="nav navbar-nav navbar-right">\n\
      <li><a href="aboutus.php">About us</a></li>\n\
   </ul>\n\
  </div>\n\
  </div>\n\
 </div>\n\
 </div>';
 
 return Footer;
}

function insertComments(comments) {

    CommentHTML = "";
    if (typeof comments !== 'undefined' && comments.length > 0)
    {



        for (var i = 0; i < comments.length; i++)
        {
            var comment = comments[i];
            
            CommentHTML += '<div class="panel-footer"> \n\
                            <div class="media"> \n\
                                <a class="pull-left" href="#"> \n\
                                    <img src="' + comment.get("user").get("imageUrl") + '" alt="' + comment.get("user").get("fullName") + '> \n\
                    </a></div> \n\
                    <div class="media-body"> \n\
                    <span class="badge">' + comment.get("user").get("fullName") + '</span> \n\
                    <h5 class="media-heading" id="'+ comment.id +'">' + comment.get("text") + '</h5> \n\
            </div></div>';
        }


   


    }
    return CommentHTML;
}

function insertCommentTextBox(id) {

    TextBoxHTML = '<div class="row"> \n\
                <div class="col-md-12"> \n\
                    <form class="col-md-12" id="' + id + '"> \n\
                        <textarea id="comment-message" cols="90" rows="2"></textarea> \n\
                        <br /> \n\
                        <button type="button" class="btn btn-success" id="btn-comment"> Comment!</button> \n\
                    </form>\n\
                </div> \n\
            </div>';
    return TextBoxHTML;

}

function notifyFriends(post) {
    

    //testing cloud functionality
    
   

 

    // end of testing




    /*Parse.Cloud.run('mailNotify', {commentId: commentId}, {
        success: function(result) {

            console.log(result);
        },
        error: function(error) {
        }
    });

    /* var message = {
     text: "An update in the post by " + comment.get("post").get("user").get("fullName") + " on the question: " + comment.get("post").get("text"),
     subject: "New update in your Friendsknowit conversation",
     from_email: "notifications@friendsknowit.meaninglabs.io",
     from_name: "FriendsKnowIt",
     to: []
     };
     
     */




}
