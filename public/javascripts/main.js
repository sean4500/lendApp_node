$(function(){

	var chatApp = function(){
	
		var login = function(){
			$("#login").submit(function(event){
				event.preventDefault();
				var user = $("input[name=user]").val();
				// Pass off username to login route
				$.post("/login", {
					user : user
				}, function(data){
					if(data){
						console.log(data);
						$("#login").hide();
						$(".greeting").hide().html("Hello, <strong>" + data.user + "</strong>").show();
						$(".logout").show();
					}
				});	
			});
		};
		
		var logout = function(){
			$(".logout").click(function(){	
				$(this).hide();
				$(".greeting").hide();
				$("#login").show();
				var user = $("p.greeting > strong").text();
				$("p.greeting, #online > ul").empty();
				$.post("/logout", {
					user : user
				}, function(data){
				
				});
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
					}
					$.post("/chat", {
						chat: chat
					}, function(data){
						if(data){
							console.log(data);
						}
					});
				} else {
					alert("You must pick a nickname and login before sending anything.");
					return false;
				}
			});
		};
		
		var getChats = function(){
			if($('p.greeting').text()){
				$.get("/update", function(data){
					if(data){
						chats = data.chats;
						console.log(chats);
						$("#messages >  table").empty();
						$.each(chats, function(i){
							$("<tr><td class='user'>"+ chats[i].user +":"+"</td><td class='message'>"+ chats[i].message +"</td></tr>").appendTo("#messages > table");
						});
					}
					
				});
			}
		};
		
		var getOnline = function(){
			if($('p.greeting').text()){
				$.get("/online", function(data){
					if(data){
						var onlineUsers = data.onlineUsers;
						console.log(onlineUsers);
						$("#online > ul").empty();
						$.each(onlineUsers, function(i){
							$("<li>"+ onlineUsers[i] +"</li>").appendTo("#online > ul");
						});
					}
				});
			}
		};
		
		login();
		logout();
		addChat();
		
		setInterval(getChats, 500);
		setInterval(getOnline, 500);
	};
	chatApp();
});
