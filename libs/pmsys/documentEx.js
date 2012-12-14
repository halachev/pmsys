 
var documentEx = {
		
    documentEx: function () {
             
        var currentDate = app.model.currDate();
              
        return {
                
            number: 0,
            date: currentDate,
            periodDate: '',
            employee: '',
            descr: '',
            type: 0,
            documents: documentEx.documentExChild()            
                
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
                                             
            
    }
};