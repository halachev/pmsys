/* http://pmsys.org/
   version 1.0
   Written by Nurietin Mehmedov (01.08.2012).  
   Please attribute the author if you use it. */
   
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
            return 'Loading ...<br/> <img src="/menu-icons/ajax-loader.gif" alt="Loading..." />';
        },

		working : function() {
            return 'Working please wait ...<br/> <img src="/menu-icons/ajax-loader.gif" alt="Working please wait..." />';
        },
		
        avatar : function() {
            return '<img src="/menu-icons/user_avatar.png" />'
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
                params.errorMessage.html('<br/><p>All fields are requared!</p>');
            }

            return error;
        }
    }
};