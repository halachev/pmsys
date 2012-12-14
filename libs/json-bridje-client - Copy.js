var JsonBridge = {
    useAuthorization : false,
    authorizationHandler : function(username, password) {
        return "";
    },

    url : '/jsonbridge/',
    execute : function(classpath, method, params, resultHandler, faultHandler) {
        var url = JsonBridge.url + classpath + '/';
        if (method != null && method != '')
            url += method;

        if (params != null) {
            $.ajax({
                url : url,
                beforeSend : function(xhr) {
                    if (JsonBridge.useAuthorization) {
                        xhr.setRequestHeader("Authorization", JsonBridge.authorizationHandler);
                    }
                },
                contentType : 'application/json',
                data : JSON.stringify(params),
                dataType : 'json',
                type : "POST",
                success : resultHandler,
                error : faultHandler
            });
        } else {
            $.ajax({
                url : url,
                beforeSend : function(xhr) {
                    if (JsonBridge.useAuthorization) {
                        xhr.setRequestHeader("Authorization", JsonBridge.authorizationHandler);
                    }
                },
                contentType : 'application/json',
                dataType : 'json',
                processData : false,
                type : "GET",
                success : resultHandler,
                error : faultHandler
            });
        }
    }
};

var app = {

    utils : {
        setAuthorizationHanlder : function(username, password) {
            return 'CouchDB ' + username + ':' + SHA256(password);
        },

        parseReply : function(reply) {
            if (reply.type == 'error') {
                return reply.message;
            } else {
                return reply.result;
            }
        }
    },

    ui : {
        loader : function() {
            return '<img src="/ajax-loader.gif" alt="Loading..." />';
        },

        avatar : function() {
            return '<img src="/user_avatar.png" />'
        },

        defaultImage : function() {

            $('html, body').animate({
                scrollTop : 120
            }, 120);

            return 'data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%3F%3E%0A%3Csvg%20width%3D%22153%22%20height%3D%22153%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%20%3Cg%3E%0A%20%20%3Ctitle%3ENo%20image%3C/title%3E%0A%20%20%3Crect%20id%3D%22externRect%22%20height%3D%22150%22%20width%3D%22150%22%20y%3D%221.5%22%20x%3D%221.500024%22%20stroke-width%3D%223%22%20stroke%3D%22%23666666%22%20fill%3D%22%23e1e1e1%22/%3E%0A%20%20%3Ctext%20transform%3D%22matrix%286.66667%2C%200%2C%200%2C%206.66667%2C%20-960.5%2C%20-1099.33%29%22%20xml%3Aspace%3D%22preserve%22%20text-anchor%3D%22middle%22%20font-family%3D%22Fantasy%22%20font-size%3D%2214%22%20id%3D%22questionMark%22%20y%3D%22181.249569%22%20x%3D%22155.549819%22%20stroke-width%3D%220%22%20stroke%3D%22%23666666%22%20fill%3D%22%23000000%22%3E%3F%3C/text%3E%0A%20%3C/g%3E%0A%3C/svg%3E';
        },

        checkBeforeEnter : function(params) {

            var error = true;

            if (!params.name)
                error = false;

            if ((params.projectId != null) && (params.projectId <= 0))
                error = false;

            if (params.userId <= 0)
                error = false;

            if (!params.descr)
                error = false;

            if (!params.timeLimit)
                error = false;

            if (!error) {
                params.errorMessage.html('<br/><p class="Canceled">All fields are requared!</p>');
            }

            return error;
        }
    },

    //control menu and other element by user id
    system : {
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

            '<li id="projects"><a href="#"><img src="menu-icons/documents.png" /><br/>Documents</a> ' +      
            '<ul class="nav-sub">' +      
            '<li  id="projects" title="add new project"><a href="#pm-projects">projects</a></li> ' +      
            '<li  id="tasks" title="add new task"><a href="#pm-tasks">tasks</a></li> ' +      
            '<li  id="bugs" title="add new bug"><a href="#pm-bugs">bugs</a></li> ' +      
            '<li  id="Reports"><a href="#pm-reports" >Reports</a></li> ' +      
            '<li  id="Planings"><a href="#pm-planning" id="planning">Planning</a></li>   ' +      
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

            var consts = new app.model.consts();

            var currUser;
            
            app.system.headerMenu();
            
            if ($.cookie('user.Id') != null) {

                app.system.headerMenu(true);
                                 
                $('#MainFrame').hide();

                $('#login').hide();
                $('#register').hide();
                

                $('#register_user').hide();
                $('#projects').show();
                $('tasks').show();

                currUser = app.system.currUser();

                if (currUser != null) {
                    if ((currUser.position == consts.admin) || ((currUser.position == consts.developer)))
                        $('#bugs').show();
                    else
                        $('#bugs').hide();

                }

                $('#logOut').show();

                $('label').mouseenter(function() {
                    $(this).find('span').show();
                });

                $('label').mouseleave(function() {
                    $(this).find('span').hide();
                });

                app.model.document_state();

                if (currUser != null) {

                    $('#Login').show();

                    $('#containerSite').html('<div id="featured" class="clearfix grid_12"><div class="grid_12 caption clearfix">'                       
                        + '<p style="color: red;">' +
                        'Now you can add employees and then organize your documents.<br/>' + 
                        'To add employees first you need to send your secret code to your employee, <br/>' + 
                        'then they can register to system with the same secret code.<br/>' + 
                        'Warning: This code is only available for your organization be careful.<br/>' + 
                        'If you have any questions please contact us.' + 
                        '</p></div></div></div>'
                        );
                                     
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

        }
    },

    //models for user
    model : {
        consts : function() {
            return {
                //users
                developer : 1,
                admin : 2,
                manager : 3,
                employee : 4,

                //documents
                project : 1,
                task : 2,
                bug : 3,
                report: 4,
                planning: 5,

                //states
                Reported : 0,
                Repaired : 1,
                Canceled : 2,
                Deferred : 3,
                Detached : 4                                             

            }
        },

        user : function() {
            return {
                username : '',
                password : '',
                email : '',
                position : '',
                positionAsText : '',
                organization : "",
                organizationAsText : '',
                secret_code : '',
                image : app.ui.avatar()
            }
        },

        setModalForm : function(_id, _IsCreateDocument) {
            
            var consts = new app.model.consts();
                   
            JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'getDocumentByID?key="' + _id + '"'], function(response) {

                var data = JSON.parse(response.result);
                var document = data.rows[0].value;
                    
                var caption = "Edit";
                if (_IsCreateDocument)
                    caption = "Copy"
                    
                //show modal form                
                $.alert(caption,
                
                    '<form name="uploadForm">' + 
                        
                    '*Name:' + 
                    '<br/>' + 
                    '<input type="text" id="docName" />' + 
                    '<br/>' + 
                  
                    '<div id="projectID" >' + 
                    'Projects:' + 
                    '<br>' + 
                    '<select id="selectedProject"></select>' + 
                    '</div>' + 

                    'Employees:' + 
                    '<br/>' + 
                    '<select id="selectedUser"></select>' + 
                    '<br/>' + 

                    'Description:' + 
                    '<br/>' + 
                    '<textarea cols="30" rows="5" id="docDescr"></textarea><br/>' + 
                    '*Time limit:' + 
                    '<br/>' + 
                    '<input type="text" id="timeLimit"/>' + 
                    '<br/>' + 

                    '<br/>' + 
                    '<img id="uploadPreview" style="width: 100px; height: 100px;"' + 
                    'src="data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%3F%3E%0A%3Csvg%20width%3D%22153%22%20height%3D%22153%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%20%3Cg%3E%0A%20%20%3Ctitle%3ENo%20image%3C/title%3E%0A%20%20%3Crect%20id%3D%22externRect%22%20height%3D%22150%22%20width%3D%22150%22%20y%3D%221.5%22%20x%3D%221.500024%22%20stroke-width%3D%223%22%20stroke%3D%22%23666666%22%20fill%3D%22%23e1e1e1%22/%3E%0A%20%20%3Ctext%20transform%3D%22matrix%286.66667%2C%200%2C%200%2C%206.66667%2C%20-960.5%2C%20-1099.33%29%22%20xml%3Aspace%3D%22preserve%22%20text-anchor%3D%22middle%22%20font-family%3D%22Fantasy%22%20font-size%3D%2214%22%20id%3D%22questionMark%22%20y%3D%22181.249569%22%20x%3D%22155.549819%22%20stroke-width%3D%220%22%20stroke%3D%22%23666666%22%20fill%3D%22%23000000%22%3E%3F%3C/text%3E%0A%20%3C/g%3E%0A%3C/svg%3E" alt="Image preview" />' + 
                    '<br/>' + 
                    '<input id="uploadImage" type="file"  />' + 

                    '<input type="button" id="btnEditDocument" value="Apply" />' + 
                    '<div id="ErrorMessage"></div>' +                     
                        
                    '</form>');
					
                //init data pickers
                $("#timeLimit").datepick({
                    showTrigger : '#calImg'
                });

                
                app.model.CboxFillUsers($('#selectedUser'), true, document.userId);

                var consts = new app.model.consts();
                if (document.type == consts.project)
                    $('#projectID').hide();
                else             
                    app.model.CboxFillProjects($('#selectedProject'), true, document.projectId);
                  
                   
                app.model.initModalForm(document, _IsCreateDocument)

            });
            
        },

        initModalForm : function(_document, _IsCreateDocument) {
                       
            var file = app.model.file();                                                   
                        
            $('#docName').val(_document.name);
            $('#docDescr').val(_document.descr);
            $('#timeLimit').val(_document.date);

            if (_document.image != '')
                document.getElementById('uploadPreview').src = _document.image;
            else {
                document.getElementById('uploadPreview').src = app.ui.defaultImage();
            }
            
            
            //handler user file
            $(':file').change(function() {

                app.model.documentFile("uploadImage", "uploadPreview", file);

            });

            $('#btnEditDocument').click(function() {
                
                var params = app.model.initParams(
                    $('#docName').val(), 
                    $('#selectedProject').val(),
                    $('#selectedUser').val(), 
                    $('#docDescr').val(), 
                    $('#timeLimit').val(), 
                    $('#ErrorMessage'));

                if (!app.ui.checkBeforeEnter(params)) return;
                    
                if (_IsCreateDocument == false)
                    app.model.updateDocument(_document._id, file);
                else
                {
                    
                    var _view = 'getNextNumber?key="' +  _document.organizationId  + '"';
                
                    JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', _view], function(data) {

                        var _data = JSON.parse(data.result); 
                    
                        var document = new app.model.document();
                    
                        if (_data.rows.length > 0)
                            document.number = _data.rows[0].value         
                        
                    
                        document.type = _document.type;
                        document.name = $('#docName').val();                    
                        document.projectId = $('#selectedProject').val();
                        document.userId = $('#selectedUser').val();
                        document.descr = $('#docDescr').val();
                        document.timelimit = $('#timeLimit').val();
                        document.image = file.data;
                        document.assignedTo = $('#selectedUser option:selected').text();
                    
                        app.model.newDocument(document, file);                    

                        $.alert('OK', 'Document was created');
                    
                    });  
                    
                }
                                           
            });  
            
        },
        
        initParams: function (_name, _project, _user, _descr, _timeLimit, _error)
        {
            var params = {

                name : _name, 
                projectId : _project,
                userId : _user,
                descr : _descr,
                timeLimit : _timeLimit, 
                errorMessage : _error
            }

            return params;
            
        },
        
        selectedCbox : function(cBoxName, _documentId) {

            cBoxName.attr('value', 2);

        },

        controlMainPanel : function(_type) {

            switch (_type) {

                case 1: {
                 
                    app.model.reloadPage("pm-projects.html");
                    break;

                }
                case 2: {
                    app.model.reloadPage("pm-tasks.html");
                    break;

                }
                case 3: {
                 
                    app.model.reloadPage("pm-bugs.html");
                    break;
                }

            }
        },

        file : function() {

            return {
                file : "",
                name : "",
                size : "",
                type : "",
                data : ""
            }
        },

        //_file is a ref value
        documentFile : function(_uploadImage, _uploadPreview, _file) {

            var oFReader = new FileReader(), rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

            if (document.getElementById(_uploadImage).files.length === 0) {
                return;
            }
            var oFile = document.getElementById(_uploadImage).files[0];

            if (!rFilter.test(oFile.type)) {
                alert("You must select a valid image file!");
                return;
            }

            oFReader.onload = function(oFREvent) {
                document.getElementById(_uploadPreview).src = oFREvent.target.result;

                _file.file = oFile;
                _file.name = oFile.name;
                _file.size = oFile.size;
                _file.type = oFile.type;
                _file.data = oFREvent.target.result

            };

            oFReader.readAsDataURL(oFile);

        },

        updateDocument : function(_docId, file) {

            JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'getDocumentByID?key="' + _docId + '"'], function(response) {

                var data = JSON.parse(response.result);
                var document = data.rows[0].value;
                
                document.type = document.type;
                document.name = $('#docName').val();                
                document.userId = $('#selectedUser').val();
                document.projectId =  $('#selectedProject').val();
                document.descr = $('#docDescr').val()
                document.timelimit = $('#timeLimit').val();

                if (file.data != '')
                    document.image = file.data;

                document.assignedTo = $('#selectedUser option:selected').text();

              
                //update document by id
                JsonBridge.execute('WDK.API.CouchDb', 'updateDocument', ['pmsystem', document._id, JSON.stringify(document)], function() {

                    $.alert('OK', 'You have successfully updated your document!');

                });

                app.model.controlMainPanel(document.type);

            });

        },
        currDate : function() {

            var fullDate = new Date();
            var currentDate = fullDate.format("mm/dd/yyyy");

            return currentDate;
        },

        document : function() {

            var currentDate = app.model.currDate();

            var currUser = new app.system.currUser();

            return {
                number: 1, 
                name : '',                
                date : currentDate,
                projectId : 0,
                userId : 0,
                organizationId : currUser.organization,
                created : currUser.username,
                descr : '',
                timelimit : '',
                image : '',
                assignedTo : '',
                type : 0,
                state : "0"
            }

        },
        
        documentEx: function () {
             
            var currentDate = app.model.currDate();
              
            return {
                
                number: 0,
                date: currentDate,
                periodDate: '',
                employee: '',
                descr: '',
                type: 0,
                documents: app.model.documentExChild()            
                
            }
        },
        
        
        documentExChild: function (){    
            
            return {
                
                employee: '', 
                project: 0, 
                descr: '',
                Monday: 0,
                Tuesday: 0,
                Wednesday : 0,
                Thursday : 0,
                Friday : 0,
                Saturday : 0,
                Sunday : 0
            }
        },
        
        ShowModalForm: function (element)
        {
                         
            //show modal form                
            $.alert("Add new document",
                
                '<form name="uploadForm">' + 
                        
                '*Name:' + 
                '<br/>' + 
                '<input type="text" id="docName" />' + 
                '<br/>' + 
                  
                '<div id="projectID" >' + 
                'Projects:' + 
                '<br>' + 
                '<select id="selectedProject"></select>' + 
                '</div>' + 

                'Employees:' + 
                '<br/>' + 
                '<select id="selectedUser"></select>' + 
                '<br/>' + 

                'Description:' + 
                '<br/>' + 
                '<textarea cols="30" rows="5" id="docDescr"></textarea><br/>' + 
                '*Time limit:' + 
                '<br/>' + 
                '<input type="text" id="timeLimit"/>' + 
                '<br/>' + 

                '<br/>' + 
                '<img id="uploadPreview" style="width: 100px; height: 100px;"' + 
                'src="data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%3F%3E%0A%3Csvg%20width%3D%22153%22%20height%3D%22153%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%20%3Cg%3E%0A%20%20%3Ctitle%3ENo%20image%3C/title%3E%0A%20%20%3Crect%20id%3D%22externRect%22%20height%3D%22150%22%20width%3D%22150%22%20y%3D%221.5%22%20x%3D%221.500024%22%20stroke-width%3D%223%22%20stroke%3D%22%23666666%22%20fill%3D%22%23e1e1e1%22/%3E%0A%20%20%3Ctext%20transform%3D%22matrix%286.66667%2C%200%2C%200%2C%206.66667%2C%20-960.5%2C%20-1099.33%29%22%20xml%3Aspace%3D%22preserve%22%20text-anchor%3D%22middle%22%20font-family%3D%22Fantasy%22%20font-size%3D%2214%22%20id%3D%22questionMark%22%20y%3D%22181.249569%22%20x%3D%22155.549819%22%20stroke-width%3D%220%22%20stroke%3D%22%23666666%22%20fill%3D%22%23000000%22%3E%3F%3C/text%3E%0A%20%3C/g%3E%0A%3C/svg%3E" alt="Image preview" />' + 
                '<br/>' + 
                '<input id="uploadImage" type="file"  />' + 

                '<input type="button" id="btnNewDocument" value="Submit" />' + 
                '<div id="ErrorMessage"></div>' +                     
                        
                '</form>');
                
            //init data pickers
            $("#timeLimit").datepick({
                showTrigger : '#calImg'
            });
                    
                   
            var consts = new app.model.consts();
            if (element._type == consts.project)
                $('#projectID').hide();
            else             
                app.model.CboxFillProjects($('#selectedProject'), false, 0);
                
               
            app.model.CboxFillUsers($('#selectedUser'), false, 0);
                
            //handler user file
            $(':file').change(function() {

                app.model.documentFile("uploadImage", "uploadPreview", element._file);

            });
                 
            document.getElementById('uploadPreview').src = app.ui.defaultImage();
            
            
            //add document
            $('#btnNewDocument').click(function() {
                                
                                             
                var params = app.model.initParams(
                    $('#docName').val(), 
                    $('#selectedProject').val(),
                    $('#selectedUser').val(), 
                    $('#docDescr').val(), 
                    $('#timeLimit').val(), 
                    $('#ErrorMessage'));

                if (!app.ui.checkBeforeEnter(params)) return;

                
                var currUser = app.system.currUser();                
                                
                var _view = 'getNextNumber?key="' +  currUser.organization  + '"';
                
                
                JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', _view], function(data) {

                    
                    var _data = JSON.parse(data.result); 
                    
                    var document = new app.model.document();

                    document.type = element._type;
                    
                    if (_data.rows.length > 0)
                        document.number = _data.rows[0].value + 1;
                                        
                
                    document.name = $('#docName').val();                
                    document.projectId = $('#selectedProject').val();
                    document.userId = $('#selectedUser').val();
                    document.descr = $('#docDescr').val();
                    document.timelimit = $('#timeLimit').val();
                    document.image = element._file.data;

                    document.assignedTo = $('#selectedUser option:selected').text();

                    app.model.newDocument(document, element._file);

                    app.model.documents($('#containerContent'), element._type);

                    $.alert('OK', 'Document was created');
                    
                });
                           
                                   
                
            });
                                
                
            $('input, textarea').focusin(function() {
                $(this).css('background', '#f5f5f5');
            });

            $('input, textarea').focusout(function() {
                $(this).css('background', '#fff');
            });
                
                
                           
        },
        
        
        ShowModalFormEx: function(_type) {
                              
            //var consts = new app.model.consts();
        
            //show modal form                
            $.alert("Add new document",
                
                '<table class="imagetable">' +                 
                '<th>From</th>' + 
                '<th>To</th>' +                 
                '<th>Description</th>' + 
                '<th>Action</th><tr>' + 
                '<form name="uploadForm">' +              
                
                '<td><input type="text" id="startDate"/></td>' +    
                '<td><input type="text" id="ednDate"/></td>' +                                  
                '<td><input type="text" id="descr"/></td>' +                               
                          
                '<td><input type="button" id="btnNewDocument" value="Submit" /></td>' + 
                '<div id="ErrorMessage"></div>' +                                             
                '</form><tr>');
                
            //init data pickers
            $("#startDate").datepick({
                showTrigger : '#calImg'
            });
            
            //init data pickers
            $("#ednDate").datepick({
                showTrigger : '#calImg'
            });
                                             
            
        },
        
        newDocument : function(document, _attachment) {
            
            JsonBridge.execute('WDK.API.CouchDb', 'createDocument', ['pmsystem', JSON.stringify(document)], function(response) {

                app.model.controlMainPanel(document.type);

            //                  var params = [
            //                    'pmsystem',
            //                    response.result.Id,
            //                    _attachment.name,
            //                    _attachment.type,
            //                    _attachment.data
            //                    ];
            //
            //
            //                    JsonBridge.execute('MailService.MailService', 'UploadFile', params, function (response) {
            //                        alert(response.result);
            //                    });

            });
        },

        documents : function(_Html, _type) {

            $('#project_loading').html(app.ui.loader);
            $('#task_loading').html(app.ui.loader);
            $('#bug_loading').html(app.ui.loader);

            var currUser = app.system.currUser();

            var _view = 'getDocumentsByOrgID?descending=true&key=["' + currUser.organization + '", ' + _type + ']';

            JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', _view], function(data) {

                var html = app.model.documentHtml(data);
                _Html.html(html);

            });

            $('#project_loading').html('');
            $('#task_loading').html("");
            $('#bug_loading').html("");

        },

        documentHtml : function(_data) {

            var data = JSON.parse(_data.result);

            var html = '<div id="featured" class="clearfix grid_12">' 
            + '<div class="grid_12 caption clearfix">' 
                

            html += 
            '<table class="imagetable"><tr>'+     
            '<th>Number</th>' + 
            '<th>Name</th>' + 
            '<th>Description</th>' + 
            '<th>Details</th>' + 
            '<th>Actions</th></tr>';
                            
            var consts = new app.model.consts();
            var currUser = app.system.currUser();

            for (var i = 0; i < data.rows.length; i++) {

                var document = data.rows[i].value;

                var actions = '';
                
                if ((currUser.position == consts.admin) || (consts.manager == currUser.position)) {

                    actions = 
                    '<p><a href=#canEditDocument data-identity=' + document._id + '><img src="menu-icons/edit.png" /></a> ' + 
                    '<a href=#canCopyDocument data-identity=' + document._id + '><img src="menu-icons/copy.png" /></a> ' + 
                    '<a href=#canDelDocument data-identity=' + document._id + '><img src="menu-icons/del.png" /></a></p>';
                    
                    
                }

                if ((document.userId == currUser._id) || (document.organizationId == currUser.organization) && (currUser.position == consts.admin) || (currUser.position == consts.manager)) {

                    var style = '';
                    var txtState = '';

                    if (document.state == consts.Reported) {
                        style = 'Reported';
                        txtState = "Reported";
                    } else if (document.state == consts.Repaired) {
                        style = 'Repaired';
                        txtState = "Repaired";
                    } else if (document.state == consts.Canceled) {
                        style = 'Canceled';
                        txtState = "Canceled";
                    } else if (document.state == consts.Deferred) {
                        style = 'Deferred';
                        txtState = "Deferred";
                    } else if (document.state == consts.Detached) {
                        style = 'Detached';
                        txtState = "Detached";
                    }

                    //                        //get all attachments for a moment we have only one ...
                    //
                    //                        for(var filename in document._attachments)
                    //                        {
                    //
                    //                            var params = ['pmsystem', document._id, filename];
                    //
                    //
                    //
                    //                            JsonBridge.execute('WDK.API.CouchDb', 'getInlineAttachment', params, function (response) {
                    //
                    //
                    //                                var bytes = response.result.ContentBytes;
                    //                                if (bytes != "")
                    //                                {
                    //
                    //
                    //                                    $('#imageurl').attr('href', "data:image/jpg;base64,"+ bytes);
                    //                                    $('#userImage').attr('src', "data:image/jpg;base64,"+ bytes);
                    //                                }
                    //
                    //
                    //                            });
                    //
                    //
                    //                        }

                    var image = "</td>";

                    if (document.image != "") {
                        image = '<br/><a href="' + document.image + '" id=imageurl target="_blank">'
                        image += '<img src="' + document.image + '" id="userImage"  width="75"/></a>'
                    }

                    html += '<tr class="' + style + '">'

                    //title with images
                    + '<td>' 
                    + 'N000' + document.number 
                    + '</td>' 
                    + '<td>' 
                    + document.name + image 
                    + '<td>' 
                    + document.descr + '</td>' 
                    + '<td >' 
                    + '<b>Time limit: ' 
                    + document.timelimit + '</b> ' 
                    + '<br/><b>Created by </b>' 
                    + document.created + '<br/>' 
                    + '<b>Reg Date: </b>' 
                    + document.date 
                    + '<br/><b>Assigned to user: </b>' 
                    + document.assignedTo + '<br/>' 
                    + '</td>' + '<td>' 
                    + '<b>' + txtState + '</b><br/>' + '<div id="document"><select id="doc_state">' 
                    + '<option value="-1">-All-</option>' 
                    + '<option value="0">Reported</option>' 
                    + '<option value="1">Repaired</option>' 
                    + '<option value="2">Canceled</option>' 
                    + '<option value="3">Deferred</option>' 
                    + '<option value="4">Detached</option>' 
                    + '</select>' + '<input type="button" class="btnState" value="Apply" disabled=disable>' 
                    + actions
                    + '<input type="hidden" class="docId" value=' 
                    + document._id + ' /></div></td></tr>'

                }
            }

            html += '</table></div></div>';
            return html;

        },

        document_state : function() {

            var selectedState;

            $("#document").live("click", function() {

                selectedState = $(this).find('select').val();

                var buttnOK = $(this).find('.btnState');

                //document id store in hidden value
                var docId = $(this).find('.docId');

                if (selectedState < 0)
                    buttnOK.attr("disabled", "disabled");
                else
                    buttnOK.removeAttr("disabled");

                buttnOK.click(function(event) {

                    event.stopImmediatePropagation();

                    JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'getDocumentByID?key="' + docId.val() + '"'], function(response) {

                        var data = JSON.parse(response.result);
                        var document = data.rows[0].value;

                        document.state = selectedState;

                        JsonBridge.execute('WDK.API.CouchDb', 'updateDocument', ['pmsystem', docId.val(), JSON.stringify(document)], function(data) {

                            //reload page
                            switch (document.type) {

                                case 1:
                                    app.model.reloadPage("pm-projects.html");
                                    break;
                                case 2:
                                    app.model.reloadPage("pm-tasks.html");
                                    break;
                                case 3:
                                    app.model.reloadPage("pm-bugs.html");
                                    break;
                                default:
                                    alert("Error", "unexpected state access");

                            }

                        });

                    });
                });

            })
        },

        CboxFillUsers : function(cBoxElement, selected, _id) {

            cBoxElement.empty();
            cBoxElement.html('<option value=0>-All-</option>');

            var currUser = new app.system.currUser();
            var _view = 'allUsersByOrganizationID?descending=true&key="' + currUser.secret_code + '"';

            JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', _view], function(response) {

                var data = JSON.parse(response.result);

                for (var i = 0; i < data.rows.length; i++) {

                    var user = data.rows[i].value;
                    
                    cBoxElement.append('<option value="' + user._id + '">' + user.username + '</option>');                                        
                          
                    // set drobbox element in edit, copy - mode
                    if (selected)
                    {         
                     
                        if (_id == user._id)                                                        
                            cBoxElement[0].selectedIndex = i + 1;
                            
                    }
                    
                }
                               
            });
    
                      
        },

        CboxFillProjects : function(element, selected, _id) {

            element.empty();            
            element.append('<option value=0>- All -</option>');
            
            var currUser = app.system.currUser();
            if (currUser == null)
                return;

            var _view = 'allProjectsByOrganizationID?descending=true&key="' + currUser.organization + '"';

            JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', _view], function(response) {

                var data = JSON.parse(response.result);
                for (var i = 0; i < data.rows.length; i++) {

                    var document = data.rows[i].value;
                    
                    element.append('<option value="' + document._id + '">' + document.name + '</option>');
                                        
                    // set drobbox element in edit, copy - mode
                    if (selected)
                    {         
                     
                        if (_id == document._id)                                                        
                            element[0].selectedIndex = i + 1;
                            
                    }
                  

                }

            });
        },

        dcoumentFilter : function() {

            return {

                docType : 0,
                container : $("#containerContent"),
                project : 0,
                userId : 0,
                state : 0,
                startDate : 0,
                endDate : 0
            }
        },

        FilterByProject : function(_filter) {


            var _view = 'GetDocumentsByProjectID?key=["' + _filter.project + '", ' + _filter.docType + ']';
            
            
            JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', _view], function(response) {

                var html = app.model.documentHtml(response);
                _filter.container.html(html);

            });
        },

        filterByUser : function(_filter) {

            var _view = "";
            
            if (_filter.state <= -1)
                _view = 'GetDocumentsByUserID?key=["' + _filter.userId + '", ' + _filter.docType + ']';
            else
                _view = 'filterByParams?key=["' + _filter.userId + '", "' + _filter.state + '", ' + _filter.docType + ']';

                
            JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', _view], function(response) {

                var html = app.model.documentHtml(response);
                _filter.container.html(html);

            });

        },

        filterByDate : function(_filter) {

            if (_filter.endDate == "")
                _filter.endDate = app.model.currDate();
             
            var _view = 'viewByDate?startkey=[' + _filter.docType + ', "' + _filter.startDate + '"]&endkey=['+_filter.docType + ', "' + _filter.endDate + '"]';
              
            JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', _view], function(response) {

                var html = app.model.documentHtml(response);
                _filter.container.html(html);

            });
        },

        FilterByStates : function(_filter) {

            var _view = "";
                   
            if (_filter.userId <= 0)
                _view = 'getDocumentsByState?key=["' + _filter.state + '", ' + _filter.docType + ']';
            else                
                _view = 'filterByParams?key=["' + _filter.userId + '", "' + _filter.state + '", ' + _filter.docType + ']';

            JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', _view], function(response) {

                var html = app.model.documentHtml(response);
                _filter.container.html(html);

            });
        },

        lastProjects : function() {


            var html = '<div id="featured" class="clearfix grid_12">' 
            + '<div class="grid_12 caption clearfix">'                 

            html += 
            '<table class="imagetable"><tr>'+     
            '<th>Name</th>' + 
            '<th>Description</th>';            
           
            JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'viewLastProjects?descending=true&limit=10'], function(response) {

                var data = JSON.parse(response.result);

                for (var i = 0; i < data.rows.length; i++) {
                    var document = data.rows[i].value;
                    html += '<tr>'
                    html += '<td>' + document.name + '</td>' 
                    html += '<td>' + document.descr + '</td>'
                    html += '</tr>'
                }

                html += '</table></div></div>'
                $('#containerSite').html(html);
            });

        },

        getCustomers : function() {
            $('#containerSite').html(app.ui.loader);
            JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'allCustomers?descending=true'], function(response) {
                var data = JSON.parse(response.result);

                var html = '<div id="featured" class="clearfix grid_12"><div class="grid_12 caption clearfix">' 
                    
                    
                html += 
                '<table class="imagetable"><tr>'+     
                '<th>Organization</th>' + 
                '<th>Email</th>' + 
                '<th>Date</th>';      
                          

                for (var i = 0; i < data.rows.length; i++) {

                    var doc = data.rows[i].value;

                    html += '<tr><td>' + doc.Organization + '</td>' + '<td>' + doc.Email + '</td>' + '<td>' + doc.Date + '</td>' + '</tr>'

                }
                html += '</table></div></div>'
                $('#containerSite').html(html);
            });

        },

        reloadPage : function(_page) {
            var url = '/ui/' + _page;
            $.get(url, function(login_data) {
                $('#containerSite').html(login_data);

            });
        },
		
        orgValidation : function(orgName) {

            var pattern = new RegExp(/^[a-zA-Z0-9 ]+$/);            
            return pattern.test(orgName);

        },
		
        userNameValidation : function(username) {

            var pattern = new RegExp(/^[a-zA-Z]+$/);            
            return pattern.test(username);

        },

        emailValidation : function(emailAddress) {

            var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
            //alert( pattern.test(emailAddress) );
            return pattern.test(emailAddress);

        },

        delDocument : function(_document, _model) {

            //delete only developer or emp
            JsonBridge.execute('WDK.API.CouchDb', 'deleteDocument', ['pmsystem', _document._id], function(data) {

                if (_model == false) {
                    app.model.documents($('#containerContent'), _document.type);
                    return;
                }
                /*
				 //can delete all projects by admin or manager id
				 var _currUser = app.system.currUser();

				 if ((_currUser.position == consts.admin) || (_currUser.position == consts.manager))
				 {

				 JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson',
				 ['pmsystem', 'documents', 'getDocumentsByOrgID?descending=true&key="' + _currUser.organization + '"'], function (response) {

				 var data = JSON.parse(response.result);

				 for (var i = 0; i < data.rows.length; i++) {

				 var document = data.rows[i].value;

				 JsonBridge.execute('WDK.API.CouchDb', 'deleteDocument', ['pmsystem', document._id], function (data) {
				 //
				 });

				 }

				 });

				 }
             */

                app.system.logOut();

            });

        }
    }
};

$.alert = function(title, msg, login, buttons) {
    var c = $('<div ></div>');
    $(document).append(c);
    c.html('<span>' + msg + '</span>');
    app.system.userById();
    c.dialog({
        autoOpen : false,
        width: "auto",
        height: "auto",
        resize: "auto",
        modal : true,
        closeOnEscape: false,
        // show : 'fadeIn',
        closeText : 'Close',        
        resizable : false,
        buttons : {
            'Close' : function() {
                
                $(this).dialog('close');
                c.remove();               
                if (login)
                    window.location.href = "index.html";
            }
        },
        title : title
    });

    if (buttons != null || buttons != undefined) {
        c.dialog('option', 'buttons', buttons);
    }
    
    c.dialog('open');
    
};

//delete user by id
$("#lastProjects").live("mouseenter", function() {
    $(this).find('.spanche').show('fast');

    $('#lastProjects').mouseleave(function() {
        $(this).find('.spanche').hide('fast');
    });

});

//delete user by id
$(".delUser").live("click", function() {
    var _id = $(this).data("identity");

    var response = confirm("are you sure to remove this profile?");
    if (response) {
        JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'getDocumentByID?key="' + _id + '"'], function(response) {

            if (response.result == "")
                return;
            var data = JSON.parse(response.result);
            var document = data.rows[0].value;

            app.model.delDocument(document, true);

        });

    }
});

//delete document by id
$("a[href=#canDelDocument]").live("click", function() {
    var _id = $(this).data("identity");
    var response = confirm("are you sure to delete this document?");
    if (response) {
        JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'getDocumentByID?key="' + _id + '"'], function(response) {

            if (response.result == "")
                return;
            var data = JSON.parse(response.result);
            var document = data.rows[0].value;

            app.model.delDocument(document, false);

        });

    }
});

$("a[href=#canEditDocument]").live("click", function() {

    var _id = $(this).data("identity");

    app.model.setModalForm(_id, false);
    app.ui.defaultImage();

});


$("a[href=#canCopyDocument]").live("click", function() {

    var _id = $(this).data("identity");

    app.model.setModalForm(_id, true);
    app.ui.defaultImage();

});


