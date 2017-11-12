
$(document).ready(function(){	
	var width = 10;
	var heigth = 20;
	var stage = [];
	var axis = [1,4];
	
	var emptyBlock = '□';
	var filledBlock = '■';
	
	for(var i = 0 ; i < heigth ; i++)
	{
		var line = [];
		for(var j = 0 ; j < width ; j++) line.push(emptyBlock);
		stage.push(line);
	}	
	
	$("p").html(drawStage(stage));
	
	
	function gameStart()
	{
		var id = (new Date().getTime() % 5) + 1;
		var block = generateBlock(id);
		var past = undefined;
		var nowState;
		
		var intvCode = setInterval(function()
		{			
			tick();
			axis[0]++;				
		},1000);
		
		$("html").keydown(function()
		{
			console.log(event.keyCode);
			switch(event.keyCode)
			{
				case 32://space
					rotate(block,true);		
					if(checkBorder(block,event.keyCode)) rotate(block,false);
					else tick();
					break;
				case 65://a
					if(checkBorder(block,event.keyCode))
					{
						axis[1]--;
						tick();
					}
					break;
				case 68://d
					if(checkBorder(block,event.keyCode))
					{
						axis[1]++;
						tick();
					}
					break;
				case 83://s
					if(checkBorder(block,event.keyCode))
					{
						axis[0]++;
						tick();
					}
					break;
					
			}
		});
		
		function tick()
		{
			nowState = block.shape[block.state];
			past = morph(nowState,past);				
			$("p").html(drawStage(stage));
			//console.log(nowState.concat([axis]));
		}
	}
	
	function morph(nowState,past)
	{
		if(past)
		{
			stage[past[0][0]][past[0][1]] = 
			stage[past[1][0]][past[1][1]] = 
			stage[past[2][0]][past[2][1]] = 
			stage[past[3][0]][past[3][1]] = emptyBlock;
		}
		
		stage[axis[0]][axis[1]] = 
		stage[axis[0] + nowState[0][0]][axis[1] + nowState[0][1]] = 
		stage[axis[0] + nowState[1][0]][axis[1] + nowState[1][1]] = 
		stage[axis[0] + nowState[2][0]][axis[1] + nowState[2][1]] = filledBlock;
		return [[axis[0],axis[1]],
					[axis[0] + nowState[0][0],axis[1] + nowState[0][1]],
					[axis[0] + nowState[1][0],axis[1] + nowState[1][1]],
					[axis[0] + nowState[2][0],axis[1] + nowState[2][1]]];
	}
	
	function drawStage(stage)
	{
		var rtn = '';
		stage.forEach(function(data)
		{
			rtn += '●' + data + '●<br>';
		});
		rtn += '●●●●●●●●●●●●';
		
		return rtn.replace(/,/g,'');
	}
	
	function blockShape(id)
	{
		switch(id)
		{
			/*case 1:// ┘┌
				return [[4,0],[4,1],[5,1],[5,2]]; 				
			case 2:// ┐└
				return [[5,0],[5,1],[4,1],[4,2]]; 				
			case 3:// ㅜ
				return [[0,5],[1,5],[2,5],[1,4]]; 				
			case 4:// ㅡ
				return [[0,3],[0,4],[0,5],[0,6]]; 				
			case 5:// ㅁ
				return [[0,4],[0,5],[1,4],[1,5]]; 		*/	
			case 1:// ┘┌
				return [[[0,-1],[-1,0],[-1,1]],[[-1,0],[0,1],[1,1]]]; 				
			case 2:// ┐└
				return [[[-1,0],[-1,-1],[0,1]],[[1,0],[0,1],[-1,1]]]; 				
			case 3:// ㅜ
				return [[[1,0],[0,-1],[0,1]],[[-1,0],[0,1],[1,0]],[[-1,0],[0,-1],[0,1]],[[-1,0],[0,-1],[1,0]]]; 				
			case 4:// ㅡ
				return [[[0,-1],[0,1],[0,2]],[[-1,0],[1,0],[2,0]]]; 				
			case 5:// ㅁ
				return [[[0,1],[1,1],[1,0]]]; 								
		}
	}
	
	function rotate(block,direction)
	{
		var len = block.shape.length;		
		block.state = (block.state+(direction ? 1 : len-1)) % len;
	}
			
	function generateBlock(id)
	{	
		var shape = blockShape(id);			
		var state = 0;
		return {id:id,shape:shape,state:state}
	}
	
	function checkBorder(block)
	{	
		var rtn = true;
		var nowPosition = [[axis[0],axis[1]]];
		block.shape[block.state].forEach(function(data)
		{
			nowPosition.push([nowPosition[0][0] + data[0] , nowPosition[0][1] + data[1]]);
		});
		var newPosition = [];
		var modifyValue = [];
		switch(event.keyCode)
		{
			case 32://space
				rtn = false;
				break;
			case 65://a
				modifyValue = [0,-1];
				break;
			case 68://d
				modifyValue = [0,1];
				break;
			case 83://s
				modifyValue = [1,0];
				break;				
		}
		nowPosition.forEach(function(data)
		{
			newPosition.push([data[0] + modifyValue[0] , data[1] + modifyValue[1]]);
		});
		console.log(nowPosition);
		console.log(newPosition);
		newPosition.forEach(function(data)
		{
			console.log(!nowPosition.includes(data))
			console.log(nowPosition.includes(data))
			console.log(!stage[data[0]] )
			console.log(stage[data[0]] )
			console.log(stage[data[0]][data[1]])
			console.log('------------------------');
			if(!nowPosition.includes(data) && (!stage[data[0]] || stage[data[0]][data[1]] != emptyBlock))
			{
				rtn = false;
			}
		});
			console.log('------------------------');
		console.log(rtn);
		return rtn;
	}
	gameStart();
});
