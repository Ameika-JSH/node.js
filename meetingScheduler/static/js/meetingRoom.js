(function()
{
	const pageName = $("#pageName").val();
	$.fn.forEach = Array.prototype.forEach;
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
			$(btn).html() == "▲" ? $(btn).html("▼") : $(btn).html("▲")
		});
	});
	
	$("#btnRoomInsert").click(function()
	{		
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
				}
			});
		}
	});
	
	$("#btnLogin").click(function()
	{
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
				location.href = result;
			}
		}
		else
		{
			url = "ajax/join";
			ajaxCallback = function(result)
			{
				console.log(result);
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
	});	
	
	
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
			$(this).html('저장').removeClass('btn-warning').addClass('btn-outline-success').unbind().click(doRoomUpdate)
			.parents('tr').find('td:not(.tdButtons)')
			.forEach((td)=>
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
			});
		});
	}
	
	function doRoomUpdate()
	{
		let data = {}
		$(this).parents('tr').find('td:not(.tdButtons)')
		.forEach((td)=>
		{
			data[$(td).attr('class').split(' ')[0]] = $(td).find('input').val();
			data['old-' + $(td).attr('class').split(' ')[0]] = $(td).attr('data-old-value');
		});
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
	
	function errSwal(act)
	{
		swal({
				title: act + " 실패",
				text: act + "도중 에러가 발생하였습니다.",
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
				result.forEach((data)=>
				{
					tbody += strFormat(tr,data);
				});
				$("#roomInfoTable tbody").html(tbody);
				init();
			}
		});
	}	
	
	function tooltipInit()
	{
		$("[data-toggle]").tooltip();
	}
	
	init();
})();

