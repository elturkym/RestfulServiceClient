"use strict";

(function() {
	
	var urlRoot = 'http://restfulservice.cfapps.io/';

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
		$('<h1>').text(user.name).appendTo($("#mainDiv"));
		$('<p>').text("Address: " + user.address).appendTo($("#mainDiv"));
		$('<p>').text("Email: " + user.email).appendTo($("#mainDiv"));
		getPosts(user.links[0].href);
	}

	function getPosts(postsLink) {
		var u = $("#userId").val();
		$.ajax(postsLink, {type: 'get', dataType: 'json'}).done(
				processPostsSuccess).fail(processFail);
	}

	function processPostsSuccess(posts) {
		posts.forEach(function(post) {
			var div = $('<div id=div-' + post.id + '>');

			var body = $('<p class=\'post\'>');
			body.text(post.text);

			var commentDiv = $('<div id=comments-' + post.id + '>');
			commentDiv.hide();

			var commentShowButton = $('<input class=\'comment\' id=comments-' + post.id + '-b type=\'button\' value=\'Show Comments\'>');
			commentShowButton.click(displayHideComments(post.links[0].href, post.id));
			
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
				userHead.text(obj.user.name);

				var body = $('<p>');
				body.text(obj.text);
				
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