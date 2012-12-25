$(function() {

    $('table tr:even').css('background-color', '#000');

    JsonBridge.useAuthorization = true;
    JsonBridge.authorizationHandler = app.utils.setAuthorizationHanlder('cendentleathatenatintere', 'F2h5ChJPVY5CbkqT2RcUFLI2');

    system.init();

    $("a[href=#pm-logOut]").live("click", function() {
        system.logOut();
    });

    //projects
    $("a[href=#pm-projects]").live("click", function() {
        $.get('/ui/pm-filter.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });

    //taks
    $("a[href=#pm-tasks]").live("click", function() {

        $.get('/ui/pm-filter.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });

    //bugs
    $("a[href=#pm-bugs]").live("click", function() {
        $.get('/ui/pm-filter.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });
    
    
     //planning
    $("a[href=#pm-planning]").live("click", function() {
        $.get('/ui/pm-planning.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });
    
    
     
     //reports
    $("a[href=#pm-reports]").live("click", function() {
        $.get('/ui/pm-reports.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });
    
    
     //settings
    $("a[href=#pm-settings]").live("click", function() {

        $.get('/ui/pm-settings.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });

    //login
    $("a[href=#pm-login]").live("click", function() {		
        $.get('/ui/pm-login.html', function(login_data) {			
            $('#containerSite').html(login_data);
        });
    });

    //register
    $("a[href=#pm-register]").live("click", function() {
        $.get('/ui/pm-register.html', function(login_data) {
            $('#containerSite').html(login_data);
        });
    });

    //contacts
    $("a[href=#pm-contact]").live("click", function() {
        $('#containerContent').empty();
        $.get('/ui/pm-contact.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });
	
	//gallery
    $("a[href=#pm-gallery]").live("click", function() {
        $.get('/ui/pm-gallery.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });

    //about
    $("a[href=#pm-about]").live("click", function() {
        $('#containerContent').empty();
        $.get('/ui/pm-about.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });

    //customers
    $("a[href=#pm-customers]").live("click", function() {
        $('#containerContent').empty();
        $.get('/ui/pm-customers.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });

    //watch
    $("a[href=#pm-watch]").live("click", function() {
        $('#containerContent').empty();
        $.get('/ui/pm-watch.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });

    //join
    $("a[href=#pm-join-us]").live("click", function() {
        $('#containerContent').empty();
        $.get('/ui/pm-join-us.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });

    //friends
    $("a[href=#pm-friends]").live("click", function() {
        $('#containerContent').empty();
        $.get('/ui/pm-friends.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });

    //howitworks
    $("a[href=#pm-howitworks]").live("click", function() {
        $('#containerContent').empty();
        $.get('/ui/pm-howitworks.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });

    //recent projects
    $("a[href=#pm-recentProjects]").live("click", function() {
        $('#containerContent').empty();
        $.get('/ui/pm-recentProjects.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });

    //partner
    $("a[href=#pm-partner]").live("click", function() {
        $('#containerContent').empty();
        $.get('/ui/pm-partner.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });
        
        
    //help
    $("a[href=#pm-help]").live("click", function() {
        $('#containerContent').empty();
        $.get('/ui/pm-help.html', function(login_data) {
            $('#containerSite').html(login_data);

        });
    });

    //go to top //
    $("a").click(function() {
        $(window).scrollTop(0);
    });
        
 
});
