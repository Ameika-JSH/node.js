(function()
{
	var targets;
	var voteData = {};
	function init()
	{
		
		document.cookie = 'init=9ra_tv';	
		if(!getData('names')) resetCharacter();
		else targets = getData('names').split(',');
		
		if(getData('voteData')) voteData = JSON.parse(getData('voteData'));	
				
		
		var htmlStr = '<div class="col-sm-4">' + 
					  '<div class = "nameText">' +
					  '<p>테스트</p>' +					  
					  '<button class = "btn btn-danger calcButton" data-calc = "-1" type = "button">-</button>' +
					  '<button class = "btn btn-danger calcButton" data-calc = "1" type = "button">+</button>' +
					  '<input class = "voteValue" type = "number">' +
					  '</div>' +
				      '</div>';
					  
		for(var i = 0; i < targets.length; i++)
		{
			var obj = $(htmlStr);
			obj.find('p').html(targets[i]);
			$('#voteBoard').append(obj);			
		}
		$('#voteBoard').find('input').each(function(idx,input)
		{
			var name = $(input).siblings('p').text();		
			$(input).val(voteData[name] ? voteData[name] : defaultCount).change(voteChange);			
		});
		$('[data-calc]').click(clickCalcBtn);	
	}
	
	
	function voteChange()
	{
		voteData[$(this).siblings('p').text()] = this.value;
		setData('voteData',JSON.stringify(voteData));
	}
	
	function clickCalcBtn()
	{
		var val = $(this).data().calc;
		var count = $(this).parents('.nameText').find('input');
		count.val(parseInt(count.val()) + parseInt(val)).change();
	}
	
	$("#addButton").click(function()
	{
		doAdd().chnage();
	});
	$("#addInput").keyup(function(e)
	{
		if(e.keyCode == 13) doAdd().change();
	});
	
	function doAdd()
	{		
		var str = $("#addInput").val();
		var chk = true;
		var count = false;
		var rtn;
		
		if(str.includes(piv))
		{
			count = parseInt(str.split(piv)[1]);
			str = str.split(piv)[0];
		}
		
		$("#addInput").val('');
		$('.nameText p').each(function(idx,p)
		{
			if(str == p.innerHTML)
			{
				var input = $(p).siblings('input');				
				var from  = input.val();
				rtn = input.val(count ? count : parseInt(input.val()) + 1);
				var to  = input.val();
				showToast(str,from,to);
				chk = false;
				return false;
			}						
		});		
		if(chk)
		{
			var htmlStr = '<div class="col-sm-4">' + 
				  '<div class = "nameText">' +
				  '<p>' + str + '</p>' +					  
				  '<button class = "btn btn-danger calcButton" data-calc = "-1" type = "button">-</button>' +
				  '<button class = "btn btn-danger calcButton" data-calc = "1" type = "button">+</button>' +
				  '<input class = "voteValue" type = "number">' +
				  '</div>' +
				  '</div>';
			var obj = $(htmlStr);
			var val = (count ? count : 1);
			rtn = obj.find('input').val(val).change(voteChange).change();			
			$('#voteBoard').append(obj);	
			obj.find('[data-calc]').click(clickCalcBtn);	
			
			
			targets.push(str);
			showToast(str,0,val);
			setData('names',targets.join(','));
		}
		return rtn;
	}
	
	function showToast(name,from,to)
	{
		$.notify(
		{
			title:name,
			message : from + '→' + to			
		},
		{
			newest_on_top : true,
			placement : 
			{
				align : 'left'
			},
			animate : 
			{
				enter : 'flipInX animated',
				exit : 	'hinge'
			}
		});
	}
	
	$("#resetButton").click(function()
	{
		swal({
			title: "투표 정보를 초기화 하시겠습니까?",			
			icon: "warning",
			buttons :
			{
				confirm :
				{
					text : "예",
					className : "btn btn-lg btn-danger"
				},
				cancel : 
				{					
					text : "아니오",
					visible : true,
					className : "btn btn-lg btn-danger"
				}
			}
		})
		.then(function(confirm)
		{
			if(confirm)
			{
				resetVote();				 
			}				
		});		
	});
	
	$("#selectionButton").click(function()
	{
		var character = $('.nameText');
		var voteBucket = [];
		character.each(function(idx,cha)
		{
			var name = $(cha).find('p').html();
			var count = $(cha).find('input').val();			
			for(var i = 0; i < count; i++) voteBucket.push(name);
		});
		
		var length = voteBucket.length;
		if(length == 0)
			swal('투표된 캐릭터가 없습니다.')
		else
		{
			var loop = 20;
			swal(voteBucket[getRand(length)]);
			textRolling($(".swal-text"),voteBucket,length,0,loop);
		}
	});
	
	function textRolling(target,list,length,count,loop)
	{
		var duration = 100;
		
		setTimeout(function()
		{
			if(count < loop)
			{
				target
				.html(list[getRand(length)])
				.css('font-size',5 + getRand(loop));
				textRolling(target,list,length,count+1,loop);
			}
			else
			{
				target
				.html(list[getRand(length)])
				.css('font-size','50px')
				.hide()
				.fadeIn(5000);
			}
		},duration);
		
	}
	
	function getRand(length)
	{
		return parseInt((Math.random() * 10000)) % length;				
	}
	
	$("#rateButton").click(function()
	{
		var str = '';
		var base = 0;
		var list = [];
		$(".nameText").each(function(idx,div)
		{
			base += parseInt($(div).find('input').val());
		});
		
		$(".nameText").each(function(idx,div)
		{
			var rate = base == 0 ? 0 : 	parseInt($(div).find('input').val()) / base * 100;
			if(rate > 0) list.push({[$(div).find('p').html()] : rate.toFixed(2)});			
		});
		list = sort(list);
		list.forEach(function(data)
		{
			var key = Object.keys(data)[0];
			str += key + ' : ' + data[key] + '%\n';
		});
		
		swal(str);
	});
	
	function sort(list)
	{
		//merge sort. need stable
		if(list.length <= 1) return list;
		
		var half = (list.length - list.length % 2) / 2;
		var left = sort(list.slice(0, half));
		var right = sort(list.slice(half));
		var result = [];

		while (left.length && right.length) {
			if (getJsonValue(left[0]) >= getJsonValue(right[0])) result.push(left.shift());
			else result.push(right.shift());
		}

		return result.concat(left, right);
	}
	
	function getJsonValue(json)
	{
		var key = Object.keys(json)[0];
		return parseFloat(json[key]);
	}
	
	function setData(name,value)
	{
		if(localStorage)
		{
			localStorage[name] = value;
		}
		else if(document.cookie != '')
		{
			document.cookie = escape(name) + '=' + escape(value);
		}
		else
		{
			alert('쿠키, 로컬저장소 모두 사용 할 수 없습니다. 가급적 크롬을 사용 해 주세요.');
		}
	}
	
	function getData(name)
	{
		if(localStorage)
		{
			return localStorage[name];
		}
		else if(document.cookie != '')
		{
			return document.cookie.split(escape(name)+'=')[1].split(';')[0];
		}
		else
		{
			alert('쿠키, 로컬저장소 모두 사용 할 수 없습니다. 가급적 크롬을 사용 해 주세요.');
		}
	}
	
	function resetCharacter()
	{		
		setData('names',names.join(','));		
		targets = getData('names').split(',');		
	}
	
	function resetVoteData()
	{
		voteData = {};
		setData('voteData',JSON.stringify(voteData));
	}
	
	function resetVote()
	{
		$("#voteBoard").html('');
		resetCharacter();
		resetVoteData();
		init();
	}
	
	init();
})();