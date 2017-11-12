
$(document).ready(function(){
	var turn = 0;
	var mark = ['O','X'];
	var board = [];
	var name = [];
	$("#startButton").click(function()
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
	});
	
	$("td").click(function()
	{
		board[$(this).attr('id')] = turn;
		$(this).html(mark[turn]);
		winCheck(board,turn,name);
		turn = (turn+1)%2;
	});
	
	$("#fileName").keydown(function()
	{
		
		if(event.keyCode == 13)
		{
			$.ajax({
				type : 'GET',
				url : '/fileRead',
				data : { fileName : $(this).val() },
				success : function(data)
				{
					$("#fileData").val(data);
				}
			});
		}
	});
	
	$("#fileWrite").click(function()
	{
		$.ajax({
			type : 'POST',
			url : '/fileWrite',
			data : { fileName :$("#fileName").val() , fileData : $("#fileData").val() },
			success : function(data)
			{
				alert(data);
				console.log(data);
			}
		});
	});
	
	$("#fileList").click(function()
	{
		$.ajax({
			type : 'GET',
			url : '/fileList',
			success : function(data)
			{
				console.log(data);
			}
		});
	});

	$("#fileDelete").click(function()
	{
		$.ajax({
			type : 'POST',
			url : '/fileDelete',
			data : { fileName :$("#fileName").val()},
			success : function(data)
			{
				alert(data);
				console.log(data);
			}
		});
	});

	var comAns = undefined;
	var comAnsArr = {};
	$("#shiritoriInput").keydown(function()
	{
		shiritoriPlay(event,this);
	});
		
		
		
	var baseballAnswer = null;
	var trial = 0;
	$("#baseballInput").keydown(function()
	{
		baseballPlay(event,this);
	});

	function shiritoriPlay(event,thisInput)
	{	
		if(event.keyCode == 13)
		{
			var inputAns = $(thisInput).val();
			if(comAns == undefined || lastChar(comAns) == inputAns[0])
			{
				$("#shiritoriResult").append('<p class = "human">지구인 : ' + inputAns + '</p>');
				if(comAnsArr[lastChar(inputAns)] == undefined)
				{
					$("#loading").css('display','block');
					$("#shiritoriInput").attr('disabled','true');
					$.ajax(
					{
						url : '/getDics',
						type : 'GET',
						data : {val : lastChar(inputAns),str : inputAns},
						success : function(json)
						{
							console.log(json);
							if(json.cheat == 1)
							{
								$("#shiritoriResult").append('<p class = "computer">컴퓨터 : 없는 끝글자를 쓰다니 비겁하다!</p>');	
								shiritoriEnd(2);
							}
							else if(json.cheat == 2)
							{									
								$("#shiritoriResult").append('<p class = "computer">컴퓨터 : 그건 없는 단어야!</p>');	
								shiritoriEnd(2);
							}
							else
							{
								data = json.data;
								comAnsArr[lastChar(inputAns)] = data;
								
								if(comAnsArr[lastChar(inputAns)].length == 0)
								{
									$("#shiritoriResult").append('<p class = "computer">컴퓨터 : 내가 졌다....</p>');
									shiritoriEnd(1);
								}
								else
								{
									comAns = comAnsArr[lastChar(inputAns)].pop();
									$("#shiritoriResult").append('<p class = "computer">컴퓨터 : ' + comAns + '</p>');									
								}
							}		
									
							$("#shiritoriInput").removeAttr('disabled');
							$("#loading").css('display','none');
							$("#shiritoriInput").focus().val('');
						}
					});										
				}
				else
				{					
					if(comAnsArr[lastChar(inputAns)].length == 0)
					{
						$("#shiritoriResult").append('<p class = "computer">컴퓨터 : 내가 졌다....</p>');
						shiritoriEnd(1);
					}
					else
					{
						comAns = comAnsArr[lastChar(inputAns)].pop();
						$("#shiritoriResult").append('<p class = "computer">컴퓨터 : ' + comAns + '</p>');
						$("#shiritoriInput").focus().val('');
					}
				}
			}
			else
			{
				alert('다음 단어의 시작은 "' + lastChar(comAns) + '" 입니다.');
			}
		}
		$("html").scrollTop($("#baseballInput").offset().top);
	}
	
	function baseballPlay(event,thisInput)
	{		
		if(event.keyCode == 13)
		{
			if(baseballAnswer == null)
			{
				baseballAnswer  = [];
				var check = [];
				for(var i = 0 ; i < 3 ; i++)
				{
					var temp = parseInt(Math.random()*10); 
					while(check[temp] != undefined || temp == 0) temp = parseInt(Math.random()*10); 
					check[temp] = 1;
					baseballAnswer.push(temp);
				}
			}
			var input = parseInt($(thisInput).val());
			if(input <100 || input > 999 || isNaN(input))
			{
				alert('3자리 숫자를 입력 해 주세요');
			}
			else
			{	
				var inputAnswer = [];
				for(var i = 2 ; i >= 0 ; i--)
				{
					inputAnswer[i] = input%10;
					input = parseInt(input/10);
				}
				var strike = 0;
				for(var i = 0 ; i < 3 ; i++ )
				{
					if(baseballAnswer[i] == inputAnswer[i]) strike++;
				}
				var ball = 0;
				for(var i = 0 ; i < 3 ; i++ )
				{
					for(var j = 0 ; j < 3 ; j++ )
					{
						if(baseballAnswer[i] == inputAnswer[j] && i != j)
						{
							ball++;
							break;
						}
					}
				}
				trial++;
				var resultString = '' + trial + '차 시도 : ' + inputAnswer[0] + inputAnswer[1] + inputAnswer[2] + ' - ' +strike + 'Strike  ' + ball + 'Ball';
				if(strike == 3) resultString += '   승리!!'; 
				$.ajax({
					type : 'POST',
					url : '/gameInputValue',
					data : { val : $(thisInput).val(), resultString : resultString},
					success : function(data){console.log(data);}
				});
				$("#baseballResult").append('<p class = "baseball">' + resultString  + '</p>');
				$("#baseballInput").focus().val('');
				$("html").scrollTop($("html").height());
				if(strike == 3) baseballEnd();
			}			
		}
	}


	function shiritoriEnd(win)
	{
		var resultJson;
		if(win == 1) 
		{
			$("#shiritoriResult").append('<p class = "human">지구인 승리!!</p>');
			$.ajax(
			{
				url : '/shiritoriResult',
				type : 'POST',
				data : {val : 'win'},
				async : false,
				success : function(data){resultJson = data;}
			});
		}
		else
		{
			$("#shiritoriResult").append('<p class = "computer">컴퓨터 승리!!</p>');
			$.ajax(
			{
				url : '/shiritoriResult',
				type : 'POST',
				data : {val : 'lose'},
				async : false,
				success : function(data){resultJson = data;}
			});
		}
		
		
		$("<p id = 'restartMsg'>게임이 다시 시작됩니다....( " + resultJson.win + "승 " + resultJson.lose + "패 )</p>").insertAfter('#shiritoriInput');
		$("#restartMsg").css('display','block');
		$("#shiritoriInput").attr('disabled','true').unbind().val('');
		$("html").scrollTop($("#baseballInput").offset().top);
		var i = 0;
		var interval = setInterval(function()
		{
			if(i == 5)
			{
				clearInterval(interval);
				$("#endCount").remove();
				$(".human").remove();
				$(".computer").remove();			
				comAns = undefined;
				comAnsArr = {};
				$("#shiritoriInput").removeAttr('disabled').keydown(function(){shiritoriPlay(event,this);});;
				$("#restartMsg").remove();
			}
			else
			{
				$("#endCount").remove();
				$("<p id = 'endCount'>" + (5-(i++)) + "</p>").insertAfter('#restartMsg');
				$("#endCount").fadeOut(1000);
				if(i ==1) $("html").scrollTop($("#baseballInput").offset().top);
			}
		},1000);
	}

	function baseballEnd()
	{	
		$("<p id = 'restartMsg'>게임이 다시 시작됩니다....</p>").insertAfter('#baseballInput');
		$("#baseballInput").attr('disabled','true').val('');
		$("html").scrollTop($("html").height());	
		var i = 0;
		var interval = setInterval(function()
		{
			if(i == 5)
			{
				clearInterval(interval);
				$(".baseball").remove();	
				var baseballAnswer = null;
				var trial = 0;
				$("#baseballInput").removeAttr('disabled').keydown(function(){baseballPlay(event,this);});;;
				$("#restartMsg").remove();
			}
			else
			{
				$("#endCount").remove();
				$("<p id = 'endCount'>" + (5-(i++)) + "</p>").insertAfter('#restartMsg');
				$("#endCount").fadeOut(1000);
				if(i ==1) $("html").scrollTop($("html").height());		
			}
		},1000);
	}
	function lastChar(str)
	{
		return str[str.length - 1];
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
