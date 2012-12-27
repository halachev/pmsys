/* http://www.skitsanos.com/
   version 1.0
   Written by Scitsanos 
   Please attribute the author if you use it. */
   
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
   
