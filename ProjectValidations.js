jQuery(document).ready(function($)
{
	/* Add button disabled until DB conn is success */

	$("#addBtnId").prop('disabled', true);	   

	/*Fade in input section on click of add button */

    $("#addBtnId").click(function()
    {
        $("#panelBodyElements").fadeIn(300);
        $("#saveNoteBtn").css('visibility', 'visible');
        $("#updateNoteBtn").css('visibility', 'hidden');
        $("#timeDivId").css('visibility', 'hidden');
        $("#addBtnId").prop('disabled', true);
        $("#reckeyId").val('');

    });
	
	/* Fade out input section on click of close button */

    $("#mainCloseBtnId").click(function()
    {
    	$("#subjectId").val('');
    	$("#authorNameId").val('');
    	$("#noteMessageId").val('');
    	$("#timeStampId").val('');
    	$("#reckeyId").val('');

    	$("#subjectId").css('border-color', '');
    	$("#authorNameId").css('border-color', '');
    	$("#noteMessageId").css('border-color', '');
        $("#panelBodyElements").fadeOut(300);
		$("#saveNoteBtn").css('visibility', 'visible');
		$("#updateNoteBtn").css('visibility', 'hidden');		
		$("#timeDivId").css('visibility', 'hidden');
        $("#addBtnId").prop('disabled', false);
    });

    	/* Fade out input section on click of close button */

    $("#mainCloseBtnId1").click(function()
    {
    	$("#subjectId").val('');
    	$("#authorNameId").val('');
    	$("#noteMessageId").val('');
    	$("#timeStampId").val('');
    	$("#reckeyId").val('');

    	$("#subjectId").css('border-color', '');
    	$("#authorNameId").css('border-color', '');
    	$("#noteMessageId").css('border-color', '');
        $("#panelBodyElements").fadeOut(300);
		$("#saveNoteBtn").css('visibility', 'visible');
		$("#updateNoteBtn").css('visibility', 'hidden');
		$("#timeDivId").css('visibility', 'hidden');
        $("#addBtnId").prop('disabled', false);
    });


    /* Validate data function */

    function fnValidateData()
    {
    	
    	var noteSub = fnJSInject($.trim($("#subjectId").val()));
    	var authorName = fnJSInject($.trim($("#authorNameId").val()));
    	var noteMessage = fnJSInject($.trim($("#noteMessageId").val()));

    	var mandValFlag = false;

    	if(noteSub.length == 0)
    	{
    		$("#subjectId").css('border-color', 'red');
    		$("#subjectId").val('');
    		mandValFlag = true;
    	}
    	else
    	{
    		$("#subjectId").css('border-color', '');
    	}

   		if(authorName.length == 0)
    	{
    		$("#authorNameId").css('border-color', 'red');
    		$("#authorNameId").val('');
    		mandValFlag = true;
    	}    	
    	else
    	{
    		$("#authorNameId").css('border-color', '');
    	}

   		if(noteMessage.length == 0)
    	{    		
    		$("#noteMessageId").css('border-color', 'red');
    		$("#noteMessageId").val('');
    		mandValFlag = true;
    	}    
    	else
    	{
    		$("#noteMessageId").css('border-color', '');
    	}   

   		return mandValFlag;
    }


    /* Save data in list on click of save button */


    $("#mainSaveBtnId").click(function()
    {
    	var noteSub = fnJSInject($.trim($("#subjectId").val()));
    	var authorName = fnJSInject($.trim($("#authorNameId").val()));
    	var noteMessage = fnJSInject($.trim($("#noteMessageId").val()));

    	var mandValFlag = fnValidateData();

    	if(mandValFlag)
    	{
    		return false;
    	}	

    	var msgLength = noteMessage.length;

    	var dt = new Date();
    	var timeStamp = dt.toLocaleString();

    	var noteObj = new Note(noteSub, authorName, noteMessage, msgLength, timeStamp);

    	fnAddNoteInList(noteObj);

    });

    /* Update data from list */

    $("#mainUpdateBtnId").click(function()
    {
    	var noteSub = fnJSInject($.trim($("#subjectId").val()));
    	var authorName = fnJSInject($.trim($("#authorNameId").val()));
    	var noteMessage = fnJSInject($.trim($("#noteMessageId").val()));
    
    	var mandValFlag = fnValidateData();

    	if(mandValFlag)
    	{
    		return false;
    	}	

    	var msgLength = noteMessage.length;

    	var dt = new Date();
    	var timeStamp = dt.toLocaleString();

    	var noteObj = new Note(noteSub, authorName, noteMessage, msgLength, timeStamp);

       	fnUpdateNoteInList($("#reckeyId").val(), noteObj);

    });

    /* Create Note Object */

    function Note(subject, author, msg, msgLength, timestamp)
    {
    	this.subject = subject;
    	this.author = author;
    	this.msg = msg;
    	this.msgLength = msgLength;
    	this.timestamp = timestamp;
    }

    var db;

	var openDBRequest = indexedDB.open('notes', 1);

	openDBRequest.onupgradeneeded = function(e)
	{
		var thisDB = e.target.result;

		if(!thisDB.objectStoreNames.contains('notesInstance')) 
		{
			thisDB.createObjectStore('notesInstance', { autoIncrement : true });
		}

		$("#addBtnId").prop('disabled', false);
	};

	openDBRequest.onsuccess = function(e)
	{
		db = e.target.result;
		$("#addBtnId").prop('disabled', false);
		fnPopulateList();	
	};


	/* Function to add note object in DB */

    function fnAddNoteInList(noteObj)
    {
		var trans = db.transaction(['notesInstance'],'readwrite');
		var dbInstance = trans.objectStore('notesInstance');
		var reqObj = dbInstance.add(noteObj);

		reqObj.onerror = function(e) 
		{
			retFlag = false;

	    };
	    reqObj.onsuccess = function(e) 
	    {
	    	$("#subjectId").val('');
	    	$("#authorNameId").val('');
	    	$("#noteMessageId").val('');
	    	$("#timeStampId").val('');
	    	$("#reckeyId").val('');
	        $("#panelBodyElements").fadeOut(300);
	        $("#saveNoteBtn").css('visibility', 'visible');
			$("#updateNoteBtn").css('visibility', 'hidden');
			$("#timeDivId").css('visibility', 'hidden');
	        $("#addBtnId").prop('disabled', false);

	        fnPopulateList();
	    };

    }

    /* Function to Update note object in DB */

    function fnUpdateNoteInList(recKey, noteObj)
    {
		var trans = db.transaction(['notesInstance'],'readwrite');
		var dbInstance = trans.objectStore('notesInstance');
		var reqObj = dbInstance.put(noteObj, Number(recKey));

		reqObj.onerror = function(e) 
		{
			retFlag = false;

	    };
	    reqObj.onsuccess = function(e) 
	    {
	    	$("#subjectId").val('');
	    	$("#authorNameId").val('');
	    	$("#noteMessageId").val('');
	    	$("#timeStampId").val('');
	    	$("#reckeyId").val('');
	        $("#panelBodyElements").fadeOut(300);
	        $("#addBtnId").prop('disabled', false);
	        $("#saveNoteBtn").css('visibility', 'visible');
			$("#updateNoteBtn").css('visibility', 'hidden');
			$("#timeDivId").css('visibility', 'hidden');

			fnPopulateList();
	    };
    }

    /* Function to Delete note object in DB */

    function fnDeleteNoteInList(recKey)
    {		
		var trans = db.transaction(['notesInstance'],'readwrite');
		var dbInstance = trans.objectStore('notesInstance');
		var reqObj = dbInstance.delete(recKey);
	
		reqObj.onerror = function(e) 
		{
			retFlag = false;

	    };
	    reqObj.onsuccess = function(e) 
	    {
	    	$("#subjectId").val('');
	    	$("#authorNameId").val('');
	    	$("#noteMessageId").val('');
	    	$("#timeStampId").val('');
	    	$("#reckeyId").val('');
	        $("#panelBodyElements").fadeOut(300);
	        $("#addBtnId").prop('disabled', false);
	        $("#saveNoteBtn").css('visibility', 'visible');
			$("#updateNoteBtn").css('visibility', 'hidden');
			$("#timeDivId").css('visibility', 'hidden');
	        fnPopulateList();
	    };
    }

    /* Function to populate value after click of edit button */

    function fnPopulateVal(recKey)
    {
		var trans = db.transaction(['notesInstance'],'readwrite');
		var dbInstance = trans.objectStore('notesInstance');
		var reqObj = dbInstance.get(recKey);
		
		reqObj.onerror = function(e) 
		{
		  // Handle errors!
		};

		reqObj.onsuccess = function(e) 
		{	    	
	    	$("#panelBodyElements").fadeIn(300);
	        $("#saveNoteBtn").css('visibility', 'hidden');
			$("#updateNoteBtn").css('visibility', 'visible');
	        $("#timeDivId").css('visibility', 'visible');	  
	        $("#addBtnId").prop('disabled', true);
	        $("#subjectId").css('border-color', '');
	        $("#authorNameId").css('border-color', '');
	        $("#noteMessageId").css('border-color', '');
	        
	        $("#subjectId").val(fnJSInjectRev(reqObj.result.subject));
		   	$("#authorNameId").val(fnJSInjectRev(reqObj.result.author));
	    	$("#noteMessageId").val(fnJSInjectRev(reqObj.result.msg));
	    	$("#timeStampId").val(reqObj.result.timestamp);
	    	$("#reckeyId").val(recKey);
		};
    }

    /* Function to populate List*/

    function fnPopulateList()
    {    
    	var trans = db.transaction(['notesInstance'],'readonly');
		var dbInstance = trans.objectStore('notesInstance');
		var reqObj = dbInstance.count();
		
		reqObj.onsuccess = function()
		{
			var recCount = Number(reqObj.result);
			$('#tbodyId').empty();

			if(recCount > 0)
			{
				var trans = db.transaction(['notesInstance'],'readonly');
				var dbInstance = trans.objectStore('notesInstance');
				var counter = 1;						

				dbInstance.openCursor().onsuccess = function(e)
				{
					var rec = e.target.result;
					
					if(rec)
					{

						var $tblRow = $('<tr>');
						var $Cell1 = $('<td>' + counter + '</td>');
						var $Cell2 = $('<td>' + rec.value.subject + '</td>');
						var $Cell3 = $('<td>' + rec.value.msgLength + '</td>');
						var $Cell4 = $('<td>' + rec.value.timestamp + '</td>');

						var CellKey =rec.key;
						
						var $Cell5 = $('<td> <button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-edit"></span> Edit </button> </td>');
						$Cell5.click(function()
						{	
							fnPopulateVal(CellKey);
						});    

						var $Cell6 = $('<td> <button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-erase"></span> Delete</button></td>');
						$Cell6.click(function()
						{	
							fnDeleteNoteInList(Number(CellKey));
						});  

						$tblRow.append($Cell1);
						$tblRow.append($Cell2);
						$tblRow.append($Cell3);
						$tblRow.append($Cell4);						
						$tblRow.append($Cell5);
						$tblRow.append($Cell6);
				
						$('#resultWrapper table').append($tblRow);

    					counter = counter +1;
    					rec.continue();
					}

				};

				$('#resultCount').empty();
				$('#resultCount').append('<h3> No of notes :'+recCount+'</h3>');	
				$("#resultWrapper").css('visibility', 'visible');	

			}
			else
			{
				$('#resultCount').empty();
				$('#resultCount').append('<h3> No Notes to display!! </h3>');	
				$("#resultWrapper").css('visibility', 'hidden');			
			}

		};

    }

    /* Script Injector validation*/

	function fnJSInject(val) 
	{
	    val = val.replace(/&/g, '&amp;');
	    val = val.replace(/</g, '&lt;');
	    val = val.replace(/>/g, '&gt;');
	    return val;
	}

	function fnJSInjectRev(val) 
	{	    
	 	/*
	    val = val.replace('&lt;', '<');
	    val = val.replace('&gt;', '>');
	    val = val.replace('&amp;', '&');
	 	*/
	    return val;
	}



}); // End of document Ready Function