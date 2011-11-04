var countArray = new Array();
$(document).ready(function() {
    
    counter = 1;
    //Auto complete
    $(".formInputProjectAdmin").autocomplete(employees, {
        formatItem: function(item) {
            return item.name;
        },
        matchContains:true
    }).result(function(event, item) {

        validateProjectAdmins();
    });
    
    //customer auto complete
    $(".formInputCustomer").autocomplete(customers, {
        formatItem: function(item) {
            return item.name;
        },
        matchContains:true
    }).result(function(event, item) {

        $('#addProject_customerId').val(item.id);
    });
    
    //project auto complete
    $(".project").autocomplete(projects, {
        formatItem: function(item) {
            return item.name;
        },
        matchContains:true
    }).result(function(event, item) {
        $('#errorHolderCopy').text("");
        var url = urlForGetActivity+item.id;
        getActivityList(url);
    });
    
    $('#addActivity').hide();
        
    $('#btnCancel').click(function() {
        window.location.replace(cancelBtnUrl);
    });
       
    $('.projectAdminError').css('display','none');
    
    for(var i = 0; i <= numberOfProjectAdmins-2; i++){
        $('#projectAdmin_'+(i+2)).hide();
        countArray[i] = i+2;
    }
    countArray = countArray.reverse();

    $('#removeButton1').hide();
    
    $("#addButton").live('click', function(){

        if(countArray.length == 1){
            $("#addButton").hide();
        }      
        var index = countArray.pop();
        $('#projectAdmin_'+index).show();
        if ($('#addProject_projectAdmin_'+index).val() == '' || $('#addProject_projectAdmin_'+index).val() == lang_typeHint) {
            $('#addProject_projectAdmin_'+index).addClass("inputFormatHint").val(lang_typeHint);
        }
    });
    
    $('.removeText').live('click', function(){
        var result = /\d+(?:\.\d+)?/.exec(this.id);
        $('#projectAdmin_'+result).hide();
        $('#addProject_projectAdmin_'+result).val("");
        countArray.push(result);
        if(countArray.length > 0){
            $("#addButton").show();
        }
        isValidForm();
        validateProjectAdmins();
        $(this).prev().removeClass('error');
        $(this).next().html('');

    });
    
    $("#customerDialog").dialog({
        autoOpen: false,
        modal: true,
        width: 500,
        height:300,
        position: 'middle'
    });
    
    $("#copyActivity").dialog({
        autoOpen: false,
        modal: true,
        width: 500,
        height: 'auto',
        position: 'middle'
    });
    
    $("#dialogCancel").click(function(){
        $("#customerDialog").dialog("close");
    });
    
    $("#btnCopy").click(function(){
        $("#copyActivity").dialog("open");
    });
    
    $("#btnCopyCancel").click(function(){
        $("#copyActivity").dialog("close");
        $('.activityDiv').remove();
        $('#errorHolderCopy').text("");
        $('.project').val("");
    });
    
    $('#btnCopyDig').hide();
    
    $('.formInputProjectAdmin').each(function(){
        if($(this).parent().css('display') == 'block') {
            if ($(this).val() == '' || $(this).val() == lang_typeHint) {
                $(this).addClass("inputFormatHint").val(lang_typeHint);
            }
        }
    });
    $('.project').each(function(){
        if($(this).parent().css('display') == 'block') {
            if ($(this).val() == '' || $(this).val() == lang_typeHint) {
                $(this).addClass("inputFormatHint").val(lang_typeHint);
            }
        }
    });
   
    $('.formInputProjectAdmin').one('focus', function() {
        
        if ($(this).hasClass("inputFormatHint")) {
            $(this).val("");
            $(this).removeClass("inputFormatHint");
        }

    });

    $('.formInputCustomer').each(function(){
        if($(this).parent().css('display') == 'block') {
            if ($(this).val() == '' || $(this).val() == lang_typeHint) {
                $(this).addClass("inputFormatHint").val(lang_typeHint);
            }
        }
    });
   
    $('.formInputCustomer').one('focus', function() {
        
        if ($(this).hasClass("inputFormatHint")) {
            $(this).val("");
            $(this).removeClass("inputFormatHint");
        }

    });
    
    $('.project').click(function() {
        
        if ($(this).hasClass("inputFormatHint")) {
            $(this).val("");
            $(this).removeClass("inputFormatHint");
        }

    });
    
    $('#dialogSave').click(function(){
        if(validateThickBox()){
            saveCustomer(custUrl+'?customerName='+$('#addCustomer_customerName').val()+'&description='+$('#addCustomer_description').val());
        }
    });
    
    $('#btnSave').click(function() {
        
        if($('#btnSave').val() == lang_edit){
            enableWidgets();
            $('#btnSave').val(lang_save);
        } else if($('#btnSave').val() == lang_save){
            if(isValidForm()){
                removeTypeHints();
                setProjectAdmins();
                $('#frmAddProject').submit()
            }   
        }
    });
    
    if(projectId>0){
        var noOfInterviewers = $('#addProject_projectAdminList').val();
        var i;
        for(i=2; i<=noOfInterviewers; i++){
            $('#projectAdmin_'+(i)).show();
            var index = countArray.indexOf(i);
            countArray.splice(index, 1);
        }
        $('#addProjectHeading').text(lang_editProject);
        disableWidgets();              
    }
    
    if(custId > 0) {      
        $('#addProject_customerName').val(custName);
        $('#addProject_customerName').removeClass('inputFormatHint');
        $('#addProject_customerId').val(custId);
    }
    
    $('#btnActSave').click(function(){
        $('#addProjectActivity_projectId').val(projectId);
        $('#frmAddActivity').submit();
    });
    
    $('#btnActCancel').click(function(){
        $('#addActivity').hide();
    });
    
    $('#btnCopyDig').click(function() {

        var checked = $('#frmCopyAct input:checked').length;

        if ( checked > 0 ) {
            $('#frmCopyAct').submit();
        } else {
            $('#errorHolderCopy').text(lang_noActivitiesSelected);
        }
    });
    
    $('#btnAdd').click(function(){
        $('#addActivity').show();
        $('#addProjectActivity_activityId').val("");
        $('#addProjectActivity_activityName').val("");
    });
    
    $('#btnDelete').attr('disabled', 'disabled');

        
    $("#ohrmList_chkSelectAll").click(function() {
        if($(":checkbox").length == 1) {
            $('#btnDelete').attr('disabled','disabled');
        }
        else {
            if($("#ohrmList_chkSelectAll").is(':checked')) {
                $('#btnDelete').removeAttr('disabled');
            } else {
                $('#btnDelete').attr('disabled','disabled');
            }
        }
    });
    
    $(':checkbox[name*="chkSelectRow[]"]').click(function() {
        if($(':checkbox[name*="chkSelectRow[]"]').is(':checked')) {
            $('#btnDelete').removeAttr('disabled');
        } else {
            $('#btnDelete').attr('disabled','disabled');
        }
    });
    
    $('#btnDelete').click(function(){
        $('#frmDelActivity').submit();
    })
    
    $('a[href="javascript:"]').click(function(){
        var name = $(this).closest("a").text();
        var row = $(this).closest("tr");
        var activityId = row.find('input').val();
        $('#addProjectActivity_activityId').val(activityId);
        $('#addProjectActivity_activityName').val(name);
        $('#addActivity').show();

    });
    
    $("#frmAddActivity").validate({

        rules: {
            'addProjectActivity[activityName]' : {
                required:true,
                maxlength: 100
            }

        },
        messages: {
            'addProjectActivity[activityName]' : {
                required:lang_activityNameRequired,
                maxlength: lang_exceed100Chars
            }

        },
        errorPlacement: function(error, element) {

            error.appendTo(element.next('div.errorHolder'));

        }
    });
     
});

function openDialogue(){
    $("#customerDialog").dialog("open")
}

function disableWidgets(){
    $('#addProject_customerName').attr('disabled','disabled');
    $('#addProject_projectName').attr('disabled','disabled');
    $('.formInputProjectAdmin').attr('disabled','disabled');
    $('#addProject_description').attr('disabled','disabled');
    $('#addCustomerLink').hide();
    $('#addButton').hide();
    $('.removeText').hide();
    $('#btnSave').val(lang_edit);
    
    
}

function enableWidgets(){
    
    $('#addProject_customerName').removeAttr('disabled');
    $('#addProject_projectName').removeAttr('disabled');
    $('.formInputProjectAdmin').removeAttr('disabled');
    $('#addProject_description').removeAttr('disabled');
    $('#addCustomerLink').show();
    $('#addButton').show();
    $('.removeText').show();
    $('#btnSave').val(lang_save);
    
}

function removeTypeHints() {
    
    $('.formInputInterviewer').each(function(){
        if($(this).val() == lang_typeHint) {
            $(this).val("");
        }
    });
    
}

function validateThickBox(){
    
    $('#errorHolderName').removeClass("error");
    $('#errorHolderName').html('');
    $('#errorHolderDesc').removeClass("error");
    $('#errorHolderDesc').html('');
    var isValid = true;
    
    if($('#addCustomer_customerName').val() == ''){
        $('#errorHolderName').addClass("error").html(lang_nameRequired);
        isValid = false;
    }
    
    if($('#addCustomer_customerName').val().length > 50 ){
        $('#errorHolderName').addClass("error").html(lang_exceed50Chars);
        isValid = false;
    }
    
    if($('#addCustomer_description').val().length > 255 ){
        $('#errorHolderDesc').addClass("error").html(lang_exceed255Chars);
        isValid = false;
    }
    
    return isValid;
}

function saveCustomer(url){
    
    $.getJSON(url, function(data) {
        window.location.replace(projectUrl+'?custId='+data.id+'&projectId='+projectId);
    })
}

function setProjectAdmins(){

    var empCount = employeeList.length;
    var empIdList = new Array();
    var j = 0;
    $('.formInputProjectAdmin').each(function(){
        element = $(this);
        inputName = $.trim(element.val()).toLowerCase();
        if(inputName != ""){
            var i;
            for (i=0; i < empCount; i++) {
                arrayName = employeeList[i].name.toLowerCase();

                if (inputName == arrayName) {
                    empIdList[j] = employeeList[i].id;
                    j++;
                    break;
                }
            }
        }
    });
    $('#addProject_projectAdminList').val(empIdList);
}

function validateProjectAdmins(){

    var flag = true;
    $(".messageBalloon_success").remove();
    $('#projectAdminNameError').removeAttr('class');
    $('#projectAdminNameError').html("");

    var errorStyle = "background-color:#FFDFDF;";
    var normalStyle = "background-color:#FFFFFF;";
    var interviewerNameArray = new Array();
    var errorElements = new Array();
    var index = 0;
    var num = 0;

    $('.formInputProjectAdmin').each(function(){
        element = $(this);
        $(element).attr('style', normalStyle);
        if((element.val() != "") && (element.val() != lang_typeHint)){
            interviewerNameArray[index] = $(element);
            index++;
        }
    });

    for(var i=0; i<interviewerNameArray.length; i++){
        var currentElement = interviewerNameArray[i];
        for(var j=1+i; j<interviewerNameArray.length; j++){

            if(currentElement.val() == interviewerNameArray[j].val() ){
                errorElements[num] = currentElement;
                errorElements[++num] = interviewerNameArray[j];
                num++;
                $('#projectAdminNameError').html(lang_identical_rows);
                flag = false;

            }
        }
        for(var k=0; k<errorElements.length; k++){

            errorElements[k].attr('style', errorStyle);
        }
    }

    return flag;
}

function getActivityList(url){
    
    $.getJSON(url, function(data) {
        $('.activityDiv').remove();
        if(data == "") {
            $('#errorHolderCopy').text(lang_noActivities);
        } else {
            $('#btnCopyDig').show();
            buildActivityList(data);
        }
    })
}

function buildActivityList(data){
    
    var i;
    for (i=0; i<data.length; i++){

        var newActivity = $(document.createElement('div')).attr("class", 'activityDiv');    

        newActivity.after().html('<input type="checkbox" checked="yes" name="activityNames[]" value="'+data[i].name+'" class="check"/>' +
            '<span '+'class="activityName"'+'">'+data[i].name+'</span>'+'<br class="clear" />');

        newActivity.appendTo("#copyActivityList");
    }
}

function isValidForm(){
    
    $.validator.addMethod("projectAdminNameValidation", function(value, element, params) {
        var temp = false;
        var hmCount = employeeList.length;
        var i;
        for (i=0; i < hmCount; i++) {
            hmName = $.trim($('#'+element.id).val()).toLowerCase();
            arrayName = employeeList[i].name.toLowerCase();
            if (hmName == arrayName) {
                $('#'+element.id).val(employeeList[i].name);
                temp = true;
                break;
            }
        }
        if((($('#'+element.id).val() == "") || ($('#'+element.id).val() == lang_typeHint))) {
            temp = true;
        }
        
        if(!temp) {
            $('#'+element.id).next().next().css('display', 'block');
        } else {
            $('#'+element.id).next().next().css('display', 'none');
        }
        
        return temp;
        return true;
    });
    
    $.validator.addMethod("customerValidation", function(value, element, params) {
        
        var cusCount = customerList.length;
        var isValid = false;
        var cusName = $('#addProject_customerName').val();
        var inputName = $.trim(cusName).toLowerCase();
        if(inputName != ""){
            var i;
            for (i=0; i < cusCount; i++) {
                var arrayName = customerList[i].name.toLowerCase();
                if (inputName == arrayName) {
                    isValid =  true;
                    break;
                }
            }
        }
        return isValid;
    });
    
    var validator = $("#frmAddProject").validate({

        rules: {
            'addProject[customerName]' : {
                required:true,
                customerValidation: true,
                maxlength: 50
            },
            'addProject[projectName]' : {
                required:true,
                maxlength: 50
            },
            'addProject[projectAdmin_1]' : {
                projectAdminNameValidation : true
            },
            'addProject[projectAdmin_2]' : {
                projectAdminNameValidation : true
            },
            'addProject[projectAdmin_3]' : {
                projectAdminNameValidation : true
            },
            'addProject[projectAdmin_4]' : {
                projectAdminNameValidation : true
            },
            'addProject[projectAdmin_5]' : {
                projectAdminNameValidation : true
            },
            'addProject[description]' : {
                maxlength: 255
            }

        },
        messages: {
            'addProject[customerName]' : {
                required: lang_nameRequired,
                customerValidation: lang_validCustomer,
                maxlength: lang_exceed50Chars
            },
            'addProject[projectName]' : {
                required: lang_projectRequired,
                maxlength: lang_exceed50Chars
            },
            'addProject[projectAdmin_1]' : {
                projectAdminNameValidation : lang_enterAValidEmployeeName
            },
            'addProject[projectAdmin_2]' : {
                projectAdminNameValidation : lang_enterAValidEmployeeName
            },
            'addProject[projectAdmin_3]' : {
                projectAdminNameValidation : lang_enterAValidEmployeeName
            },
            'addProject[projectAdmin_4]' : {
                projectAdminNameValidation : lang_enterAValidEmployeeName
            },
            'addProject[projectAdmin_5]' : {
                projectAdminNameValidation : lang_enterAValidEmployeeName
            },
            'addProject[description]' : {
                maxlength: lang_exceed255Chars
            }

        },

        errorPlacement: function(error, element) {
            //error.appendTo(element.prev('label'));
            error.appendTo(element.next().next().next('div.errorHolder'));
            if(element.next().hasClass('errorHolder')) {
                error.appendTo(element.next('div.errorHolder'));
            } else if(element.next().next().hasClass('errorHolder')) {
                error.appendTo(element.next().next('div.errorHolder'));
            }

        }

    });
    return true;
}