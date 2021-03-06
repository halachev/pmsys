/* http://pmsys.org/
   version 1.0
   Written by Nurietin Mehmedov (01.08.2012).  
   Please attribute the author if you use it. */

//models for user
var model = {
	
	consts : function () {
		return {
			//users
			developer : 1,
			admin : 2,
			
			//documents
			project : 1,
			task : 2,
			bug : 3,
			report : 4,
			planning : 5,
			
			//states
			Reported : 0,
			Repaired : 1,
			Canceled : 2,
			Deferred : 3,
			Detached : 4
			
		}
	},
	
	user : function () {
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
	
	setModalForm : function (_id, _IsCreateDocument) {
		
		var consts = new model.consts();
		
		JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'getDocumentByID?key="' + _id + '"'], function (response) {
			
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
						'<input type="text" class="dialog_input_text" id="docName" />' +
						'<br/>' +
						
						'<div id="projectID" >' +
						'Projects:' +
						'<br>' +
						'<select id="selectedProject" style="width:250px;"></select>' +
						'</div>' +
						
						'Assigned to:' +
						'<br/>' +
						'<select id="selectedUser" style="width:250px;"></select>' +
						'<br/>' +
						
						'Description:' +
						'<br/>' +
						'<textarea class="dialog_message" cols="30" rows="3" id="docDescr"></textarea><br/>' +
						'*Time limit:' +
						'<br/>' +
						'<input type="text" class="dialog_input_text" id="timeLimit"/>' +
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
			
			model.CboxFillUsers($('#selectedUser'), true, document.userId);
			
			var consts = new model.consts();
			if (document.type == consts.project)
				$('#projectID').hide();
			else
				model.CboxFillProjects($('#selectedProject'), true, document.projectId);
			
			model.initModalForm(document, _IsCreateDocument)
			
		});
		
	},
	
	initModalForm : function (_document, _IsCreateDocument) {
		
		var file = model.file();
		
		$('#docName').val(_document.name);
		$('#docDescr').val(_document.descr);
		$('#timeLimit').val(_document.date);
		
		if (_document.image != '')
			document.getElementById('uploadPreview').src = _document.image;
		else {
			document.getElementById('uploadPreview').src = app.ui.defaultImage();
		}
		
		//handler user file
		$(':file').change(function () {
			
			model.documentFile("uploadImage", "uploadPreview", file);
			
		});
		
		$('#btnEditDocument').click(function () {
			
			var params = model.initParams(
					$('#docName').val(),
					$('#selectedProject').val(),
					$('#selectedUser').val(),
					$('#docDescr').val(),
					$('#timeLimit').val(),
					$('#ErrorMessage'));
			
			if (!app.ui.checkBeforeEnter(params))
				return;
			
			if (_IsCreateDocument == false)
				model.updateDocument(_document._id, file);
			else {
				var document = new model.document();
				
				document.type = _document.type;
				document.name = $('#docName').val();
				document.projectId = $('#selectedProject').val();
				document.userId = $('#selectedUser').val();
				document.descr = $('#docDescr').val();
				document.timelimit = $('#timeLimit').val();
				document.image = file.data;
				document.assignedTo = $('#selectedUser option:selected').text();
				model.newDocument(document, file);
				$.alert('OK', 'Document was created');				
			    model.refreshDocuments(document);
				
			}
			
		});
		
	},
	
	initParams : function (_name, _project, _user, _descr, _timeLimit, _error) {
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
	
	selectedCbox : function (cBoxName, _documentId) {
		
		cBoxName.attr('value', 2);
		
	},
	
	file : function () {
		
		return {
			file : "",
			name : "",
			size : "",
			type : "",
			data : ""
		}
	},
	
	//_file is a ref value
	documentFile : function (_uploadImage, _uploadPreview, _file) {
		
		var oFReader = new FileReader(),
		rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
		
		if (document.getElementById(_uploadImage).files.length === 0) {
			return;
		}
		var oFile = document.getElementById(_uploadImage).files[0];
		
		if (!rFilter.test(oFile.type)) {
			alert("You must select a valid image file!");
			return;
		}
		
		oFReader.onload = function (oFREvent) {
			document.getElementById(_uploadPreview).src = oFREvent.target.result;
			
			_file.file = oFile;
			_file.name = oFile.name;
			_file.size = oFile.size;
			_file.type = oFile.type;
			_file.data = oFREvent.target.result
				
		};
		
		oFReader.readAsDataURL(oFile);
		
	},
	
	updateDocument : function (_docId, file) {
		
		JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'getDocumentByID?key="' + _docId + '"'], function (response) {
			
			var data = JSON.parse(response.result);
			var document = data.rows[0].value;
			
			document.type = document.type;
			document.name = $('#docName').val();
			document.userId = $('#selectedUser').val();
			document.projectId = $('#selectedProject').val();
			document.descr = $('#docDescr').val()
				document.timelimit = $('#timeLimit').val();
			
			if (file.data != '')
				document.image = file.data;
			
			document.assignedTo = $('#selectedUser option:selected').text();
			
			//update document by id
			JsonBridge.execute('WDK.API.CouchDb', 'updateDocument', ['pmsystem', _docId, JSON.stringify(document)], function () {
				
				$.alert('OK', 'You have successfully updated your document!');
				
			});
			
			model.refreshDocuments(document);
			
		});
		
	},
	
	currDate : function () {
		
		var fullDate = new Date();
		var currentDate = fullDate.format("mm/dd/yyyy");
		
		return currentDate;
	},
	
	document : function () {
		
		var currentDate = model.currDate();
		
		var currUser = new system.currUser();
		
		return {
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
	
	ShowModalForm : function (element) {
		
		//show modal form
		$.alert("Add new document",
			
			'<form name="uploadForm">' +
			
			'*Name:' +
			'<br/>' +
			'<input type="text" class="dialog_input_text" id="docName" />' +
			'<br/>' +
			
			'<div id="projectID" >' +
			'Projects:' +
			'<br>' +
			'<select id="selectedProject" style="width:250px;"></select>' +
			'</div>' +
			
			'Assigned to:' +
			'<br/>' +
			'<select id="selectedUser" style="width:250px;"></select>' +
			'<br/>' +
			
			'Description:' +
			'<br/>' +
			'<textarea class="dialog_message" cols="30" rows="3" id="docDescr"></textarea><br/>' +
			'*Time limit:' +
			'<br/>' +
			'<input type="text" class="dialog_input_text" id="timeLimit"/>' +
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
		
		var consts = new model.consts();
		if (element._type == consts.project)
			$('#projectID').hide();
		else
			model.CboxFillProjects($('#selectedProject'), false, 0);
		
		model.CboxFillUsers($('#selectedUser'), false, 0);
		
		
		//handler user file
		$(':file').change(function () {
			
			model.documentFile("uploadImage", "uploadPreview", element._file);
			
		});
		
		document.getElementById('uploadPreview').src = app.ui.defaultImage();
		
		
		
		//add document
		$('#btnNewDocument').click(function () {
			
			var params = model.initParams(
					$('#docName').val(),
					$('#selectedProject').val(),
					$('#selectedUser').val(),
					$('#docDescr').val(),
					$('#timeLimit').val(),
					$('#ErrorMessage'));
			
			if (!app.ui.checkBeforeEnter(params))
				return;
			
			var currUser = system.currUser();
			
			var document = new model.document();
			
			document.type = element._type;
			document.name = $('#docName').val();
			document.projectId = $('#selectedProject').val();
			document.userId = $('#selectedUser').val();
			document.descr = $('#docDescr').val();
			document.timelimit = $('#timeLimit').val();
			document.image = element._file.data;
			document.assignedTo = $('#selectedUser option:selected').text();
			model.newDocument(document, element._file);
			
			$.alert('OK', 'Document was created');
			
			model.refreshDocuments(document);
			
		});
		
	},
	
	newDocument : function (document, _attachment) {
		
		JsonBridge.execute('WDK.API.CouchDb', 'createDocument', ['pmsystem', JSON.stringify(document)], function (response) {
			
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
	
	documents : function (_view) {

		var documentsData = [];		
		var currUser = system.currUser();
		var consts = new model.consts();
		$('#process_loading').html(app.ui.loader);
		JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', _view], function (data) {
			
			var userData = JSON.parse(data.result);
			
			for (var i = 0; i < userData.rows.length; i++) {
			
				var document = userData.rows[i].value;		
				 
				var actions = '';
				
				if (currUser.position == consts.admin) {
					
					actions =
						'<div style="padding: 10px;">' +
						'<a href=#canEditDocument data-identity=' + document._id + ' title="Edit"><img src="menu-icons/edit.png" /></a> ' +
						'<a href=#canCopyDocument data-identity=' + document._id + ' title="Copy"><img src="menu-icons/copy.png" /></a> ' +
						'<a href=#canDelDocument data-identity=' + document._id + ' title="Delete"><img src="menu-icons/del.png" /></a>' +
						'</div>';				
				}
				
				if ((document.userId == currUser._id)
					 || (document.organizationId == currUser.organization)
					 && (currUser.position == consts.admin)) 
				{
					
					var txtState = '';
					var status = '';
					
					if (document.state == consts.Reported) {
						txtState = "Reported";
						status = '<img src="/menu-icons/Reported.png" />';
					} else if (document.state == consts.Repaired) {
						txtState = "Repaired";
						status = '<img src="/menu-icons/Repaired.png" />';
					} else if (document.state == consts.Canceled) {
						txtState = "Canceled";
						status = '<img src="/menu-icons/Canceled.png" />';
					} else if (document.state == consts.Deferred) {
						txtState = "Deferred";
						status = '<img src="/menu-icons/Deferred.png" />';
					} else if (document.state == consts.Detached) {
						txtState = "Detached";
						status = '<img src="/menu-icons/Detached.png" />';
					}
					
					var image = 'No Image';
					if (document.image == true) {
						image = '<a href="#canShowImage" data-identity=' 
						+ document._id + ' title="Click to view image">View Image</a><div class="imgBox' + document._id + '" style="display: none"></div>';
					}
					
					
					var Other = '<div><strong>Time limit:</strong>' + document.timelimit + '</div>' +
					'<div><strong>Created by:' + document.created + '</strong></div>' +
					'<div><strong>Assigned to:</strong>' + document.assignedTo + '</div>' +
					'<div><strong>Status:</strong>' + status + txtState + '</div>';
					
					actions = 
					
					'<div id="document">' +
					'<select id="doc_state">' +
					'<option value="-1">-Select-</option>' +
					'<option value="0">Reported</option>' +
					'<option value="1">Repaired</option>' +
					'<option value="2">Canceled</option>' +
					'<option value="3">Deferred</option>' +
					'<option value="4">Detached</option>' +
					'</select>' +
					'<input type="button" class="btnState" value="Apply" disabled=disable>' + actions +
					'<input type="hidden" class="docId" value=' + document._id + ' />' + 
					'</div>';
					
					
					documentsData.push({
					  
						Id: document._id,
						Name: '<a href="#document-descr" data-identity="' + document._id + '"><strong>' + document.name + '</strong></a><div class="document-descr" id="' + document._id + '" style="display: none">' + document.descr + '</div>',
						Date: document.date,            
						Image: image,
						Other: Other,
						Actions: actions
						
					});
			 			
				}
		     			
			}
			
			$('#process_loading').html('');	
			
			model.kendoGrid(documentsData);
			
		});		
	},
		
	kendoGrid: function (documentsData)
	{
		$("#containerSite").kendoGrid({
                        
						dataSource: {
                            data: documentsData,
                            pageSize: 5
                        },
						
                        sortable: {
                            mode: "single",
                            allowUnsort: false
                        },
												                       
                        pageable: true,
                        scrollable: false,
                       
                        columns: [		
							
                            {
                                field: "Name",
                                title: "Name",
								template: "<div>#=Name#</div>"
                            },
                            {
                                field: "Date",
                                title: "Date"
                            },
                            {
                                field: "Image",
                                title: "Image",	
								template: "<div>#=Image#</div>"
								
                            },
							{
                                field: "Other",
                                title: "Other",
								template: "<div>#=Other#</div>"
                            },
							{
                                field: "Actions",
                                title: "Actions",
								template: "<div>#=Actions#</div>"
                            }
                        ]
            });
	},
	
	document_state : function () {
		
		var selectedState;
		
		$("#document").live("click", function () {
			
			selectedState = $(this).find('select').val();
			
			var buttnOK = $(this).find('.btnState');
			
			//document id store in hidden value
			var docId = $(this).find('.docId');
			
			if (selectedState < 0)
				buttnOK.attr("disabled", "disabled");
			else
				buttnOK.removeAttr("disabled");
			
			buttnOK.click(function (event) {
				
				event.stopImmediatePropagation();
				
				JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'getDocumentByID?key="' + docId.val() + '"'], function (response) {
					
					var data = JSON.parse(response.result);
					var document = data.rows[0].value;
					
					document.state = selectedState;
					
					JsonBridge.execute('WDK.API.CouchDb', 'updateDocument', ['pmsystem', docId.val(), JSON.stringify(document)], function (data) {
						
						model.refreshDocuments(document);
						
					});
					
				});
			});
			
		})
	},
	
	CboxFillUsers : function (cBoxElement, selected, _id) {
		
		cBoxElement.empty();
		cBoxElement.html('<option value=0>-All-</option>');
		
		var count = localStorage.getItem("user-data-count");
		
		if (count > 0) 
		{
			for (i=0;i<count;i++)
			{
				var user  = JSON.parse(localStorage.getItem("user-data-" + i));
				cBoxElement.append('<option value="' + user._id + '" data-image="menu-icons/user_avatar.png">' + user.username + '</option>');
			
			    if (selected) {	
					
					if (_id == user._id)
						cBoxElement[0].selectedIndex = i + 1;
					
				}
				
			}
			cBoxElement.msDropDown();
		
		}
		
	},
	
	CboxFillProjects : function (element, selected, _id) {
		
		element.empty();
		element.append('<option value=0>- All -</option>');
				
		var count = localStorage.getItem("project-data-count");
		
		if (count > 0) 
		{
			for (i=0;i<count;i++)
			{
				var document = JSON.parse(localStorage.getItem("project-data-" + i));
				
				if (document ==  null) return false;
				element.append('<option value="' + document._id + '" data-image="menu-icons/documents.png">' + document.name + '</option>');
				
			    if (selected) {
					
					if (_id == document._id)
						element[0].selectedIndex = i + 1;
					
				}
				
			}
			element.msDropDown();			
		}
		
	},
	
	documentFilter : function () {
		
		return {
			
			docType : 0,
			container : $("#containerSite"),
			project : 0,
			userId : 0,
			state : 0,
			startDate : 0,
			endDate : 0
		}
	},
	
	FilterByProject : function (_filter) {
		
		var _view = 'GetDocumentsByProjectID?key=["' + _filter.project + '", ' + _filter.docType + ']';
		model.documents(_view);
		
	},
	
	filterByUser : function (_filter) {
		
		var _view = "";
		
		if (_filter.state <= -1)
			_view = 'GetDocumentsByUserID?key=["' + _filter.userId + '", ' + _filter.docType + ']';
		else
			_view = 'filterByParams?key=["' + _filter.userId + '", "' + _filter.state + '", ' + _filter.docType + ']';
				
		model.documents(_view);
		
		
	},
	
	filterByDate : function (_filter) {
		
		if (_filter.endDate == "")
			_filter.endDate = model.currDate();
		
		var _view = 'viewByDate?startkey=[' + _filter.docType + ', "' + _filter.startDate + '"]&endkey=[' + _filter.docType + ', "' + _filter.endDate + '"]';
		model.documents(_view);
	},
	
	FilterByStates : function (_filter) {
		
		var _view = "";
		
		if (_filter.userId <= 0)
			_view = 'getDocumentsByState?key=["' + _filter.state + '", ' + _filter.docType + ']';
		else
			_view = 'filterByParams?key=["' + _filter.userId + '", "' + _filter.state + '", ' + _filter.docType + ']';
		
		model.documents(_view);
	},
	
	reloadPage : function (_page) {
		var url = '/ui/' + _page;
		$.get(url, function (login_data) {
			$('#containerSite').html(login_data);
			
		});
	},
	
	refreshDocuments : function (_document) {
		var currUser = new system.currUser();
		var _view = 'getDocumentsByOrgID?descending=true&key=["' + currUser.organization + '", ' + _document.type + ']';		
		model.documents(_view);
	},
	
	orgValidation : function (orgName) {
		
		var pattern = new RegExp(/^[a-zA-Z0-9 ]+$/);
		return pattern.test(orgName);
		
	},
	
	userNameValidation : function (username) {
		
		var pattern = new RegExp(/^[a-zA-Z]+$/);
		return pattern.test(username);
		
	},
	
	emailValidation : function (emailAddress) {
		
		var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
		//alert( pattern.test(emailAddress) );
		return pattern.test(emailAddress);
		
	},
	
	delDocument : function (_document, _model) {
		
		//delete only developer
		JsonBridge.execute('WDK.API.CouchDb', 'deleteDocument', ['pmsystem', _document._id], function (data) {
			
			if (_model == false) {
				model.refreshDocuments(_document);
				return;
			}
			/*
			//can delete all projects by adminId
			var _currUser = app.system.currUser();
			
			if ((_currUser.position == consts.admin)){
			
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
			
			system.logOut();
			
		});
		
	}
	
};
