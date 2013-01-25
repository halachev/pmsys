/* http://pmsys.org/
version 1.0
Written by Nurietin Mehmedov (01.08.2012).
Please attribute the author if you use it. */

//control menu and other element by user id
var system = {
	headerMenu : function (_isLogin) {
		
		var item =
			'<li>' +
			'<a href="#pm-howitworks" id="howitworks" title="how it works"><span class="meta"><img src="menu-icons/work.png" /><br/>How it works</span></a>' +
			'</li>  ';
		
		if (_isLogin) {
			item =
				'<li>' +
				'<a href="#pm-settings" id="settings" title="Settings"><span class="meta"><img src="menu-icons/work.png" /><br/>Settings</span></a>' +
				'</li>';
		}
		
		var headerMenu = ' <ul id="nav" class="nav-main"> ' +
			
			'<li>' +
			'<a href="index.html" id="home" title="home"><span class="meta"><img src="menu-icons/home.png" /><br/>Home</span></a>' +
			
			'</li>' +
			
			'<li id="projects"><a href="#"><img src="menu-icons/documents.png" /><br/>Documents</a> ' +
			'<ul class="nav-sub">' +
			'<li  id="projects" title="add new project"><a href="#pm-projects">projects</a></li> ' +
			'<li  id="tasks" title="add new task"><a href="#pm-tasks">tasks</a></li> ' +
			'<li  id="bugs" title="add new bug"><a href="#pm-bugs">bugs</a></li> ' +
			'</ul>' +
			'</li>' +
			
			'<li style="float: right;">' +
			'<a href="#pm-register" style="color: #839922;" id="register" title="Registration"><span class="meta"><img src="menu-icons/register.png" /><br/>Registration</span></a>' +
			'</li>' +
			
			'<li style="float: right">' +
			'<a href="#pm-login" style="color: pink;" id="login" title="Sign in"><span class="meta"><img src="menu-icons/login.png" /><br/>Sign in</span></a>' +
			'</li>   ' +
			
			item +
			
			'<li>' +
			'<a href="https://groups.google.com/forum/#!forum/pm_sys" title="see google groups" target="blank"><span class="meta"><img src="menu-icons/support.png" /><br/>Support</span></a>' +
			'</li>  ' +
			
			'<li>' +
			'<a href="#pm-logOut" id="logOut" title="logOut"><span class="meta"><img src="menu-icons/exit.png" /><br/>Log-Out</span></a>' +
			'</li>' +
			
			'</ul>';
		
		$('#headerMenu').html(headerMenu);
		
	},
	
	init : function () {
		
		var consts = new model.consts();
		system.headerMenu();
		
		if ($.cookie('user.Id') != null) {
			
			system.headerMenu(true);
			$('#MainHeader').hide();
			$('#filterbox').hide();
			$('#MainFrame').hide();
			$('#login').hide();
			$('#register').hide();
			$('#register_user').hide();
			$('#projects').show();
			$('tasks').show();
			$('#logOut').show();
			
			model.document_state();
			var currUser = system.currUser();
			
			if (currUser != null) {
				
				$('#Login').show();
				
				//load projects document by defult
				$.get('/ui/pm-filter.html', function (login_data) {
					
					$('#containerSite').html(login_data);
					
				});
				
			}
			
		} else {
			
			$('#register').show();
			$('#login').show();
			$('#register_user').show();
			$('#projects').hide();
			$('#tasks').hide();
			$('#bugs').hide();
			$('#logOut').hide();
		}
		
	},
	
	showFilter : function () {
		
		var filterbox =
			
			'<div class="filter-box">' +
			'<p style="float: left"; padding: 5px;><button type="button" id="btnShowModalForm"></button><p>' +
			'<fieldset>' +
			'<legend style="color: red;">Document filter:</legend>' +
			
			'<span id="projectFilter">' +
			'<label for="filterByProject">' +
			'<br/>' +
			' Projects <select id="filterByProject" style="width:160px;"></select> </label>' +
			'</span>' +
			
			' States ' +
			
			'<select id="filterByState" style="width:120px;">' +
			'<option value="-1">-All-</option>' +
			'<option value="0" data-image="menu-icons/reported.png">Reported</option>' +
			'<option value="1" data-image="menu-icons/Repaired.png">Repaired</option>' +
			'<option value="2" data-image="menu-icons/Canceled.png">Canceled</option>' +
			'<option value="3" data-image="menu-icons/Deferred.png">Deferred</option>' +
			'<option value="4" data-image="menu-icons/Detached.png">Detached</option>' +
			'</select>' +
			
			' Users <label for="filterByUser"><select id="filterByUser" style="width:160px;"></select> </label>' +
			
			'From<label for="DateFrom">' +
			'<input style="margin: 2px; type="text" size="10" id="DateFrom" />' +
			'</label>' +
			
			'To<label for="DateTo" >' +
			'<input style="margin: 2px; type="text" size="10" id="DateTo" />' +
			'</label>' +
			
			'<input style="margin: 10px;" type="button" id="btnFilterByDate" value="OK" />' +
			'</filedset>' +
			
			'</div>';
		
		$('#containerSite').html(filterbox);
		
		$('#projectFilter').hide();
		
		system.initUsers($('#filterByUser'));
		system.initProjects($('#filterByProject'));
		
		$("#filterByState").msDropDown();
		
	},
	
	initUsers : function (_element) {
		
		var count = localStorage.getItem("user-data-count");
		
		if (count > 0) {
			model.CboxFillUsers(_element);
			return false;
		}
		
		var currUser = new system.currUser();
		var _view = 'allUsersByOrganizationID?descending=true&key="' + currUser.secret_code + '"';
		
		JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', _view], function (response) {
			
			var data = JSON.parse(response.result);
			
			localStorage.setItem("user-data-count", data.rows.length);
			
			for (var i = 0; i < data.rows.length; i++) {
				
				var user = data.rows[i].value;
				
				localStorage.setItem("user-data-" + i, JSON.stringify(user));
				
			}
			model.CboxFillUsers(_element);
		});
		
	},
	
	initProjects : function (_element) {
		
		var count = localStorage.getItem("project-data-count");
		
		if (count > 0) {
			model.CboxFillProjects(_element);
			return false;
		}
		
		var currUser = system.currUser();
		if (currUser == null)
			return;
		
		var _view = 'allProjectsByOrganizationID?descending=true&key="' + currUser.organization + '"';
		
		JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', _view], function (response) {
			
			var data = JSON.parse(response.result);
			localStorage.setItem("project-data-count", data.rows.length);
			
			for (var i = 0; i < data.rows.length; i++) {
				
				var document = data.rows[i].value;
				
				// cookie cannot store big json data such as image
				var arr = {
					name : document.name,
					_id : document._id
				};
				
				localStorage.setItem("project-data-" + i, JSON.stringify(arr));
				
			}
			
			model.CboxFillProjects(_element);
		});
		
	},
	
	secretCode : function (secret) {
		
		if (secret == "")
			return false;
		
		//check for document created by organization
		JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'getSecretCode?key="' + secret + '"'], function (response) {
			
			if (response.result == "")
				return;
			
			var data = JSON.parse(response.result);
			
			if (data.rows == "")
				return;
			
			var document = data.rows[0].value;
			document.State = 1;
			
			// activated document (organization)
			JsonBridge.execute('WDK.API.CouchDb', 'updateDocument', ['pmsystem', document._id, JSON.stringify(document)], function (data) {
				
				// $('#containerSite').append("<h1>Organisation was successfully added!</h1>");
				
			});
			
		});
		
		return true;
		
	},
	
	CboxFillOrganisation : function () {
		
		$('#Organization').empty();
		
		JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'viewAllOrganisation?descending=true'], function (response) {
			
			var data = JSON.parse(response.result);
			
			$('#Organization').append('<option value=0>-Select-</option>');
			
			$.each(data.rows, function (index, doc) {
				
				var document = doc.value;
				
				$('#Organization').append('<option value="' + document._id + '">' + document.Organization + '</option>');
				$('#Organization').selectedIndex = 0;
				
			});
			
		});
		
	},
	
	userById : function () {
		
		JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'getDocumentByID?key="' + $.cookie('user.Id') + '"'], function (response) {
			
			var data = JSON.parse(response.result);
			var user = data.rows[0].value;
			
			if (user)
				$.cookie('currUser', response.result);
			else
				$.cookie('currUser', null);
			
		});
	},
	
	currUser : function () {
		
		if ($.cookie('currUser') != null) {
			var data = JSON.parse($.cookie('currUser'));
			var currUser = data.rows[0].value;
			
		} else
			currUser = null;
		
		return currUser;
		
	},
	
	logOut : function () {
		
		$.removeCookie('user.Id');
		$.removeCookie('currUser');
		
		var count = localStorage.getItem("user-data-count");
		for (i = 0; i < count; i++) {
			localStorage.removeItem('user-data-' + i);
		}
		
		var count = localStorage.getItem("project-data-count");
		for (i = 0; i < count; i++) {
			localStorage.removeItem('project-data-' + i);
		}
		
		localStorage.removeItem('user-data-count');
		localStorage.removeItem('project-data-count');
		
		window.location.href = "index.html";
		
	},
	
	getCustomers : function () {
		
		$('#containerSite').html(app.ui.loader);
		var customers = [];
		
		JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'allCustomers?descending=true'], function (response) {
			var data = JSON.parse(response.result);
			
			for (var i = 0; i < data.rows.length; i++) {
				
				var doc = data.rows[i].value;
				
				customers.push({
					
					Id : doc._id,
					Organization : doc.Organization,
					Date : doc.Date
				});
				
			}
			$('#containerSite').html('');
			$("#containerSite").kendoGrid({
				
				dataSource : {
					data : customers,
					pageSize : 10
				},
				
				sortable : {
					mode : "single",
					allowUnsort : false
				},
				
				pageable : true,
				scrollable : false,
				
				columns : [{
						field : "Organization",
						title : "Organization"
						
					}, {
						field : "Date",
						title : "Date"
					}
				]
			});
			
		});
		
	},
	
	lastProjects : function () {
		
		$('#containerSite').html(app.ui.loader);
		var projects = [];
		
		JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'viewLastProjects?descending=true'], function (response) {
			
			var data = JSON.parse(response.result);
			
			for (var i = 0; i < data.rows.length; i++) {
				var document = data.rows[i].value;
				
				projects.push({
					
					Id : document._id,
					documentName : document.name,
					documentDesc : document.descr
					
				});
				
			}
			$('#containerSite').html('');
			$("#containerSite").kendoGrid({
				
				dataSource : {
					data : projects,
					pageSize : 10
				},
				
				sortable : {
					mode : "single",
					allowUnsort : false
				},
				
				pageable : true,
				scrollable : false,
				
				columns : [{
						field : "documentName",
						title : "Name",
						width : 200
						
					}, {
						field : "documentDesc",
						title : "Description"
					}
				]
			});
			
		});
		
	},
	
	checkOrganizationByFaceBook : function (resp) {
		
		JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'viewByOrgName?key="' + resp.name + '"'], function (response) {
			
			var data = JSON.parse(response.result);
			
			if (data.rows == "") {
				if (resp.state)
					system.InsertOrganization(resp);
				return true;
			}
			
			var user = data.rows[0].value;
			$.alert('Error', 'The organization <b>' + user.Organization + '</b> is already in use');
			return false;
		});
		
	},
	
	checkOrganization : function (resp) {
		
		
		if ((resp.name.length <= 2) && (resp.name != "")) {
			resp.error.text('The organization should have at least 3 characters.');
			resp.button.attr("disabled", "disabled");
			return false;
			
		}
		
		if (!model.orgValidation(resp.name)) {
		
			resp.error.text('Use a valid organization name.');
			resp.button.attr("disabled", "disabled");
			return false;
		}
			
		
		JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'viewByOrgName?key="' + resp.name + '"'], function (response) {
			
			var data = JSON.parse(response.result);
			
			if (data.rows == "") {
				if (resp.state)
					system.InsertOrganization(resp);
									
				return false;
			}
			
			var user = data.rows[0].value;
			
			resp.error.html('The organization <b>' + user.Organization + '</b> is already in use');
			resp.button.attr("disabled", "disabled");
			return false;
			
		});
		
		if ((resp.email == "") || (resp.name == "")) {
			resp.error.text("Both organization and email required!");
			resp.button.attr("disabled", "disabled");
			return false;
		} else if (!model.emailValidation(resp.email)) {
			resp.error.text('Email address is not valid!');
			resp.button.attr("disabled", "disabled");
			return false;
		}
		
		resp.error.text("");
		resp.button.removeAttr("disabled");
		
	},
	
	CreateOrg : function (resp) {
		
		if (resp.type)
			system.checkOrganization(resp)
		else
			system.checkOrganizationByFaceBook(resp);
		
		return false;
		
	},
	
	InsertOrganization : function (resp) {
	
		var fromAddress = "Info@pmsys.org";
		var toAddress = resp.email;
		var subject = "PM Sys - confirm your organization!";
		
		var organization = resp.name;
		var SHA = SHA256(organization);
		
		var body = '<html><body>Dear <b>'
			 + organization + ' </b> , '
			 + 'Thank You for registration! <br/>'
			 + 'We are thrilled you have chosen PM Sys to manage your organization. <br/>'
			 + '<br/>activate your organization: http://pmsys.org/?id='
			 + SHA + '<br/>your secret code is: '
			 + SHA + '<br/><br/><a href="pmsys.org">PMsys.org</a><br/>'
			 + '<br/>PM Sys administrator © 2012 </html></body>';
		
		var params = [fromAddress, toAddress, subject, body, organization, toAddress, SHA, true];
		
		if (resp.type) {
			resp.button.attr("disabled", "disabled");
			resp.process.html(app.ui.working);
		}
		JsonBridge.execute('MailService.MailService', 'SendMail', params, function (response) {
			
			if (resp.type)
				resp.process.html('');
			
			$.alert('Alert', response.result);
		});
		
	},
	
	checkUserName : function (resp) {
		if ((resp.name.length <= 2) && (resp.name != "")) {
			resp.userError.text('The username should have at least 3 characters.');
			resp.button.attr("disabled", "disabled");
			return false;
			
		}
		
		if (!model.userNameValidation(resp.name)) {
			resp.userError.text('Use a valid username.');
			resp.button.attr("disabled", "disabled");
			return false;
		}
		
		JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'viewByName?key="' + $('#username').val() + '"'], function (response) {
			
			var data = JSON.parse(response.result);
			var user = data.rows[0].value;
			
			resp.userError.html('The username <b>' + user.username + '</b> is already in use');
			resp.button.attr("disabled", "disabled");
			
			return false;
			
		});
		
		resp.userError.text("");
		resp.button.removeAttr("disabled");
		
	},
	
	CreateUser : function (resp) {
		
		if (system.checkUserName(resp) == false)
			return false;
		
		var user = new model.user();
		user.username = resp.name;
		user.password = resp.password_first;
		user.email = resp.email;
		user.position = resp.status;
		user.positionAsText = $('#status option:selected').text();
		user.secret_code = resp.secret_code;
		
		if ((!user.username) || (!user.email) || (!user.password)) {
			resp.message.text('all fields are required');
			return false;
		} else if (user.password != resp.password_second) {
			resp.message.text('your user account password is different!');
			return false;
		} else if (user.position <= 0) {
			resp.message.text('Please select position!');
			return false;
		} else if (!model.emailValidation(user.email)) {
			resp.message.text('Email address is not valid!');
			return false;
		} else if (user.secret_code == "") {
			resp.message.text('Enter secret code!');
			return false;
		} else
			$('#UserMessage').hide();
		
		resp.process.html(app.ui.working);
		//check for valid secret code
		JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'getSecretCode?key="' + user.secret_code + '"'], function (response) {
			
			var data = JSON.parse(response.result);
			
			if (data.rows == "") {
				resp.process.html('');
				$.alert('Error', 'Invalid secret code!');
				return false;
			}
			
			var document = data.rows[0].value;
			
			if ((document.SecretCode == user.secret_code)) {
				
				user.organization = document._id;
				user.organizationAsText = document.Organization;
				//create new user account
				JsonBridge.execute('WDK.API.CouchDb', 'createDocument', ['pmsystem', JSON.stringify(user)], function (data) {
					
					$.cookie('user.Id', data.result.Id);
					$.alert('access ', user.username + ' Welcome to PM Sys', true);
					
				});
				
				//send email to user
				var fromAddress = "pmsystem.mehmedov@gmail.com";
				var toAddress = user.email;
				var subject = "administrator - welcome to PM Sys!";
				
				var body = '<html><body>Dear <b>'
					 + user.username + ' </b> , '
					 + 'Thank you <br/>'
					 + 'We are thrilled you have chosen PM Sys to manage your organization. <br/>'
					 + '<b>username:</b> '
					 + user.username + '<br/><b>password: </b>'
					 + user.password + '<br/><br/><a href="pmsys.org">PMsys.org</a><br/>'
					 + '<br/>PM Sys administrator © 2012 </html></body>';
				
				var params = [fromAddress, toAddress, subject, body, "", "", "", false];
				
				JsonBridge.execute('MailService.MailService', 'SendMail', params, function (response) {
					resp.process.html('');
				});
				
			} else {
				resp.process.html('');
				$.alert('Error', 'Invalid secret code or organization!');
				return false;
			}
			
		});
		
	},
	
	CreateOrgByFacebook : function () {
		
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
					email : resp.email,
					type : false,
					state: true
				};
				
				system.CreateOrg(data);				
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
		
	}
	
};
