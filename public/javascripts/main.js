$(function(){

	var chatApp = function(){
	
		var login = function(){
			$("#login").submit(function(event){
				event.preventDefault();
				var user = $("input[name=user]").val();
				$.post("/login", {
					user : user
				}, function(data){
					if(data){
						$("#login").slideUp();
						$(".greeting").hide().html('Hello, <strong>' + data.user + '</strong>').fadeIn();
					}
				});	
			});
		};
		
		var addChat = function(){
			$("#chats").submit(function(event){
				event.preventDefault();
				var chat = $("input[name=chats]").val();
				$("input[name=chats]").val("");
				$.post("/chat", {
					chat: chat
				}, function(data){
					if(data){
						console.log(data);
					}
				});
			});
		};
		
		var getChats = function(){
			$.get("/update", function(data){
				if(data){
					var chats = data.messages;
					console.log(chats);
					$("#messages >  table").empty();
					$.each(chats, function(i){
						$("<tr><td>"+ chats[i] +"</td></tr>").appendTo("#messages > table");
					});
				}
				
			});
		};
		
		login();
		addChat();
		
		setInterval(getChats, 500);
	};
	chatApp();
});
