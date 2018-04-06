(function()
{
	var targets;
	var voteData = {};
	var createLimit = {};
	var addLimit = {};
	var sendLimit;
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
		$("#addInput").autocomplete(
		{
			source:targets,
			focus: function(event, ui) {return false;}
		});		
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
		doAdd($("#addInput").val()).chnage();
	});
	$("#addInput").keyup(function(e)
	{
		if(e.keyCode == 13) doAdd($("#addInput").val()).change();
	});
	
	function doAdd(str)
	{		
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
		var list = getRate();
		var str = '';
		for(var i = 0; i < list.length; i++)			
		{
			var key = Object.keys(list[i])[0];
			str += key + ' : ' + list[i][key] + '%\n';
		}
		swal(str);
	});
	
	function getRate()
	{
		var base = 0;
		var list = [];
		$(".nameText").each(function(idx,div)
		{
			var tmp = parseInt($(div).find('input').val());
			base += tmp > 0 ? tmp : 0;
		});
		
		$(".nameText").each(function(idx,div)
		{
			var rate = base == 0 ? 0 : 	parseInt($(div).find('input').val()) / base * 100;
			if(rate > 0) list.push({[$(div).find('p').html()] : rate.toFixed(2)});			
		});
		list = sort(list);
		return list;
	}
	
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
	
	function parseChat()
	{		
		var irc = 'wss://irc-ws.chat.twitch.tv/';
		var socket = new WebSocket(irc);
		socket.onopen = function()
		{	
			$(".vote-title").css('background-color','#2dcaca');
			socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
			socket.send('PASS oauth:z6vn9mp8qv6lrdaiz5pktxn8hzbmwd');
			socket.send('NICK 9ra_vote');
			socket.send('JOIN #9ra5646');
			setInterval(function(){socket.send('');},20000);
		};

		socket.onclose = function(data){$(".vote-title").css('background-color','#ff6868');}
		socket.onerror = function(data){console.log('error..',data);}
		socket.onmessage = function(data)
		{
			var rcv = {};
			data.data.split(';').map(function(str)
			{
				var tmp = str.split('=');
				rcv[tmp[0]] = tmp[1];
			});
						
			if(rcv['user-type'])
			{
				var userType = rcv['user-type'].split('#9ra5646 :')[1];
				var displayName = rcv['display-name']
				
				if(userType)
				{
					/*if(userType.startsWith('!영어'))
						socket.send('PRIVMSG #9ra5646 :드럽게 못하죠?');
					else if(userType.startsWith('!구라식영어'))
					{
						let sam = ['shitty game = 시프트 게임','채팅창에 영어 보인다 = 일단 헬로','ping_9 = 핑구나인','ameika = 아메리카']
						let idx = Date.now()%sam.length
						socket.send('PRIVMSG #9ra5646 :' + sam[idx]);
					}else if(userType.startsWith('!제목'))
					{
						socket.send('PRIVMSG #9ra5646 :고우키 노랑단 방송');
					}else if(userType.startsWith('!철갤'))
					{
					socket.send('PRIVMSG #9ra5646 :제 알바입니다.	');}
					if(userType.startsWith('!컷킥'))
					{
						socket.send('PRIVMSG #9ra5646 :빨강단도 컷킥만으로 이길수 있다.');
					}*/
					
					if(useViewerAdd &&  userType.startsWith(commandViewerAdd + ' ')) 
					{	
						var tmp = userType.split(commandViewerAdd + ' ')[1].replace(/(\r\n|\n|\r)/gm, "");							
						if((!voteData[tmp] || voteData[tmp] == 0))
						{
							if(targets.includes(tmp) &&
							 (!addLimit[displayName] || (new Date() - addLimit[displayName]) > viewerAddCooltime * 1000))
							{
								doAdd(tmp).change();
								addLimit[displayName] = new Date();
							}
							else if(useViewerCreate &&
										(!createLimit[displayName] || 
										 (new Date()) - createLimit[displayName] > 1000*60*viewerCreateCooltime))
							{
								doAdd(tmp).change();
								createLimit[displayName] = new Date();
							}
						}
					}
					else if(!sendLimit || new Date() - sendLimit > 1000*sendLimitSeconds)
					{						
						if(useViewerGetRank && userType.startsWith(commandViewerGetRank))
						{	
							var str = '';
							var list = getRate();
							for(var i = 0; i < list.length && i < limitViewerGetRank; i++)			
							{
								var key = Object.keys(list[i])[0];
								if(i != 0) str += ', ';
								str += key + ' : ' + list[i][key] + '%';
							}
							socket.send('PRIVMSG #9ra5646 :' + str);
							sendLimit = new Date();
						}
					}
				}
			}
		}
	}
	
	init();
	parseChat();
})();