$(document).ready(function () {
	
	$("a[href=#facebook-login]").live("click", function () {
		
		FB.init({
			appId : '146964155459315',
			status : true,
			cookie : true,
			oauth : true
		});
		
		var userData = null;
		
		function getUserInfo() {
			FB.api('/me', function (resp) {
				//var access_token = FB.getAuthResponse()['accessToken'];
				var data = {
					name : resp.name,
					email : resp.email
				};
				
				//system.CreateReg(data);
				//location = "http://pmsys.nh.zonebg.com/"
				userData = resp;
			});
		}
		
		FB.getLoginStatus(function (stsResp) {
			if (stsResp.authResponse) {
				getUserInfo();
			} else {
				FB.login(function (loginResp) {
					if (loginResp.authResponse) {
						getUserInfo();
					} else {
						alert('Please authorize this application to use it!');
						location = "http://pmsys.nh.zonebg.com/"
					}
				}, {
					scope : 'email'
				});
			}
		});
		
	});
});
