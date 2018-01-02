(function()
{
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
			"inputFloor" : $("#inputFloor").val(),
			"inputRoomNo" : $("#inputRoomNo").val(),
			"inputSize" : $("#inputSize").val()
		};
		let chk = true;
		Object.keys(data).forEach(function(key)
		{
			if($("#" + key).val() == "")
			{
				validationSwal($("#" + key).attr('data-name'),key);
				chk = false;
				return;
			}
		});
		data.inputComment = $("#inputComment").val();
		if(chk) 
		{
			$.ajax(
			{
				type : 'post',
				url : "sqlite/insertRoom",
				data : data,
				success : function(result)
				{
					console.log(result);
				}
			});
		}
	});
	
	function validationSwal(str,id)
	{
		swal({
			title: str + " 미입력",
			text: str + "값을 입력 해 주십시오.",
			type: "warning",
			confirmButtonClass: "btn-warning",
			confirmButtonText: "확인"
		},
		function()
		{
			$("#" + id).focus();
		});	
	}
})();

