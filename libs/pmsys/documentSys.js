//control menu and other element by user id
var system = {
    headerMenu: function (_isLogin){
            
        var item =  
        '<li>' +      
        '<a href="#pm-howitworks" id="howitworks" title="how it works"><span class="meta"><img src="menu-icons/work.png" /><br/>How it works</span></a>' +      
        '</li>  ';       
            
        if (_isLogin)
        {
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
        //'<li  id="Reports"><a href="#pm-reports" >Reports</a></li> ' +      
       // '<li  id="Planings"><a href="#pm-planning" id="planning">Planning</a></li>   ' +      
        '</ul>' +      
        '</li>' +      

        '<li>' +      
        '<a href="#pm-register" id="register" title="Registration"><span class="meta"><img src="menu-icons/register.png" /><br/>Registration</span></a>' +      

        '</li>' +   
		

        '<li>' +      
        '<a href="#pm-login" id="login" title="Sign in"><span class="meta"><img src="menu-icons/login.png" /><br/>Sign in</span></a>' +      
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
        
        
    init: function() {
		
        var consts = new model.consts();

        var currUser;
            
        system.headerMenu();
            
        if ($.cookie('user.Id') != null) {

            system.headerMenu(true);
			
			$('#filterbox').hide();
            $('#MainFrame').hide();
            $('#login').hide();
            $('#register').hide();
            $('#register_user').hide();
            $('#projects').show();
            $('tasks').show();
            $('#logOut').show();

            $('label').mouseenter(function() {
                $(this).find('span').show();
            });

            $('label').mouseleave(function() {
                $(this).find('span').hide();
            });

            model.document_state();			
			currUser = system.currUser();
			
            if (currUser != null) {

				$('#Login').show();
					
				var filterbox = 
				'<div class="filter-box">' + 
			
				'<fieldset>'+
				'<h2>Document filter</h2>'+
				
				'<span id="projectFilter">' + 
				'<label for="filterByProject">'+
				'<br/>'+
				'Projects<select id="filterByProject"></select> </label>' + 
				'</span>' + 
				
				'States'+

				
				'<select id="filterByState">'+
				'<option value="-1">-All-</option>'+
				'<option value="0">Reported</option>'+
				'<option value="1">Repaired</option>'+
				'<option value="2">Canceled</option>'+
				'<option value="3">Deferred</option>'+
				'<option value="4">Detached</option>'+
				'</select>'+
				
				'Users<label for="filterByUser"> <select id="filterByUser"></select> </label>'+
				
				'From<label for="DateFrom">'+
				'<input type="text" size="10" id="DateFrom" />'+
				'</label>'+
				
				'To<label for="DateTo">'+
				'<input type="text" size="10" id="DateTo" />'+
				'</label>'+
				
				'<input type="button" id="btnFilterByDate" value="OK" />'+
				'</div>	'+
				
				'</div>	'+			
				'</div>'+
				'</filedset>'+
				'</div>';

				
				$('#filter-box').html(filterbox);
				$('#projectFilter').hide();
				
				model.CboxFillProjects($('#filterByProject'));
				model.CboxFillUsers($('#filterByUser'));
										
				$.get('/ui/pm-filter.html', function(login_data) {
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

    secretCode : function(secret) {

        if (secret == "")
            return false;

        //check for document created by organization
        JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'getSecretCode?key="' + secret + '"'], function(response) {

            if (response.result == "")
                return;

            var data = JSON.parse(response.result);

            if (data.rows == "")
                return;

            var document = data.rows[0].value;
            document.State = 1;

            // activated document (organization)
            JsonBridge.execute('WDK.API.CouchDb', 'updateDocument', ['pmsystem', document._id, JSON.stringify(document)], function(data) {

                // $('#containerSite').append("<h1>Organisation was successfully added!</h1>");

            });

        });

        return true;

    },

    CboxFillOrganisation : function() {

        $('#Organization').empty();

        JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'viewAllOrganisation?descending=true'], function(response) {

            var data = JSON.parse(response.result);

            $('#Organization').append('<option value=0>-Select-</option>');

            $.each(data.rows, function(index, doc) {

                var document = doc.value;

                $('#Organization').append('<option value="' + document._id + '">' + document.Organization + '</option>');
                $('#Organization').selectedIndex = 0;

            });

        });

    },

    userById : function() {

        JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'getDocumentByID?key="' + $.cookie('user.Id') + '"'], function(response) {

            var data = JSON.parse(response.result);
            var user = data.rows[0].value;

            if (user)
                $.cookie('currUser', response.result);
            else
                $.cookie('currUser', null);

        });
    },

    currUser : function() {

        if ($.cookie('currUser') != null) {
            var data = JSON.parse($.cookie('currUser'));
            var currUser = data.rows[0].value;

        } else
            currUser = null;

        return currUser;

    },

    logOut : function() {

        $.removeCookie('user.Id');
        $.removeCookie('currUser');
        window.location.href = "index.html";

    },
    
     getCustomers : function() {
        $('#containerSite').html(app.ui.loader);
        JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'allCustomers?descending=true'], function(response) {
            var data = JSON.parse(response.result);
			var html = '';
			styles = new Array('even-row', 'odd-row');
            for (var i = 0; i < data.rows.length; i++) {

                var doc = data.rows[i].value;
				var currStyle = styles[i % 2];
				html += '<div class="pm-style-box">';
                html += '<div class='+ currStyle+'><strong>' + doc.Organization  + '</strong></div>';
				html += '<div class='+ currStyle+'>' + doc.Email  + '</div>';
				html += '<div class='+ currStyle+'>' + doc.Date  + '</div>';
				html += '</div>';

            }
           
            $('#containerSite').html(html);
        });

    },
    
      lastProjects : function() {

		$('#containerSite').html(app.ui.loader);
      
        var html = '';       
        
        JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'viewLastProjects?descending=true&limit=10'], function(response) {

            var data = JSON.parse(response.result);
			styles = new Array('even-row', 'odd-row');  
            for (var i = 0; i < data.rows.length; i++) {
                var document = data.rows[i].value;
              
				var currStyle = styles[i % 2];
				html += '<div class="pm-style-box">';
                html += '<div class='+ currStyle+'><strong>' + document.name  + '</strong></div>';
				html += '<div class='+ currStyle+'>' + document.descr  + '</div>';
				
				html += '</div>';
            }

            
            $('#containerSite').html(html);
        });

    }


};