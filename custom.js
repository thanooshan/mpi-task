$(function() {
	
	var user_id = $('#owner_id').data('owner_id');
	var j = 0, i = 0;
	var siteCode = null, disable = true;
	var maxEnable = 0, minEnable = 0;
	var countdownSeconds = 0;

	$('#power-callout').hide();


     var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/")+1);

     ///alert(pgurl);

     $("#menu li a").each(function(){
          if($(this).attr("href") == pgurl || $(this).attr("href") == '' )
          $(this).addClass("active");
     });

	//slider data feed

	$.ajax({
		url: 'sliderUpdate.php',
		type: 'post',
		dataType: 'json',
		data: { 'sensorCode': sensorCode },
		success:function(data) {

			if(data.alarm_hc_enable == 1) {
				$('#higher_check_enable').attr('checked', 'checked');
			}

			if(data.alarm_lc_enable == 1) {
				$('#lower_check_enable').attr('checked', 'checked');
			}					

			$("#ionrange").ionRangeSlider({
				type: "double",
				grid: true,
				min: data.min_value,
				max: data.max_value,
				from: data.alarm_lc_value,
				to: data.alarm_hc_value,
				postfix: data.device_unit,
				onStart: function(data) {
					$('#lower_value').val(data.from);
					$('#higher_value').val(data.to);
				},
				onChange: function(data) {
					$('#lower_value').val(data.from);
					$('#higher_value').val(data.to);
				},
				onFinish: function(data) {
					$('#lower_value').val(data.from);
					$('#higher_value').val(data.to);
				}					
			});			
		}
	});


	$("#range_25").ionRangeSlider({
		type: "single",
		grid: true,
		min: 0,
		max: 10,
		postfix: "min",
		disable: true,
		onStart: function(data) {
			$('#repond-time').html(data.from);
		},
		onChange: function(data) {
			$('#repond-time').html(data.from);
		},
		onFinish: function(data) {
			$('#repond-time').html(data.from);
		}					
	});	

	var slider = $("#range_25").data("ionRangeSlider");	

	$.ajax({
		url: 'sliderUpdate.php',
		type: 'post',
		dataType: 'json',
		data: { 'sensorCode': sensorCode },
		success:function(data) {

			if(data.powersaver_mode_period == 0) {
				$('#activater').removeAttr('checked');
			} else {
				$('#activater').attr('checked', 'checked');
				slider.update({ disable: false });
				$('#power-callout').show();
				$('#repond-time').html(data.powersaver_mode_period);
			}

			slider.update({
				from: data.powersaver_mode_period,
				onFinish:function(data) {
					$.ajax({
						url: 'powersaving.php',
						type: 'post',
						data: { 'sensorCode':sensorCode, 'value': data.from },
						success:function(data){
							//$.alert('Changes Saved');
						}
					});
				}				
			});
		}
	});	

	$('#activater').on('change', function() {
		if($('#activater').is(':checked')) {
			slider.update({ disable: false });
			$('#power-callout').show();
		} else {
			slider.update({ disable: true });
			$('#power-callout').hide();
			$.ajax({
				url: 'powersaving.php',
				type: 'post',
				data: { 'sensorCode':sensorCode, 'value': 0 },
				success:function(data){
					//$.alert('Changes Saved');
				}
			});			
		}		
	});


	// $('#alarm_form').submit(function(e) {
	// 	e.preventDefault();

	// 	var minValue = $('#lower_value').val();
	// 	var maxValue = $('#higher_value').val();

	// 	if($('#higher_check_enable').is(':checked')){
	// 		maxEnable = 1;
	// 	}

	// 	if($('#lower_check_enable').is(':checked')){
	// 		minEnable = 1;
	// 	}		

	// 	alert(sensorCode);

	// 		$.ajax({
	// 			url: 'sliderChanges.php',
	// 			type: 'post',
	// 			data: { 'sensorCode': sensorCode, 'maxValue': maxValue, 'minValue' : minValue, 'maxEnable' : maxEnable, 'minEnable': minEnable },
	// 			success:function(data) {
	// 				$.alert(data);
	// 			}
	// 		});

	// });

	//slider update
	// function sliderUpdate(maxValue, minValue) {

	// 	//setInterval(function() {
	// 		if($('#higher_check_enable').is(':checked')){
	// 			maxEnable = 1;
	// 		}

	// 		if($('#lower_check_enable').is(':checked')){
	// 			minEnable = 1;
	// 		}

	// 		//alert(maxValue);	

	// 		$.ajax({
	// 			url: 'sliderChanges.php',
	// 			type: 'post',
	// 			data: { 'sensorCode': sensorCode, 'maxValue': maxValue, 'minValue' : minValue, 'maxEnable' : maxEnable, 'minEnable': minEnable },
	// 			success:function(data) {
	// 				//code goes here
	// 			}
	// 		});

	// 	//}, 100);
	// }

	// $('#alarm-apply').on('click',function() {
	// 	//e.preventDefault();

	// 	var min = $('#lower_value').val();
	// 	var max = $('#higher_value').val();

	// 	//alert(min);

	// 	sliderUpdate(max, min);
	// });


	$("input[name='demo3']").TouchSpin({
		max: 3600
	});

	//log frequency live update

	$('#demo3').change(function() {
		var frequency = $(this).val();

		$.ajax({
			url: 'updateChange.php',
			type: 'post',
			data: { 'value' : frequency, 'column' : 'log_frequency' , 'table' : 'device_info', 'columnId': 'device_code', 'id' : sensorCode },
			success:function(data) {
				$('#widget-time').html('Every ' + data);
			}
		});
	});

	function ajaxCall() {
		$.ajax({
		url: 'notificationCheck.php',
		dataType: 'json',
		data: { 'user_id' : user_id },
		success:function(data) {

			if(!(data.length) == 0 ){
				$('#new').show();

				$.each(data, function(index, item) {
					//$('.nano-content ul').append('<li class="bg-warning" id="notification-li">');
					while(j <= index) {
						while(i < data.length) {

							if(data[i]['notification_type'] !== 'request permission') {
								$('.nano-content ul').append('<li class="bg-danger" id="notification-li"><a href=""><span class="notification-icon"><i class="fa fa-bolt"></i></span><h4>'+ data[i]['notification_type'] +'</h4><p>'+ data[i]['notification_message'] +'</p><div class="respond-option"><div id="respond-notify"><div id="respond-notify-command" data-notify-id='+ data[i]['notification_code'] +' class="label label-danger respond-notify-class">Ok</div></div></div></a></li>');
							} else if(data[i]['notification_type'] == 'request permission') {
								$('.nano-content ul').append('<li class="bg-warning" id="notification-li"><a href=""><span class="notification-icon"><i class="fa fa-bolt"></i></span><h4>'+ data[i]['notification_type'] +'</h4><p>'+ data[i]['notification_message'] +'</p><div class="respond-option"><div id="notify-command" data-notify-id='+ data[i]['notification_code'] +' data-access="full" class="label label-success">Full Access</div><div id="notify-command" data-notify-id='+ data[i]['notification_code'] +' data-access="read" class="label label-primary">Read Only</div><div id="notify-command" data-notify-id='+ data[i]['notification_code'] +' data-access="reject" class="label label-danger">Reject</div></div></a></li>');								
							}
							i++;
						}
						j++;
					}
				});				
			}
		}
		});			
	}

	//notification ajax call return
	setInterval(function(){
		ajaxCall();
	}, 1000);

	//chat message return
	setInterval(function(){

		$.ajax({
			url: 'chatcheck.php',
			type: 'post',
			data: { 'user_id' : user_id, 'device_code' : sensorCode, 'siteCode' : siteCode }, //sensorCode declared in chart.js
			success:function(data) {
				$('#li-messages').html('<div class="list-unstyled media-block">'+data+'</div>');
				$('.nano-content').scrollTop($('#li-messages')[0].scrollHeight);
			}
		});
	}, 1000);

	//chat message
	$('#chatform').click(function(e) {
		e.preventDefault();

		$('#chatBtn').click(function() {

			var message = $('#chatMessage').val();

			$.ajax({
				url: 'chatroom.php',
				type: 'post',
				data: { 'user_id': user_id, 'device_code': sensorCode, 'siteCode': siteCode, 'message': message },
				success:function(data) {
					$('#chatMessage').val("");
					
				}
			});

		});
	});

	//live site page update

	var sitepageid = $('#sitePageId').data('site-page-id');

	setInterval(function() {
		$.ajax({
			url: 'sitePagefunction.php',
			type: 'post',
			data: { 'sitePageId' : sitepageid },
			success:function(data) {
				$('#ul-devices-2').html(data);

				$(".my_class_slider").ionRangeSlider({
					type: "single",
					grid: true,
					from: $(this).data('from'),
					min: 0,
					max: 100,
					postfix: "%",
					onFinish: function(data) {
						sensor_code = data.input.data('sensor-id');
						// alert(sensor_code);
						// console.log(sensor_code);

						//console.log(e);
						//console.log(this);
						

						$.ajax({
							url: 'valveChange.php',
							type: 'post',
							data: { 'sensor_code' : sensor_code, 'value' : data.from },
							success:function(data) {
								//
							}
						});
					}					
				});				
			}
		});
	}, 1000);

	//live switcher
	$(document).on("change", ".switch", function () {

		var checked_value;
		var sensor_id = $(this).find('input').data('sensor-id');

		//alert(sensor_id);


		if($(this).find('input').is(':checked')) {
			checked_value = 1;
		} else {
			checked_value = 0;
		}

		//alert(sensor_id);
		//alert(checked_value);

		$.ajax({
			url: 'checkbox.php',
			type: 'post',
			data: {'checked_value' : checked_value, 'sensor_id' : sensor_id },
			success:function(data) {
				//alert(data);
			}
		});	
	});	

	//senor page live updates
	setInterval(function() {

		$.ajax({
			url: 'sensorFunction.php',
			type: 'post',
			dataType: 'json',
			data: { 'sensorCode' : sensorCode },
			success:function(data){
				var iNum = data.value;
				$('.temprature-rate').html(iNum +'<sup>'+ data.sensor_unit +'</sup>' );
				$('.temprature-updated').html('<strong>last updated :</strong> '+ data.last_updated);
				$('.logs').html(data.recorded_logs);
				$('.sensorImage').html(data.motion);
				$('.switcher').html(data.switcher);
				$('.SensorInputRange').html(data.SensorInputRange);

				$("#range_27").ionRangeSlider({
					type: "single",
					grid: true,
					from: $(this).data('from'),
					min: 0,
					max: 100,
					postfix: "%",
					onFinish: function(data) {					

						$.ajax({
							url: 'valveChange.php',
							type: 'post',
							data: { 'sensor_code' : sensorCode, 'value' : data.from },
							success:function(data) {
								//
							}
						});
					}					
				});	
			}
		});
	}, 1000);

	//reset the logs
	$('#btn-reset').on('click', function() {
		$.ajax({
			url:'resetLog.php',
			data: 'post',
			data: { 'sensorCode' : sensorCode },
			success:function(data) {
				$.alert(data);
			}
		});
	});


	//modal window click for insert/view/update site
	$(document).on("click", ".modal-call", function () {
	     var site_code = $(this).data('id');

	     $('#button-private').hide();
	     $('.button-class').show()
	     alert(user_id);

	     $.ajax({
	     	url: 'modaldata.php',
	     	type: 'post',
	     	dataType: 'json',
	     	data : { 'site_code' : site_code },
	     	success: function(data) {
	     		$('.site_name').html(data.site_name);
	     		$('#site_location').html(data.location);
	     		$('#site_description').html(data.description);

	     		$('input[name="site_name_update"]').val(data.site_name);
	     		$('input[name="site_location_update"]').val(data.location);
	     		$('textarea[name="site_description_update"]').val(data.description);

	     		var site_id = data.site_id;
	     		alert(site_id);

	     		//var requeestPermission = 'requestPermission.php?code='+ data.site_code +'&requester='+ user_id;

	     		if((data.privacy) == 0) {
	     			$('.button-class').removeClass('btn-danger').addClass('btn btn-success').html('Go to Site').removeAttr('id').removeAttr('disabled').attr('href', 'sitepage.php?id='+site_code+'');
	     			$('.callout').removeClass('callout-warning').addClass('callout-info');
	     			$('.callout-heading').html('You Have Access!');
	     		} else if((data.privacy) == 1){  			
	     			$.ajax({
	     				url: 'accessRights.php',
	     				type: 'post',
	     				data: { 'requester' : user_id, 'code' : data.site_id },
	     				success:function(data) {
							if(data == 'owner'){
								$('.button-class').removeClass('btn-danger').addClass('btn btn-success').html('Go to Site').removeAttr('id').removeAttr('disabled').attr('href', 'sitepage.php?id='+site_code+'');
					 			$('.callout').removeClass('callout-warning').addClass('callout-info');
					 			$('.callout-heading').html('Your are the owner of this site!');
					 			$('.pricing-table').html('<table class="table table-bordered table-striped"><thead><tr><th width="40%">Feature</th><th width="15%">Owner</th></tr></thead><tbody><tr><td width="40%" class="features">Edit/Delete Site</td><td class="yes" width="15%"><i class="fa fa-check" aria-hidden="true"></i></td></tr><tr><td width="40%">Add/Edit/Delete Devices</td><td class="yes" width="15%"><i class="fa fa-check" aria-hidden="true"></i></td></tr><tr><td width="40%">View Devices</td><td class="yes" width="15%"><i class="fa fa-check" aria-hidden="true"></i></td></tr><tr><td width="40%">Access Device Diaries</td><td class="yes" width="15%"><i class="fa fa-check" aria-hidden="true"></i></td></tr></tbody></table>');

							} else if(data == 'w/r') {
				     			$('.button-class').removeClass('btn-danger').addClass('btn btn-success').html('Go to Site').removeAttr('id').removeAttr('disabled').attr('href', 'sitepage.php?id='+site_code+'');
				     			$('.callout').removeClass('callout-warning').addClass('callout-info');
				     			$('.callout-heading').html('You Have Full Access!');
					 			$('.pricing-table').html('<table class="table table-bordered table-striped"><thead><tr><th width="40%">Feature</th><th width="15%">Full Access</th></tr></thead><tbody><tr><td width="40%" class="features">Edit/Delete Site</td><td class="no" width="15%"><i class="fa fa-times" aria-hidden="true"></i></td></tr><tr><td width="40%">Add/Edit/Delete Devices</td><td class="yes" width="15%"><i class="fa fa-check" aria-hidden="true"></i></td></tr><tr><td width="40%">View Devices</td><td class="yes" width="15%"><i class="fa fa-check" aria-hidden="true"></i></td></tr><tr><td width="40%">Access Device Diaries</td><td class="yes" width="15%"><i class="fa fa-check" aria-hidden="true"></i></td></tr></tbody></table>');			     			

							} else if(data == 'r') {
				     			$('.button-class').removeClass('btn-danger').addClass('btn btn-success').html('Go to Site').removeAttr('id').removeAttr('disabled').attr('href', 'sitepage.php?id='+site_code+'');
				     			$('.callout').removeClass('callout-warning').addClass('callout-info');
				     			$('.callout-heading').html('You Have Ready Only Access!');
				     			$('.pricing-table').html('<table class="table table-bordered table-striped"><thead><tr><th width="40%">Feature</th><th width="15%">Read Only</th></tr></thead><tbody><tr><td width="40%" class="features">Edit/Delete Site</td><td class="no" width="15%"><i class="fa fa-times" aria-hidden="true"></i></td></tr><tr><td width="40%">Add/Edit/Delete Devices</td><td class="no" width="15%"><i class="fa fa-times" aria-hidden="true"></i></td></tr><tr><td width="40%">View Devices</td><td class="yes" width="15%"><i class="fa fa-check" aria-hidden="true"></i></td></tr><tr><td width="40%">Access Device Diaries</td><td class="yes" width="15%"><i class="fa fa-check" aria-hidden="true"></i></td></tr></tbody></table>');

				     		} else if(data == 'waiting') {
				     			$('.button-class').removeClass('btn-success').addClass('btn btn-danger').html('Request Sent').removeAttr('id').attr('disabled', 'disabled');
				     			$('.callout').removeClass('callout-info').addClass('callout-warning');
				     			$('.callout-heading').html('Still You didn\'t got the aproove!');

				     		} else if(data == 'reject') {
				     			$('.button-class').removeClass('btn-success').addClass('btn btn-danger').html('Request Rejected').removeAttr('id').attr('disabled', 'disabled');
				     			$('.callout').removeClass('callout-info').addClass('callout-warning');
				     			$('.callout-heading').html('Your request has been rejected!');				     				
							} else {
								$('.button-class').hide();
								$('#button-private').show().addClass('btn btn-danger').html('Request Permission').removeAttr('disabled').click(function(e) {
				     				e.preventDefault();

				     				$.ajax({
				     					url:'requestPermission.php',
				     					type: 'post',
				     					data: { 'requester' : user_id, 'code' : site_id },
				     					success: function(data) {
											$('#button-private').html('Request Sent').attr('disabled', 'disabled');
											//$.ajax(data);
				     					}
				     				});
				     			});
				     			$('.callout').removeClass('callout-info').addClass('callout-warning');
				     			$('.callout-heading').html('You Have To Request Permission!');
				     			$('.pricing-table').html('<table class="table table-bordered table-striped"><thead><tr><th width="40%">Feature</th><th width="15%">No Access</th></tr></thead><tbody><tr><td width="40%" class="features">Edit/Delete Site</td><td class="no" width="15%"><i class="fa fa-times" aria-hidden="true"></i></td></tr><tr><td width="40%">Add/Edit/Delete Devices</td><td class="no" width="15%"><i class="fa fa-times" aria-hidden="true"></i></td></tr><tr><td width="40%">View Devices</td><td class="no" width="15%"><i class="fa fa-times" aria-hidden="true"></i></td></tr><tr><td width="40%">Access Device Diaries</td><td class="no" width="15%"><i class="fa fa-times" aria-hidden="true"></i></td></tr></tbody></table>');				     					 
							}	     					
	     				}     				
	     			});
	     		}
	     	}
	     });
	});

	//modal window click for insert device

	var timer = null;

	$('input[name="device_code"]').keyup(function() {
		
		var deviceNum = $(this).val();

		//alert(deviceNum);

		$.ajax({
			url: 'deviceSearch.php',
			type: 'post',
			data: { 'deviceNum' : deviceNum },
			success:function(data) {

				//alert(data);
				if(data == 'no'){
					$('#spanResult').html('<img src="images/clock.gif" alt="searching">');
					clearTimeout(timer);
					timer = setTimeout(function() { 
						$('#spanResult').html('<i class="fa fa-thumbs-down" style="color: #d24d33;"></i>');
						//$('#spanResult').closet().addClass('check-failure');
					}, 3000);

				} else if(data == 'ok') {
					$('#spanResult').html('<i class="fa fa-thumbs-up" style="color: #82b964;"></i>');
					//$('input[name="device_code"]').toggleClass('check-success');
				}
			}
		});
	});

	$('input[name="device_code"]').keydown(function() {  clearTimeout(timer); });

	$('input[name="device_password"]').keyup(function() {
		var device_password = $(this).val();
		var deviceNum = $('input[name="device_code"]').val();

		$('#spanResultPassword').html('<img src="images/clock.gif" alt="searching">');

		clearTimeout(timer);
		timer = setTimeout(function() { 

			$.ajax({
				url: 'deviceCheck.php',
				type: 'post',
				data: { 'deviceNum' : deviceNum, 'device_password' : device_password },
				success:function(data){
					if(data == 'correct') {
						$('#spanResultPassword').html('<i class="fa fa-thumbs-up" style="color: #82b964;"></i>');
					} else {
						$('#spanResultPassword').html('<i class="fa fa-thumbs-down" style="color: #d24d33;"></i>');				
					}
				}				
			});

		}, 2000);
	});

	$('input[name="device_password"]').keydown(function() {  clearTimeout(timer); });


	//notification ajax call respond
	$(document).on("click", "#notify-command", function () {

		//e.preventDefault();

		var access = $(this).data('access');
		var notify_id = $(this).data('notify-id');

		// alert(access);
		// alert(notify_id); 

		$.ajax({
			url: 'notification.php',
			type: 'post',
			data: { 'user_id' : user_id, 'access' : access, 'id' : notify_id },
			success:function(data) {
				$(this).parent().parent().parent().addClass('viewed');
				$.alert('done');					
			}
		});	
	});

	//notification ajax call success message
	$(document).on("click", "#respond-notify-command", function () {

		//e.preventDefault();

		var notify_id = $(this).data('notify-id');

		// alert(access);
		//alert(notify_id); 

		$.ajax({
			url: 'notification.php',
			type: 'post',
			data: { 'id' : notify_id },
			success:function(data) {
				$.alert('done');				
			}
		});	
	});

	//site details update
	$(document).on("click", ".site-update-modal", function () { 

		var site_code = $(this).data('id');	

		$('#siteUpdateSubmit').click(function(e) {
			e.preventDefault();

			var siteName = $('input[name="site_name_update"]').val();
			var siteLocation = $('input[name="site_location_update"]').val();
			var siteDescription = $('textarea[name="site_description_update"]').val();

			$.ajax({
				url: 'siteUpdate.php',
				type: 'post',
				data: { 'siteCode' : site_code, 'siteName' : siteName, 'siteLocation' : siteLocation, 'siteDescription' : siteDescription },
				success:function(data){
					$('#updatemsg').addClass('label label-success').html(data);
					location.reload();
				}
			});
		});
	});	

	//profile details view
	$(document).on("click", ".profile-call", function () { 
		var user = $(this).data('id');

		$.ajax({
			url: 'profileDetails.php',
			type: 'post',
			dataType: 'json',
			data: { 'user_id' : user },
			success:function(data) {
				$('input[name="first_name"]').val(data.firstname);
				$('input[name="last_name"]').val(data.lastname);
				//$('input[name="email"]').val(data.email_address);
				$('input[name="designation"]').val(data.designation);
				$('input[name="work"]').val(data.work_place);
			}
		});
	});

	//profile details update
	$(document).on("click", ".profile-call", function () { 
		var user = $(this).data('id');
		var email = $(this).data('email-id');

		$('#profileUpdateSubmit').click(function(e) {
			e.preventDefault();

			var firstname = $('input[name="first_name"]').val();
			var lastname = $('input[name="last_name"]').val();
			//var email_address = $('input[name="email"]').val();
			var designation = $('input[name="designation"]').val();
			var work_place = $('input[name="work"]').val();

			// if(email_address != email) {
			// 	hashCode = 1;
			// } else {
			// 	hashCode = 0;
			// }

			$.ajax({
				url: 'profileUpdate.php',
				type: 'post',
				data: { 'user_id': user, 'firstname' : firstname, 'lastname' : lastname, 'designation' : designation, 'work_place' : work_place },
				success:function(data){
					$('#profileUpdatemsg').addClass('label label-success').html(data);
					location.reload();
				}
			});
		});
	});	

	//follower view
	setInterval(function() {
		$(document).on("click", ".follower-call", function () {
			var siteId = $(this).data('id');

			$.ajax({
				url: 'followerCheck.php',
				type: 'post',
				data: { 'siteId' : siteId },
				success:function(data) {	
					$('#follower-list').html(data);
				}
			});			
		});		
	}, 1000);

	//follower access type change
	$(document).on("click", "#follower-setting", function(e) {
		e.preventDefault();
		$('#access_option').show();

		var user_id = $(this).data('user');
		var site = $(this).data('site');

		$('#access_option').change(function() {

			var access_type = $(this).val();

			// alert(access_type);
			// alert(site);
			// alert(user_id);

			$.ajax({
				url: 'followerChange.php',
				tyep: 'post',
				data: { 'access_type' : access_type, 'user_id': user_id, 'site': site },
				success:function(data){
					console.log(data);
				}
			});
		});

	});

	//trend logs live update
	setInterval(function(){
		$.ajax({
			url: 'logs.php',
			type: 'post',
			dataType: 'json',
			data: { 'sensorCode' : sensorCode },
			success:function(data) {
				$('#available_logs').html(data.available_logs);
				$('#rewritten_logs').html(data.rewritten_logs);
				$('#used_logs').html(data.used_logs);
				$('#remain_logs').html(data.remain_logs);
				$('#log_data').html(data.log_data);
				$('.box-2').html(data.alarm_status);
				$('.box-4').html(data.device_status);
				$('#widget-time').html('Every ' + data.log_frequency);

				setSecond(data.time_diff);

				//alert(data.time_diff);

				var percentage;

				if(data.percentage > 100) {
					percentage = 100;
				} else {
					percentage = data.percentage;
				}

				//alert(percentage);

				$('#trend-bar').attr('aria-valuenow', percentage).css('width', percentage+'%').html(percentage+'%');
				
				// if(data.call_log == 1) {
				// 	$('#log_callout').show();
				// } else {
				// 	$('#log_callout').hide();
				// }


			}
		});
	}, 1000);

	//countdown

	function setSecond(seconds) {
		countdownSeconds = seconds;
	}

	function getSecond() {
		return countdownSeconds;
	}

	//alert(countdownSeconds);
		// $("#countdown").countdown360({
		//   radius      : 60.5,
		//   seconds     : getSecond(),
		//   strokeWidth : 10,
		//   fillStyle   : '#0276FD',
		//   strokeStyle : '#003F87',
		//   fontSize    : 50,
		//   fontColor   : '#FFFFFF',
		//   autostart: true,
		//   startOverAfterAdding: true,
		//   smooth: true,
		//   onComplete  : function () { $("#countdown").countdown360({}).start() }
		// }).start();			

	//delete site
	$('.siteConfirm').on('click', function() {
		var site_code_no = $(this).data('site_code_no');
			$.confirm({
			    title: 'Confirmation',
			    content: 'Are you sure want to delete this site?',
			    confirmButton: 'Yes, delete',
			    cancelButton: 'No, Don\'t',
			    confirm: function(){
			        $.ajax({
						url: "delete.php",
			        	type: "post",
			        	data: { 'id' : site_code_no  , 'table' : 'site_info', 'column' : 'site_code' },
			        	success:function(data) {
				        	$.alert('This site has been deleted! and it\'s no longer exists!');
				        	location.reload(5);
				        },
				        failure:function(data) {
				        	$.alert('Something went wrong site couldn\'t be deleted!');
				        }
					});
			    },
			    cancel: function(){
			        //nothing happens
			    }
			});
	});

	//unfollow site
	$('.unfollowConfirm').on('click', function() {
		var access_code_no = $(this).data('access_code_no');
			$.confirm({
			    title: 'Confirmation',
			    content: 'Are you sure want to Unfollow this site?',
			    confirmButton: 'Yes, Unfollow',
			    cancelButton: 'No, Don\'t',
			    confirm: function(){
			        $.ajax({
						url: "unfollow.php",
			        	type: "post",
			        	data: { 'id' : access_code_no, 'table' : 'access_permission_table', 'column' : 'access_permission_code' },
			        	success:function(data) {
				        	// $.alert('This site has been deleted! and it\'s no longer exists!');
				        	location.reload(5);
				        },
				        failure:function(data) {
				        	//$.alert('Something went wrong site couldn\'t be deleted!');
				        }
					});
			    },
			    cancel: function(){
			        //nothing happens
			    }
			});
	});	

	var defaults = {
	  value: 1000, inc: 123, pace: 1000, auto: true
	};

	var c1 = new flipCounter('c1', defaults);		

});
