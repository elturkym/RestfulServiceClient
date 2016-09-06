"use strict";

(function() {
	
	var urlRoot = 'http://restfulservice.cleverapps.io/';

	$(function() {
		$("#userForm").submit(getUserData);
	});

	function getUserData(event) {
		if ($("#userId").val()) {
			$.ajax(urlRoot + 'users/' + $("#userId").val(), {type: 'get', dataType: 'json'}).done(processSuccess)
					.fail(processFail);
		}
		event.preventDefault();
	}

	function processSuccess(user) {
		$("#mainDiv").empty();
		$('<h1>').text(user.Object.Name).appendTo($("#mainDiv"));
		$('<p>').text("Address: " + user.Object.Address).appendTo($("#mainDiv"));
		$('<p>').text("Email: " + user.Object.Email).appendTo($("#mainDiv"));
		getPosts(user.Links.posts);
	}

	function getPosts(postsLink) {
		var u = $("#userId").val();
		$.ajax(postsLink, {type: 'get', dataType: 'json'}).done(
				processPostsSuccess).fail(processFail);
	}

	function processPostsSuccess(posts) {
		posts.forEach(function(post) {
			var div = $('<div id=div-' + post.Object.Id + '>');

			var body = $('<p class=\'post\'>');
			body.text(post.Object.Text);

			var commentDiv = $('<div id=comments-' + post.Object.Id + '>');
			commentDiv.hide();

			var commentShowButton = $('<input class=\'comment\' id=comments-' + post.Object.Id + '-b type=\'button\' value=\'Show Comments\'>');
			commentShowButton.click(displayHideComments(post.Links.comments, post.Object.Id));
			
			div.append(body).append(commentDiv).append(commentShowButton);
			$("#mainDiv").append(div);
		});
	}

	function displayHideComments(commentsLink, postId) {
		return function() {
			var div = $('#comments-' + postId);
			if (div.is(":visible")) {
				div.empty();
				div.hide();
				$('#comments-' + postId + '-b').val('Show Comments');
			} else {
				getComments(commentsLink, postId);
			}
		};
	}

	function getComments(commentsLink, postId) {
		var u = $("#userId").val();
		$.ajax(commentsLink, {type: 'get', dataType: 'json'}).done(
				getProcessCommentsSuccessFun(postId)).fail(processFail);
	}

	function getProcessCommentsSuccessFun(postId) {
		var myFun = processCommentsSuccess.bind({}, postId);
		return myFun;
	}

	function processCommentsSuccess(postId, comments) {
		var div = $('#comments-' + postId);
		if (comments)  {
			comments.forEach(function(obj) {
		
				var cDiv = $('<div>');
				
				var userHead = $('<em>');
				userHead.text(obj.Object.User.Name);

				var body = $('<p>');
				body.text(obj.Object.Text);
				
				cDiv.append(userHead).append(body).append($('<hr>'));
				div.append(cDiv);
			});
		}	
		
		div.show();
		$('#comments-' + postId + '-b').val('Hide Comments');
	}

	function processFail() {
		alert("Can't fetch the data from server");
	}

}) ();