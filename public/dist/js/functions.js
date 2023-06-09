$(document).ready(function () {

	 //global variable
    var protocol = window.location.protocol;
    var hostname = window.location.hostname;
    var port = window.location.port;
    var pathname = window.location.pathname;
    pathname = pathname.split("/");
    var domainName = pathname[1];

    if(port){ // 127.0.0.1:8000
    	var globalURL = protocol + "//" + hostname + ":" + port + "/";
    }else{
    	var globalURL = protocol + "//" + hostname + "/";
    }
    


   /*
* division, district, post
* ========================================================
* division hit, loading district content
*/


    $("#school_division").change(function() {
        school_district_loading_document_id($(this).val());    
    });


    $("#school_district").change(function() {
        school_post_loading_document_id($(this).val()); 
    });



    // Edit school info
    $(".editSchoolInfo").click(function(){
          id = $(this).attr('id');

          var url = globalURL + "loading_school_info_ajax_hit/" + id;
          $.ajax({
                url: url,
                type: "get",
                dataType: 'json',
                success: function(response){
                    $("#school_name").val(response["school_name"]);
                    $("#school_ein").val(response["school_ein"]);
                    $("#school_mobile").val(response["school_mobile"]);
                    $("#school_email").val(response["school_email"]);
                    $("#school_address").val(response["school_address"]);
                    $("#school_division").val(response["school_div"]);

                    // loading school district
                    school_district_loading_division_district_id(response["school_div"], response["school_dist"]);
                    school_district_loading_district_post_id(response["school_dist"], response["school_ps"]);

                    // display the logo
                    if(response["school_logo"] != null){
                        $("#hidden_school_logo").val(response["school_logo"]);
                        $("#school_logo_box").attr("src", "/storage/school_logo/" + response["school_logo"]);
                    }else{
                        $("#hidden_school_logo").val("");
                        $("#school_logo_box").attr("src", "/dist/img/image-not-available.jpg");
                    }

                    $("#hidden_school_info_id").val(response["id"]);
                },
                error: function(){
                    alert('We are sorry. Please try again.');
                }
            });

    });

	// Edit menu item
	$(".editMenuItem").click(function(){
          id = $(this).attr('id');

          var url = globalURL + "loading_menu_item_ajax_hit/" + id;
          $.ajax({
                url: url,
                type: "get",
                dataType: 'json',
                success: function(response){
                	$("#menu_name").val(response["menu_name"]);
                	$("#menu_title").val(response["menu_title"]);
                	$("#menu_url").val(response["menu_url"]);
                	$("#menu_icon").val(response["menu_icon"]);
                	$("#parent_menu").val(response["id"]);
                	$("#hidden_menu_id").val(response["id"]);
                },
                error: function(){
                    alert('We are sorry. Please try again.');
                }
            });

    });

    // ./ Edit menu item


    // Edit class info
    $(".editClassInfoItem").click(function(){
          id = $(this).attr('id');

          var url = globalURL + "loading_class_info_item_ajax_hit/" + id;
          $.ajax({
                url: url,
                type: "get",
                dataType: 'json',
                success: function(response){
                    $("#class_name").val(response["name"]);
                    $("#hidden_class_id").val(response["id"]);
                },
                error: function(){
                    alert('We are sorry. Please try again.');
                }
            });

    });

    // ./ Class info


    // Edit shift info
    $(".editShiftInfoItem").click(function(){
          id = $(this).attr('id');

          var url = globalURL + "loading_shift_info_item_ajax_hit/" + id;
          $.ajax({
                url: url,
                type: "get",
                dataType: 'json',
                success: function(response){
                    $("#shift_name").val(response["name"]);
                    $("#description").val(response["description"]);
                    $("#start_time").val(response["start_time"]);
                    $("#end_time").val(response["end_time"]);
                    $("#hidden_shift_id").val(response["id"]);
                },
                error: function(){
                    alert('We are sorry. Please try again.');
                }
            });

    });

    // ./ Shift info


     // Edit section info
    $(".editSectionInfoItem").click(function(){
          id = $(this).attr('id');

          var url = globalURL + "loading_section_info_item_ajax_hit/" + id;
          $.ajax({
                url: url,
                type: "get",
                dataType: 'json',
                success: function(response){
                    $("#section_name").val(response["name"]);
                    $("#hidden_section_id").val(response["id"]);
                },
                error: function(){
                    alert('We are sorry. Please try again.');
                }
            });

    });

    // ./ Section info



    // Edit session info
    $(".editSessionInfoItem").click(function(){
          id = $(this).attr('id');

          var url = globalURL + "loading_session_info_item_ajax_hit/" + id;
          $.ajax({
                url: url,
                type: "get",
                dataType: 'json',
                success: function(response){
                    $("#session_name").val(response["name"]);
                    $("#hidden_session_id").val(response["id"]);
                },
                error: function(){
                    alert('We are sorry. Please try again.');
                }
            });

    });

    // ./ Session info


     // Edit group info
    $(".editGroupInfoItem").click(function(){
          id = $(this).attr('id');

          var url = globalURL + "loading_group_info_item_ajax_hit/" + id;
          $.ajax({
                url: url,
                type: "get",
                dataType: 'json',
                success: function(response){
                    $("#group_name").val(response["name"]);
                    $("#hidden_group_id").val(response["id"]);
                },
                error: function(){
                    alert('We are sorry. Please try again.');
                }
            });

    });

    // ./ Group info


    // Edit medium info
    $(".editMediumInfoItem").click(function(){
          id = $(this).attr('id');

          var url = globalURL + "loading_medium_info_item_ajax_hit/" + id;
          $.ajax({
                url: url,
                type: "get",
                dataType: 'json',
                success: function(response){
                    $("#medium_name").val(response["name"]);
                    $("#hidden_medium_id").val(response["id"]);
                },
                error: function(){
                    alert('We are sorry. Please try again.');
                }
            });

    });

    // ./ Medium info
    


    function school_district_loading_division_district_id(division_id, district_id){
         var division_id = division_id;

        var url = globalURL + "division/district_loading_ajax_hit";

        if(division_id == ''){
            $('#school_district').prop('disabled',  true);
        }else{
            $('#school_district').prop('disabled',  false),
            $.ajax({
                url: url,
                type: "get",
                data: {'division_id' : division_id},
                dataType: 'json',
                success: function(data){
                   $("#school_district").html(data);
                   $("#school_district").val(district_id);
                },
                error: function(){
                    alert('We are sorry to load district. Please try again.');
                }
            });
        }
    }

    function school_district_loading_district_post_id(district_id, post_id){
        var district_id = district_id;

        var url = globalURL + "division/post_loading_ajax_hit";
        if(district_id == ''){
            $('#school_post').prop('disabled',  true);
        }else{
            $('#school_post').prop('disabled',  false),
            $.ajax({
                url: url,
                type: "get",
                data: {'district_id' : district_id},
                dataType: 'json',
                success: function(data){
                   $("#school_post").html(data);
                   $("#school_post").val(post_id);
                },
                error: function(){
                    alert('We are sorry to load post. Please try again.');
                }
            });
        }
    }

    function school_district_loading_document_id(id){
         var division_id = id;

        var url = globalURL + "division/district_loading_ajax_hit";

        if(division_id == ''){
            $('#school_district').prop('disabled',  true);
        }else{
            $('#school_district').prop('disabled',  false),
            $.ajax({
                url: url,
                type: "get",
                data: {'division_id' : division_id},
                dataType: 'json',
                success: function(data){
                   $("#school_district").html(data);
                },
                error: function(){
                    alert('We are sorry to load district. Please try again.');
                }
            });
        }
    }

    function school_post_loading_document_id(id){
        var district_id = id;

        var url = globalURL + "division/post_loading_ajax_hit";
        if(district_id == ''){
            $('#school_post').prop('disabled',  true);
        }else{
            $('#school_post').prop('disabled',  false),
            $.ajax({
                url: url,
                type: "get",
                data: {'district_id' : district_id},
                dataType: 'json',
                success: function(data){
                   $("#school_post").html(data);
                },
                error: function(){
                    alert('We are sorry to load post. Please try again.');
                }
            });
        }
    }

/*Mominur writting script start*/

    $(".editItem").click(function(){
          id = $(this).attr('id');
          var url = globalURL + "edit_item/" + id;
          $.ajax({
                url: url,
                type: "get",
                dataType: 'json',
                success: function(response){
                    document.getElementById("feeshead_title").innerText = "Update Fees Head";
                    $("#fees_head_name").val(response["fees_head_name"]);
                    $("#hidden_menu_id").val(response["id"]);
                },
                error: function(){
                    alert('We are sorry. Please try again.');
                }
            });
    });


    $(".showTrxn").click(function(){
          id = $(this).attr('id');
          var url = globalURL + "transactions-details/" + id;
          $.ajax({
                url: url,
                type: "GET",
                dataType: 'json',
                success: function(response){
                    document.getElementById("student_id_display").innerText = response.student_id;
                    document.getElementById("student_id1").innerText = response.student_id;
                    document.getElementById("amount1").innerText = response.amount;
                    document.getElementById("order_id1").innerText = response.order_id;
                    document.getElementById("trxn_id1").innerText = response.trx_id;
                    document.getElementById("bank_txn_id1").innerText = response.bank_trx_id;
                    document.getElementById("return_code1").innerText = response.return_code;
                    document.getElementById("status1").innerText = response.status;
                    document.getElementById("method1").innerText = response.method;
                    document.getElementById("trxn_date1").innerText = response.trn_date;
                    document.getElementById("invoice_no1").innerText = response.invoice_no;
                },
            });
    });

    $(".UpdateTrxn").click(function(){
          id = $(this).attr('id');
          var url = globalURL + "edit-transactions/" + id;
          $.ajax({
                url: url,
                type: "GET",
                dataType: 'json',
                success: function(response){
                    document.getElementById("student_id_display1").innerText = response["student_id"];
                    $("#student_id11").val(response["student_id"]);
                    $("#amount11").val(response["amount"]);
                    $("#order_id11").val(response["order_id"]);
                    $("#trxn_id11").val(response["trx_id"]);
                    $("#bank_txn_id11").val(response["bank_trx_id"]);
                    $("#return_code11").val(response["return_code"]);
                    $("#status11").val(response["status"]);
                    $("#method11").val(response["method"]);
                    $("#trxn_date11").val(response["trn_date"]);
                    $("#invoice_no11").val(response["invoice_no"]);
                    $("#item_id_trxn").val(response["id"]);
                },
            });
    });


    $(".editSubHeadItem").click(function(){
          id = $(this).attr('id');

          var url = globalURL + "edit_subhead_item/" + id;
          $.ajax({
                url: url,
                type: "get",
                dataType: 'json',
                success: function(response){
                    document.getElementById("subhead_title").innerText = "Update Fees Sub Head";
                    $("#fees_head_name").val(response["fees_head_name"]);
                    $("#fees_subhead_name").val(response["fees_subhead_name"]);
                    $("#hidden_menu_id").val(response["id"]);
                },
                error: function(){
                    alert('We are sorry. Please try again.');
                }
            });

    });

    $("#class233").click(function(){
          var school_id = document.getElementById("school_id233").value;
          var class_id = document.getElementById("class233").value;
          var year_id = document.getElementById("year233").value;
          if (school_id !=="" && class_id !=="" && year_id!=="") {
            var url = globalURL + "fees-amount/" + school_id+'/'+class_id+'/'+year_id;
            $.ajax({
                url: url,
                type: "GET",
                dataType: 'json',
                success: function(response){
                 response.forEach(row =>{
                    var idd ="#amount"+row.fees_id;
                    $(idd).val(row.amount);
                        
                 });

                },
            });

          }

    });


    $("#class_fw").change(function(){
          var year_id = document.getElementById("year_fw").value;
          var class_id = $(this).val();

          if(year_id !== "" && class_id !== ""){
            var url = globalURL + "fetch-student-id/"+year_id+ "/"+ class_id;
              $('#student_data_fw').empty();
              $('#student_data_fw').append('<option value="0" disabled selected>Fetching Data...</option>');

              $.ajax({
                    type: "GET",
                    url: url,
                    dataType: 'json',
                    success: function(response){
                         $('#student_data_fw').empty();
                         $('#student_data_fw').append('<option value="0" disabled selected>Select Student ID</option>');
                         
                         response.forEach(row =>{
                            $('#student_data_fw').append('<option value="'+row.id+'">'+row.student_id+'</option>');
                         });
                    },
                
                });
          }
          if(year_id==="") {
            alert("Select the Year First then Select Class");
          }

    });


    $(".editAssignClassItem").click(function(){
          id = $(this).attr('id');

          var url = globalURL + "edit_assign_class/" + id;
          $.ajax({
                url: url,
                type: "get",
                dataType: 'json',
                success: function(response){
                    $("#school_id2").val(response["school_id"]);
                    $("#class_id2").val(response["class_id"]);
                    $("#hidden_menu_id").val(response["id"]);
                },
                error: function(){
                    alert('We are sorry. Please try again.');
                }
            });

    });


    $("#student_data_fw").click(function(){
          var year_id = document.getElementById("year_fw").value;
          var class_id = document.getElementById("class_fw").value;
          var student_id = document.getElementById("student_data_fw").value;
          if (year_id !=="" && class_id !=="" && student_id!=="") {
            var url = globalURL + "fees-waiver/" + year_id+'/'+class_id+'/'+student_id;
            $.ajax({
                url: url,
                type: "GET",
                dataType: 'json',
                success: function(response){
                 response.forEach(row =>{
                    var id12 ="#paid_waiver_amount"+row.fees_id;
                    var id13 ="#discount_amount"+row.fees_id;
                    $(id12).val(row.paid_waiver_amount);
                    $(id13).val(row.discount_amount);
                        
                 });

                },
            });

          }
    });


    $(".dtd_fees_collection").click(function(){
          var year_id = document.getElementById("year_fw").value;
          var class_id = document.getElementById("class_fw").value;
          var student_id = document.getElementById("student_data_fw").value;
          if (year_id !=="" && class_id !=="" && student_id!=="") {
            var url = globalURL + "stu-fees-collection/" + year_id+'/'+class_id+'/'+student_id;
            $.ajax({
                url: url,
                type: "GET",
                dataType: 'json',
                success: function(response){
                 response.forEach(row =>{
                    var da ="#da"+row.fees_id;
                    $(da).val(row.received_amount);
                    var fa ="#fa"+row.fees_id;
                    var fees_amt = $(fa).val();
                    var due_amount_cal = fees_amt - row.received_amount;
                    var dua ="#due_amt"+row.fees_id;
                    $(dua).val(due_amount_cal);
                        
                 });

                },
            });

          }
    });

    
    
/*Mominur writting script end*/



	// Confirmation message
	$('.confirm_edit_dialog').click(function () {
		if (confirm('Do you really want to edit these records?')) {
        	return true;
	    }else{
	      	return false;
	    }
	});

	$('.confirm_delete_dialog').click(function () {
		if (confirm('Do you really want to delete these records?')) {
        	return true;
	    }else{
	      	return false;
	    }
	});


    $('.confirm_school_approved_from_pending_dialog').click(function () {
        if (confirm('Do you really want to change the status from pending to approved?')) {
            return true;
        }else{
            return false;
        }
    });
	// ./ Confirmation message

	
	// Alert message

    $('#alertMessage').show('fade');

    setTimeout(function () {
        $('#alertMessage').hide('fade');
    }, 3000);

    // ./ Alert message

});