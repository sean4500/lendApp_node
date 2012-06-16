$(function(){
	// Toggles Current and Returned item list views	
	$("aside ul li").click(function(){
		if($(this).hasClass("active")){
			return false;
		} else {
			$(this).addClass("active");
			$(this).siblings("li").removeClass("active");
			if($(this).attr("id") == "past"){
				$("table.current, .current-title").hide();
				$("table.past, .past-title").fadeIn(300);
			} else {
				$("table.past, .past-title").hide();
				$("table.current, .current-title").fadeIn(300);
			};
		};
	});
	
	$("table, a.logout, h2").hide();
	
	
	// Main app 
	var Borrow = function(){
		function login(){
			$("form#login").submit(function(event){
				event.preventDefault();
				$.post("/login", {
					user : $("input[name=user]").val(),
					pass : $("input[name=password]").val()
				}, function(data){
					data = data.status;
					if(data.trim() == 'ok'){
						$("table.current, a.logout, h2.current-title").fadeIn(300);
						$("#login").fadeOut(300);
						$("header p").text("Welcome, " + $("input[name=user]").val()).fadeIn(300);
					} else {
						alert(data.status);
					};
				});
				return false;
			});
		};
		
		function logout(){
			$("a.logout").click(function(){
				$("table, header p, a.logout, h2").fadeOut(300);
				$("#login").fadeIn(300);
			});
		};
	
		function checkHeight(){
			// Get main content height
			var mainHeight = $("article").height();
			
			// Check to see if sidebar height is less than
			// the content area's height if it is make sidebar
			// height the same as the content area
			if($("article aside").height() < mainHeight){
				$("article aside").height(mainHeight + 20);
			};
		};
		
		function getCurrentItems(){
			$.get("/getCurrentItems", function(data){
				if(data){
					$("table.current tbody").empty();
					$(data.result).appendTo("table.current tbody");
					// Let tablesorter know content was changed
					$("table").trigger("update");
				};
			});
		};
		
		function getPastItems(){
			$.get("/getPastItems", function(data){
				if(data){
					$("table.past tbody").empty();
					$(data.result).appendTo("table.past tbody");
					// Let tablesorter know content was changed
					$("table").trigger("update");
				};
			});
		};
		
		function addItem(){
			var fields = "<td class='date'><input type='text' name='date' ></td><td class='item'><input type='text' name='item' ></td><td class='lent_to'><input type='text' name='lent_to' ></td><td class='return_date'><input type='text' name='return_date' ></td>";
			// Wait of button to be clicked
			$(".add-to-list").click(function(){
				// Make sure user is adding to the current list
				if($("aside ul li#past").hasClass("active")){
					alert("You can only add items to the current list");
					return false;
				};
				$("<tr>"+ fields +"<td class='btns'><a class='save' style='display: inline-block;' href='javascript:void(0)'></a><a class='edit' href='javascript:void(0)'></a></td></tr>").appendTo("table.current tbody").hide().fadeIn(300);
				
				$("a.save").click(function(){
					// Grab all td's within the current tr
					var tds = $(this).parent().siblings();
					// Grab all input's within td's
					var inputs = $(this).parent().siblings().children();
					// Loop thru each td and replace it's html with the
					// current value of each input inside of it
					$(tds).hide();
					$(tds).each(function(i){
						$(this).html($(inputs[i]).val());
					});
					$(tds).fadeIn(300);
					// Hide the save button
					$(this).hide();
					// Post updated values to php so they can
					// be updated in the db
					console.log($(this).parent().siblings());
					$.post("/addItem", {
						date        : $(this).parent().siblings("td.date").text(),
						item        : $(this).parent().siblings("td.item").text(),
						lent_to     : $(this).parent().siblings("td.lent_to").text(),
						return_date : $(this).parent().siblings("td.return_date").text()
					}, function(data){
						// Clean up data str
						data = data.status.toLowerCase().trim();
						// Make sure we get an 'ok' response from the server
						if(data == 'ok'){
							// Pull new data from db
							getCurrentItems();
							checkHeight();
							$("table.current").tablesorter();
							// Let the user know things are good
							$("<p class='notify'>").text("Item successfully saved!").prependTo("header").hide().show().animate({opacity: 1.0}, 3000).fadeOut(1000);
						} else {
							// If things aren't ok, "alert" the server error
							alert("Fail!: " + data);
						}
					});
				});
			});
		};
		
		function editItem(){
			// Bind the click event to the body as it's an unchanged element during 
			// the ajax calls in the DOM, then check to see if the target is an edit link
			$("body").click(function(e){
				if($(e.target).is("a.edit")){
					var self = $(e.target);
					// Grab the save link for the currently selected row and display it
					var save = $(self).siblings("a.save");
					$(self).hide();
					$(save).css("display", "inline-block");
					var siblings = $(self).parent().siblings("td");
					var fields = [
						"<input type='text' name='date' />",
						"<input type='text' name='item' />",
						"<input type='text' name='lent_to' />",
						"<input type='text' name='return_date' />"
					];
					$(siblings).hide();
					$(siblings).each(function(i){
						$(this).html($(fields[i]).attr("value", $(this).text()));
					});
					$(siblings).fadeIn(300);
					//console.log();
					
					$(siblings[siblings.length - 1]).append("&nbsp;<input type='checkbox' name='returned' />Returned?");
					
					$(save).click(function(){
						var returned = $("input[name=returned]").is(":checked");
						// Grab all td's within the current tr
						var tds = $(this).parent().siblings("td");
						// Grab all input's within td's
						var inputs = $(this).parent().siblings("td").children();
						$(tds).hide();
						// Loop thru each td and replace it's html with the
						// current value of each input inside of it
						$(tds).each(function(i){
							$(this).html($(inputs[i]).val());
						});
						$(tds).fadeIn(300);
						// Hide the save button
						$(this).hide();
						// Show edit button
						$(self).css("display", "inline-block");
						// Post updated values to php so they can
						// be updated in the db
						$.post("/updateItems", {
							id          : $(this).parent().siblings("input[name=id]").val(),
							date        : $(this).parent().siblings("td.date").text(),
							item        : $(this).parent().siblings("td.item").text(),
							lent_to     : $(this).parent().siblings("td.lent_to").text(),
							return_date : $(this).parent().siblings("td.return_date").text(),
							returned    : returned
						}, function(data){
							data = data.status;
							if(data.trim() == 'ok'){
								$("<p class='notify'>").text("Changes successfully saved!").prependTo("header").hide().show().animate({opacity: 1.0}, 3000).fadeOut(1000);
								//console.log(data);
								getCurrentItems();
								getPastItems();
								checkHeight();
								$("table.current").tablesorter();
							} else {
								alert("Fail: " + data);
							};
						});
					});
				 };
			});
		};
		
		function deleteItem(){
			$("body").click(function(e){
				if($(e.target).is("a.trash")){
					var self = $(e.target);
					var siblings = $(self).parent().siblings();
					var conf = confirm("You sure you want to delete this item?");
					if(conf === true){
						$(siblings).parent("tr").hide(300).remove();
						// Get current date
						var date_returned = new Date();
						// Format date
						date_returned = date_returned.format("m/dd/yy"); 
						$.post("/deleteItem", {
							id            : $(siblings[0]).val(),
							date_returned : date_returned
						}, function(data){
							data = data.status;
							if(data.trim() == "ok"){
								$("<p class='notify'>").text("Item deleted successfully!")
								.prependTo("header")
								.hide().show().animate({opacity: 1.0}, 3000).fadeOut(1000);
							} else {
								alert("Fail: " + data);
							}
						});
					};
				};
			});
		};
		
		checkHeight();
		login();
		logout();
		addItem();
		editItem();
		getCurrentItems();
		getPastItems();
		deleteItem();
		
	};
	Borrow();
	$("table.current").tablesorter();
	$("table.past").tablesorter();
});