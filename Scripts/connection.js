		var isInitiator = false;
        var DataId = (window.location.search).split('=');//sessionId ile userId yi burdan alıcaz
		var sessionId = DataId[1].split('&')[0]+"";
		var userID = DataId[2];
		var channelCon=false;
		var chatChannelCon=false;
		function controlCon(){
		
		if(channelCon&&chatChannelCon){
			$('#Connection span:first').html('Connected!');
			$('#Connection span:last').html('Connected!');
			setTimeout(function(){ $("#overlay").remove(); }, 3000);
			
		}
		else if(chatChannelCon){
			$('#Connection span:last').css('color','green');
			$('#Connection span:last').html('Connected!');
		}
		else if(channelCon){
            $('#Connection span:first').css('color','green');
			$('#Connection span:first').html('Connected!');
		}
		
		}
	
		
		console.log("Initiator ID: "+userID);
		console.log("Session ID: "+sessionId);
		var sesUserId=sessionStorage.userId+"";
		console.log("Kendi UserID: "+sesUserId);
		if(userID === sesUserId)
			isInitiator = true;
		console.log(isInitiator);
        // data channel begin
		var channel = new DataChannel();
		channel.userid = sesUserId;
		channel.onopen = function (userid) {	
			channelCon=true;
			if(!isInitiator)
				controlCon();
			
			console.log("userid: "+userID+"baglanilan user:"+userid);
			// oyuna herhangi biri katildigi zaman caliscak
			// sadece init
		};
		channel.onmessage = function (message, userid) {

		};

		channel.onleave = function (userid) {
			console.log("userid_onleave! "+userid);
			if(userid == userID){
				console.log("ifGirdi");
				$.post("deleteGame.php",{sessionId: sessionId},function(result){console.log(result);});
			}
			//init ise oyunu bitircez
			// init degilse cikan oyuncunun topraklarini handle etcez
		};
		channel.direction = 'one-to-many';
		if(isInitiator)
			channel.open(sessionId);
		else
			channel.connect(sessionId);
		// data channel end
        /*chat code begin*/
        var chatChannel = new DataChannel();
		var chatSessionId="chat"+sessionId;
		chatChannel.onopen = function (userid) {
			chatChannelCon=true;
			if(!isInitiator)
				controlCon();
			// oyuna herhangi biri katildigi zaman caliscak
			// sadece init
		};
		chatChannel.onmessage = function (message, userid) {
			var x=message.split("-");
			chatEvent(x[0], x[1]);
		};
		chatChannel.onleave = function (userid) {
			//init ise oyunu bitircez
			// init degilse cikan oyuncunun topraklarını handle etcez
		};
		chatChannel.direction = 'many-to-many';
		if(isInitiator)
			chatChannel.open(chatSessionId);
		else
			chatChannel.connect(chatSessionId);

        function sendEvent() {
            var text = document.getElementById("chatInput").value;
            var data = username + "-" + text;
            chatChannel.send(data);
            chatEvent("Me", text);
        }
        function chatEvent(sender, text) {
                $('#chatOutput').append('<div class="line"><div class="userShow"><strong>' + sender + ':&nbsp;</strong></div><div class="messageShow"></div></div>');
                $('.messageShow').eq(count).append(document.createTextNode(text));
                count = count + 1;
            }
