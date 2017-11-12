
$(document).ready(function(){
	var turn = 0;
	var mark = ['O','X'];
	var board = [];
	var name = [];
	
	$("#oName")
	.focus()
	.keydown(function()
	{
		if(event.keyCode == 13)
		{			
			$("#xName")
			.focus()
			.keydown(function()
			{
				if(event.keyCode == 13) gameStart();
			});
		}
	});
	
	$("#startButton").click(function()
	{
		gameStart();
	});
	
	$("td").click(function()
	{
		board[$(this).attr('id')] = turn;
		$(this).html(mark[turn]);
		winCheck(board,turn,name);
		turn = (turn+1)%2;
	});
	function gameStart()
	{
		if($("#oName").val() == "" || $("#xName").val() == "")
		{
			alert('플레이어 두명의 이름을 모두 입력 해 주세요');
		}
		else
		{
			name[0] = $("#oName").attr('disabled','true').val();
			name[1] = $("#xName").attr('disabled','true').val();
			$("button")[0].outerHTML = '';
			$("table").css('display','block');
		}
	}
	function winCheck(arr,turn,name)
	{
		if(
			(arr[0] == turn && arr[1] == turn && arr[2] == turn) ||
			(arr[3] == turn && arr[4] == turn && arr[5] == turn) ||
			(arr[6] == turn && arr[7] == turn && arr[8] == turn) ||
			(arr[0] == turn && arr[3] == turn && arr[6] == turn) ||
			(arr[1] == turn && arr[4] == turn && arr[7] == turn) ||
			(arr[2] == turn && arr[5] == turn && arr[8] == turn) ||
			(arr[0] == turn && arr[4] == turn && arr[8] == turn) ||
			(arr[2] == turn && arr[4] == turn && arr[6] == turn)
		)
		{
			$("td").unbind();
			$("#victory").html(name[turn] + '님의 승리!!!');
		}
	}
});
