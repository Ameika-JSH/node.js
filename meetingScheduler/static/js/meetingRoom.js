
(function()
{
	'use strict'
	const pageName = $("#pageName").val();
	function init()
	{
		btnRoomDelete();
		btnRoomUpdate();
		tooltipInit();
		$(".tooltip").remove();
	}
	
	$("#toggleBtn").click(function()
	{
		let btn = this;
		$(".meetingRoomPicker").animate({height:'toggle'},
		function()
		{
			let up = '<i class="fa fa-chevron-up"></i>';
			let down = '<i class="fa fa-chevron-down"></i>'
			$(btn).html() == up ? $(btn).html(down) : $(btn).html(up);
		});
	});
	
	$("#btnRoomInsert").click(function()
	{		
		spinnerToggle();
		let data = {
			"inputOffice" : $("#inputOffice").val(),
			"inputRoom" : $("#inputRoom").val(),
			"inputSize" : $("#inputSize").val()
		};
		let chk = true;
		Object.keys(data).forEach(function(key)
		{
			if(chk && $("#" + key).val() == "")
			{
				console.log($("#" + key).attr('name'));
				validationSwal($("#" + key).attr('name'),'#' + key);
				chk = false;
			}
		});
		data.inputComment = $("#inputComment").val() == "" ? "-" : $("#inputComment").val();
		if(chk) 
		{
			$.ajax(
			{
				type : 'post',
				url : "ajax/roomInfo",
				data : data,
				success : function(result)
				{
					if(result)
					{
						roomTableRefresh();
						$("main input").val('');
						sucSwal('입력');
					}
					else
						errSwal('입력');
					spinnerToggle();
				}
			});
		}
		spinnerToggle(-1);
	});
	
	$("#btnLogin").click(function()
	{
		spinnerToggle();
		let data = {
			"inputId" : $("#inputId").val().toLowerCase(),
			"inputPw" : $("#inputPw").val()
		}
		let chk = true;
		Object.keys(data).forEach(function(key)
		{
			if(chk && $("#" + key).val() == "")
			{
				console.log($("#" + key).attr('name'));
				validationSwal($("#" + key).attr('name'),'#' + key);
				chk = false;
			}
		});

		let url;
		let ajaxCallback;
		if(pageName == "login")
		{
			url = "ajax/login";
			ajaxCallback = function(result)
			{
				if(result) location.href = result;
				else errSwal('로그인','로그인 정보가 일치하지 않습니다.');
				spinnerToggle();
			}
		}
		else
		{
			url = "ajax/join";
			ajaxCallback = function(result)
			{
				console.log(result);
				spinnerToggle();
			}
		}
		if(chk)
		{
			$.ajax(
			{
				type : 'post',
				url : url,
				data : data,
				success : ajaxCallback
			});
		}
		spinnerToggle(-1);
	});	
	
	$("#inputId").keydown(function(e)
	{
		if(event.keyCode == 13) $("#inputPw").focus();
	});
	$("#inputPw").keydown(function(e)
	{
		if(event.keyCode == 13) $("#btnLogin").click();
	});
	
	
	$(".btnOffice").click(function()
	{		
		spinnerToggle();
		let btnBlack = 'btn-black';
		let btnOutlineBlack = 'btn-outline-black';
		if($(this).is('.'+btnBlack))
		{	
			btnToggle(this,'btnOffice',btnBlack,btnOutlineBlack);
			$(".timePicker").animate({height:'hide'});
			$(".btnOffice." + btnOutlineBlack).removeClass(btnOutlineBlack).addClass(btnBlack);
			$(this).removeClass(btnBlack).addClass(btnOutlineBlack);
			$.ajax(
			{
				type : 'get',
				url : 'ajax/timeTable/officeList',
				data : {office : $(this).html()},
				success : function(result)
				{
					let btnFront = "<button class='btn btn-black btnRoom'>";
					let btnsHtml ="";
					for(let i = 0,limit = result.length ; i<limit;i++)
					{
						btnsHtml += btnFront + result[i].ROOM + '</button>';
					}
					$("#divRoom").html(btnsHtml);
					$(".btnRoom").click(function()
					{
						btnToggle(this,'btnRoom',btnBlack,btnOutlineBlack);
						$(".timePicker").animate({height:'show'});
					});
					$(".roomPicker").animate({height:'show'})
					spinnerToggle(-1);
				}
			});			
		}
		spinnerToggle(-1);
	});
	
	$(".reserved").mouseenter(function()
	{
		console.log(event);
		$("#spanHover").css('display','block');
	});
	
	
	$(".reserved").mousemove(function()
	{
		$("#spanHover")
		.css('left',event.x+10)
		.css('top',event.y+10);
	});
	
	$(".reserved").mouseout(function()
	{
		console.log(event);
		$("#spanHover").css('display','none');
	});

	if($("#pageName").val() == "timeTable")
	{
		datePicker.datepicker().on('changeDate',function(e)
		{ 		
			spinnerToggle();		
			let data = {};
			data.office = $("#divOffice .btn-outline-black").html();
			data.room = $("#divRoom .btn-outline-black").html();
			data.date = e.date.toLocaleDateString();
			if(!Object.values(data).includes(undefined))
			{
				$.ajax(
				{
					type : 'get',
					url : 'ajax/timeTable/reserveList',
					data : data,
					success : function(result)
					{
						console.log(result);
						let timeHtml;
						timeHtml = 
								"<table align='center'>" +								
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" + 
								"<tr><td>0</td><td><button class = 'btn btn-green'>9시</button></td></tr>" +
								"</table>";
						$("#divTime").html(timeHtml);
						spinnerToggle();
					}
				});
			}
		});
	}
	
		
	
	function btnToggle(thisBtn,btnClass,btnColor,btnOutline)
	{
		$("." + btnClass + "." + btnOutline).removeClass(btnOutline).addClass(btnColor);
		$(thisBtn).removeClass(btnColor).addClass(btnOutline);		
	}
	
	
	function btnRoomDelete()
	{
		$(".btnRoomDelete").click(function()
		{
			let btn = $(this);
			let data = btn.parent().data();
			swal({
				title: "삭제 확인",
				text: data.office + "호 - " + data.room + "\n삭제 하시겠습니까?",
				type: "warning",
				showCancelButton: true,
				confirmButtonClass: "btn-warning",
				confirmButtonText: "확 인",
				cancelButtonText: "취 소",
				cancelButtonClass: "btn-outline-danger",
				closeOnConfirm: false
			},
			function(isConfirm)
			{
				if(isConfirm)
				{
					$.ajax(
					{
						type : 'delete',
						url : "ajax/roomInfo",
						data : data,
						success : function(result)
						{
							if(result)
							{
								btn.parents('tr').remove();
								sucSwal('삭제');
							}
							else 
								errSwal('삭제');
						}
					});
				}
			});	
		});
	}
	
	function btnRoomUpdate()
	{
		$(".btnRoomUpdate").click(function()
		{
			let typeNumber = ['office','size'];
			let jqObj = $(this).html('저장').removeClass('btn-warning').addClass('btn-outline-success').unbind().click(doRoomUpdate)
			.parents('tr').find('td:not(.tdButtons)');
			
			for(let i = 0, td = jqObj[0]; i < jqObj.length ; i++, td=jqObj[i])
			{
				let input = $("<input>").attr('class','inputRoomInfo');
				let oldValue;
				if(typeNumber.includes($(td).attr('class'))) 
				{
					input.attr('type','number');
					oldValue = parseInt($(td).html());
				}
				else 
					oldValue = $(td).html();
					
				input.val(oldValue);
				$(td).attr('data-old-value',oldValue).html(input);
			}
		});
	}
	
	function doRoomUpdate()
	{
		spinnerToggle();
		let data = {}
		let jqObj = $(this).parents('tr').find('td:not(.tdButtons)');
		
		for(let i = 0, td = jqObj[0]; i < jqObj.length ; i++, td=jqObj[i])
		{
			data[$(td).attr('class').split(' ')[0]] = $(td).find('input').val();
			data['old-' + $(td).attr('class').split(' ')[0]] = $(td).attr('data-old-value');
		}
		
		console.log(data);
		$.ajax(
		{
			type : 'put',
			url : "ajax/roomInfo",
			data : data,
			success : function(result)
			{
				if(result)
				{
					roomTableRefresh();
					sucSwal('수정');
				}
				else
					errSwal('수정');
				spinnerToggle();
			}
		});
	}
	
	function validationSwal(str,selector)
	{		
		swal({
			title: str + " 미입력",
			text: str + " 값을 입력 해 주십시오.",
			type: "input",
			confirmButtonClass: "btn-warning",
			confirmButtonText: "확 인",
			inputPlaceholder: "값 입력",
			inputType : $(selector).attr('type')
		},
		function(input)
		{
			if(input) $(selector).val(input);
			resolve(input);
		});	
	}
	
	function strFormat(str,param)
	{
		Object.keys(param).forEach(function(key)
		{
			str = str.split("?" + key).join(param[key]);
		});
		return str;
	}
	
	function errSwal(act,inputText)
	{
		let text;
		if(inputText) text = inputText;
		else text = act + "도중 에러가 발생하였습니다.";
		
		swal({
				title: act + " 실패",
				text: text,
				type: "error",
				confirmButtonClass: "btn-danger",
				confirmButtonText: "확 인"
			});
	}
	
	function sucSwal(act)
	{
		swal({
				title : '\n' + act + " 완료",
				type: "success",
				confirmButtonClass: "btn-success",
				confirmButtonText: "확 인"
			});
	}
	
	function roomTableRefresh()
	{
		$.ajax(
		{
			url : "ajax/roomInfo",
			success : function(result)
			{
				let tr = "<tr>" +
							"<td class = 'office' name = '사무실 이름'>?OFFICE</td>" +
							"<td class = 'room' name = '회의실이름' data-toggle='tooltip' data-placement='top' title='?ROOM'>?ROOM</td>" +
							"<td class = 'size' name = '수용인원'>?SIZE명</td>" +
							"<td class = 'comment ar' data-toggle='tooltip' data-placement='top' title='?COMMENT'>?COMMENT</td>" +
							"<td class = 'tdButtons' data-office = '?OFFICE' data-room = '?ROOM'>" +
								"<button class = 'btn btn-sm btn-warning btnRoomUpdate'><i class='fa fa-edit'></i></button>" +
								"<button class = 'btn btn-sm btn-danger btnRoomDelete'><i class='fa fa-trash-o'></i></button>" +
							"</td>"
						"</tr>";
				let tbody = '';
				for(let i=0,data=result[0];i<result.length;i++,data=result[i])
				{
					tbody += strFormat(tr,data);
				}
				$("#roomInfoTable tbody").html(tbody);
				init();
			}
		});
	}	
	
	function tooltipInit()
	{
		$("[data-toggle]").tooltip();
	}
	
	function spinnerToggle(val)
	{
		if(!val) $('#divSpinner').css('z-index',-1 * $('#divSpinner').css('z-index'));
		else $('#divSpinner').css('z-index',val);
	}
	
	init();
})();

