$(function(){
	
	var chatApp = function(){
		
		var socket = io.connect("http://localhost:3000");
		
		socket.on("connect", function(){
			$("#login").submit(function(event){
				event.preventDefault();
				// Save username entered by user
				var user = $("input[name=user]").val();
				// Hide login
				$("#login").hide();
				// Display greeting & logout
				$(".greeting").html("Hello, <strong>" +user+ "</strong>").show();
				$(".logout").show();
				// Emit login event and pass username off to server
				socket.emit("login", user);
			});
		});
		
		// On the serverside 'updateUsers' event call an anom. function and pass in the
		// users array which store online users on the server.
		socket.on("updateUsers", function(users){
			console.log(users);
			// Clear out current online user list
			$("#online > ul").empty();
			// Loop through users array then wrap each online user in an li
			$.each(users, function(i){
				$("<li>"+ users[i] +"</li>").appendTo("#online > ul");
			});
		});
		
		// On the server
		socket.on("updateChat", function(chat){
			console.log(chat);
			$("<tr><td class='user'>"+ chat.user +":"+"</td><td class='message'>"+ chat.message +"</td></tr>").appendTo("#messages > table");
		});
		
		
		var logout = function(){
			$(".logout").click(function(){	
				$(this).hide();
				$(".greeting").hide();
				$("#login").show();
				var user = $("p.greeting > strong").text();
				$("p.greeting, #online > ul").detach();
				$("#messages > table").detach();
				socket.emit("logout", user);
			});
		};
		
		var addChat = function(){
			$("#chats").submit(function(event){
				if($("p.greeting").text()){
					event.preventDefault();
					var user = $(".greeting > strong").text();
					var message = $("input[name=chats]").val();
					$("input[name=chats]").val("");
					var chat = {
						user: user,
						message: message
					};
					// Emit the newChat event and pass off the current chat
					socket.emit("newChat", chat);
				} else {
					alert("You must pick a nickname and login before sending anything.");
					return false;
				};
			});
		};	
		addChat();
		logout();	
	};
	chatApp();
});
