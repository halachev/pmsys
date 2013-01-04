/* http://pmsys.org/
   version 1.0
   Written by Nurietin Mehmedov (01.08.2012).  
   Please attribute the author if you use it. */
   
$.alert = function(title, msg, login, buttons) {
    var c = $('<div ></div>');
    $(document).append(c);
    c.html('<span>' + msg + '</span>');
    system.userById();
    c.dialog({
        autoOpen : false,
        width: "auto",
        height: "auto",
        resize: "auto",
        modal : true,
        closeOnEscape: true,
        //show : 'fadeIn',
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

            model.delDocument(document, true);

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

            model.delDocument(document, false);

        });

    }
});

$("a[href=#canEditDocument]").live("click", function() {

    var _id = $(this).data("identity");

    model.setModalForm(_id, false);
    app.ui.defaultImage();

});


$("a[href=#canCopyDocument]").live("click", function() {

    var _id = $(this).data("identity");

    model.setModalForm(_id, true);
    app.ui.defaultImage();

});


$("a[href=#document-descr]").live("click", function () {

    var _id = $(this).data("identity");
    var Isvisible = $('#' + _id).is(':visible');
    if (Isvisible)
        $('#' + _id).fadeOut(500);
    else
        $('#' + _id).fadeIn(500);


});


$("a[href=#canShowImage]").live("click", function() {

    var _id = $(this).data("identity");
		
	JsonBridge.execute('WDK.API.CouchDb', 'getDesignViewAsJson', ['pmsystem', 'documents', 'getImageByID?key="' + _id + '"'], function(response) {

            
            var data = JSON.parse(response.result);
            var document = data.rows[0].value;
			
			location = document.image;
			
			return false;
			
        });
	
   

});





