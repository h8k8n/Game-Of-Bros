        var DataId = (window.location.search).split('=');//sessionId ile userId yi burdan alıcaz
		var arr = DataId[1].split("&");//";
		var sessionId = arr[0];
		var gameName = decodeURIComponent(arr[1]);
		var houseArray= {Stark:"bos", Arryn:"bos", Baratheon:"bos" , Greyjoy:"bos" , Lannister:"bos" , Martell:"bos" , Tully:"bos" , Tyrell:"bos" };
		var sesUserId=sessionStorage.userId+"";
		console.log("Kendi UserID: "+sesUserId);
        // data channel begin
		var channel = new DataChannel();
		channel.onopen = function (userid) {	
			console.log("userid: "+userID+"baglanilan user:"+userid);
			var y;
			for(y in houseArray){
			    console.log(houseArray[y]);
			    if(houseArray[y] != "bos")
			        channel.send("choose-"+y+"-"+houseArray[y]);
			}
			// oyuna herhangi biri katildigi zaman caliscak
			// sadece init
		};
		channel.onmessage = function (message, userid) {
		        var x=message.split("-");
		        
		        if(x[0] == "choose"){
                    if(houseArray[x[1]] == "bos"){
    				        houseArray[x[1]]=x[2];
    				        channel.send(message);
    				    }
    				    else
    				        channel.send(x[0]+'-'+x[1]+'-'+houseArray[x[1]]);
		        }
		        
		        else if(x[0] == "chat"){
		            chatEvent(x[1], x[2]);
		            channel.send(message);
		        }
		};
		
		channel.transmitRoomOnce = true;
		channel.onleave = function (userid) {
			console.log("userid_onleave! "+userid);
			//init ise oyunu bitircez
			// init degilse cikan oyuncunun topraklarini handle etcez
		};
		channel.direction = 'one-to-many';
		if(sesUserId!=='undefined')
		channel.open(sessionId);
        channel.autoCloseEntireSession = true;
		
        function sendEvent() {
            var text = document.getElementById("chatInput").value;
            var data = "chat-"+username + "-" + text;
            chatEvent(username, text);
            channel.send(data);
        }
        function chatEvent(sender, text) {
                $('#chatOutput').append('<div class="line"><div class="userShow"><strong>' + sender + ':&nbsp;</strong></div><div class="messageShow"></div></div>');
                $('.messageShow').eq(count).append(document.createTextNode(text));
                count = count + 1;
            }
