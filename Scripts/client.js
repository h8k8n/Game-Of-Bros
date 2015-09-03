        var DataId = (window.location.search).split('=');//sessionId ile userId yi burdan alıcaz
		var sessionId = DataId[1]+"";
        var myHouse="";
        var sesUserId=sessionStorage.userId+"";
		console.log("Kendi UserID: "+sesUserId);
        // data channel begin
		var channel = new DataChannel();
		channel.onopen = function (userid) {
            $('#Connection span:first').css('color','green');
			$('#Connection span:first').html('Connected!');
			setInterval(function(){ $('#overlay').remove();},500);
			// oyuna herhangi biri katildigi zaman caliscak
			// sadece init
		};
		channel.onclose=function(){
		    alert("Connection Lost! Redirecting to MainPage.");
		    window.location.href = "index.html";
		};
		channel.onmessage = function (message, userid) {
		    var x=message.split("-");
		    
		    if(x[0] == "choose"){
				    if(waiting == x[1]){
				        if(sesUserId == x[2]){
				            $('.' + waiting).unbind("click");
				            myHouse=waiting;
				            $("#waiting").css("display", "none");
				            $("#beforeStart").css("display","none");
				        }
				        else{
				            $('#' + x[1]).children().unbind("click");
				            $('#' + x[1]).css("opacity","0.5");
				            $("#waiting").css("display", "none");
				            $(".chooserElement").css("display", "block");
				        }
				    }
				    else{
				        $('#' + x[1]).css("opacity","0.5");
				        $('#' + x[1]).children().unbind("click");
				    } 
		    }
		    else if(x[0] == "chat"){
		        chatEvent(x[1], x[2]);
		    }
		    else if(x[0] =="updateMap"){
		        (function () {
		            var obj=JSON.parse(x[1]);
                    for(var key in obj){
                    $('#'+key).attr('class',obj[key]);
                    $('.'+obj[key]).mouseover();
                    $('.'+obj[key]).mouseout();
                    }
                })();
		    }
		};

		channel.onleave = function (userid) {
			console.log("userid_onleave! "+userid);
			//init ise oyunu bitircez
			// init degilse cikan oyuncunun topraklarini handle etcez
		};
		
		channel.connect(sessionId);

        function sendEvent() {
            var text = document.getElementById("chatInput").value;
            var data = "chat-"+username + "-" + text;
            channel.send(data);
        }
        
        function chatEvent(sender, text) {
                $('#chatOutput').append('<div class="line"><div class="userShow"><strong>' + sender + ':&nbsp;</strong></div><div class="messageShow"></div></div>');
                $('.messageShow').eq(count).append(document.createTextNode(text));
                count = count + 1;
            }
