
$(document).ready(function(){
			
		
	var topBefore = '40px';	
	var topAfter = '200px';
	
	var baseballAnswer = null;
	var trial = 0;
	var msgClass = ['even','odd'];
	
	$("#baseballInput").focus().keydown(function()
	{
		baseballPlay(event,this);
	});

	
	
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
				}console.log(baseballAnswer);
			}
			var input = parseInt($(thisInput).val());
			if(input <100 || input > 999 || isNaN(input))
			{
				console.log(input);
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
					url : '/ajax/gameInputValue',
					data : { input : $(thisInput).val(), resultString : resultString , gameName : 'baseball'},
					success : function(data){console.log(data);}
				});
				
				$("#resultDiv").append('<p class = "baseball ' + msgClass[trial%2] + ' resultP">' + resultString  + '</p>');
				$("#baseballInput").focus().val('');
				$("#resultDiv").scrollTop($("#resultDiv").height());
				if(strike == 3) baseballEnd();
			}			
		}
	}

	function baseballEnd()
	{	
		$("#inputDiv").css('height',topAfter).scrollTop(0);
		$("<p id = 'restartMsg'>게임이 다시 시작됩니다....</p>").insertAfter('#baseballInput');
		$("#baseballInput").attr('disabled','true').val('');		
		var i = 0;
		var interval = setInterval(function()
		{
			if(i == 5)
			{
				clearInterval(interval);
				$(".baseball").remove();	
				baseballAnswer = null;
				trial = 0;
				$("#baseballInput").removeAttr('disabled').focus();
				$("#restartMsg").remove();
				$("#inputDiv").css('height',topBefore);
			}
			else
			{
				$("#endCount").remove();
				$("<p id = 'endCount'>" + (5-(i++)) + "</p>").insertAfter('#restartMsg');
				$("#endCount").fadeOut(1000);
			}
		},1000);
	}
});
