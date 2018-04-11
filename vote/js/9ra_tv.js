(function()
{
	var targets;
	var voteData = {};
	var createLimit = {};
	var addLimit = {};
	var sendLimit;
	var colors = ["#FF0F00","#FF6600","#FF9E01","#FCD202","#F8FF01","#B0DE09","#04D215","#0D8ECF","#0D52D1","#2A0CD0","#8A0CCF","#CD0D74"]
	var socket;
	var twipKey = '';
	
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
				rtn = input.val(count ? parseInt(input.val()) + count : parseInt(input.val()) + 1);
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
		tts(name + (to-from) + '개 추가' );
		$.notify(
		{
			title:name,
			message :  from + '→' + to	
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
			var loop = 2;
			var itemHeight = 40;
			swal(voteBucket[getRand(length)]);
			//textRolling($(".swal-text"),voteBucket,length,0,loop);
			
			$(".swal-text").html('<div class="slottt-machine-recipe"><div class="slottt-machine-recipe__mask" id="wordbox"><div class="slottt-machine-recipe__items_container recipe_if"></div></div></div>');
			
			var wordlist = voteBucket;

			function buildSlotItem (text) {
				return $('<div>').addClass('slottt-machine-recipe__item')
								 .text(text)
			}

			function buildSlotContents ($container, wordlist) {
			  $items = wordlist.map(buildSlotItem);
			  $container.append($items);
			}

			function popPushNItems ($container, n) {
				$children = $container.find('.slottt-machine-recipe__item');
				$children.slice(0, n).insertAfter($children.last());

				if (n === $children.length) {
				  popPushNItems($container, 1);
				}
			}

			function rotateContents ($container, n) {
				  popPushNItems($container, n);
				  $container.css({top: 0});
				  
			}

			function randomSlotttIndex(max) {
			  return  (Math.random() * max | 0);
			}			  
			  
			function animate(lim) 
			{
				var wordIndex = randomSlotttIndex(wordlist.length);				
				$wordbox.animate({top: -itemHeight * wordlist.length},2000,"linear", function () 
				{
					if(lim > 1)
					{							
						rotateContents($wordbox, wordIndex);
						animate(lim-1);
					}
					else if (lim == 1)
					{
						rotateContents($wordbox, wordIndex);
						$wordbox.animate({top: -itemHeight * wordlist.length,opacity : 0}, 1400,"linear", function () 
						{
							rotateContents($wordbox, wordIndex);
							$wordbox.animate({opacity : 1},4500,function()
							{
								addLimit = {};
								var result = $(".slottt-machine-recipe__item").eq(0).text();
								
								var list = getRate();
								var sendMsg = list.filter(function(data){return Object.keys(data)[0] == result;});
								
								sendMsg  = '결과 : ' + result + '(' + sendMsg[0][result] + '%)';			
								tts(sendMsg);								
								if(socket) setTimeout(function(){socket.send('PRIVMSG #9ra5646 :' + sendMsg);},1000*10);								
							});
						});
					}
				});
			}

			(function () {
				$wordbox = $('#wordbox .slottt-machine-recipe__items_container');
				buildSlotContents($wordbox, wordlist);  				
				animate(loop);
			})()
		}
	});
	/*
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
	*/
	function getRand(length)
	{
		return parseInt((Math.random() * 10000)) % length;				
	}
	
	$("#rateButton").click(function()
	{	
		var list = getRate();
		var str = '';
		var dataProvider = [];
		
		var hUnit = 25;
		var height = 50;
		for(var i = 0; i < list.length; i++)			
		{
			var key = Object.keys(list[i])[0];
			str += key + ' : ' + list[i][key] + '%\n';
			dataProvider.push({name : key, count : list[i][key],color : colors[i%colors.length]});
			height += hUnit;
		}
		swal(str);

		$(".swal-text").attr('id','chartdiv').css('height',height + 'px');
		var chart = AmCharts.makeChart("chartdiv", {
		  "type": "serial",
		  "marginRight": 70,
		  "dataProvider": dataProvider,
		  "valueAxes": [{
				"unit" : "%",
				"position": "top",
				"title": "확률"
			}],	
		  "startDuration": 1,
		  "balloon" :
		  {
			  "enabled" : false
		  },
		  "graphs": [{
			"balloonText": "<b>[[category]]: [[value]]%</b>",
			"fillColorsField": "color",
			"fillAlphas": 0.9,
			"lineAlpha": 0.1,
			"type": "column",
			"valueField": "count",
			"labelText" : "[[value]]%"
		  }],
		  "chartCursor": {
			"categoryBalloonEnabled": false,
			"cursorAlpha": 0.1,
			"zoomable": true
		  },
		  "categoryField": "name",
		  "rotate" : true,
		  "export": {
			"enabled": false
		  }

		});
		$('[title="JavaScript charts"]').remove();
	});
	
	function getRate(n)
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
		if(!n) n = list.length;
		return list.slice(0,n);
	}
	
	$("#settingButton").click(function()
	{
		var div = $('<div>').attr('class','row');		
		Object.keys(settingData).forEach(function(data)
		{
			div.append(getSettingItem(settingDescribe[data],data,window[data]));
		});
				
		swal(div[0])
		.then(function(rcv)
		{
			if(rcv)
			{
				var inputs = $('.swal-content .row .input-group input');				
				inputs.each(function(idx,obj)
				{
					obj.type == 'checkbox'
					? settingData[obj.id] = window[obj.id] = obj.checked
					: settingData[obj.id] = window[obj.id] = obj.value;
				});
				setData('settingData',JSON.stringify(settingData));		
			}
		});
	});
	
	function getSettingItem(name,id,value)
	{
		return $('<div>').attr('class','input-group input-group-sm mb-3 col-12').html
			(
				$('<div>').attr('class','input-group-prepend').html
				(
					$('<span>').attr('class','input-group-text').html(name)
				)
			).append
			(
				typeof value == "boolean" 
				? $('<input>').attr('type','checkbox').attr('id',id).attr('class','form-control').attr('aria-label','Small').prop('checked',value)
				: $('<input>').attr('id',id).attr('class','form-control').attr('aria-label','Small').val(value)
			)	
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
	
	function doAddForViewer(isDonate,name,displayName,count)
	{
		if(isDonate || !voteData[name] || voteData[name] == 0)
		{
			if(targets.includes(name) &&
			 (isDonate || !addLimit[displayName] || (new Date() - addLimit[displayName]) > viewerAddCooltime * 1000))
			{
				if(count) name += ':' + count;
				doAdd(name).change();
				if(!isDonate) addLimit[displayName] = new Date();
			}
			else if(useViewerCreate &&
						(isDonate || !createLimit[displayName] || 
						 (new Date()) - createLimit[displayName] > 1000*60*viewerCreateCooltime))
			{
				if(count) name += ':' + count;
				doAdd(name).change();
				if(!isDonate) createLimit[displayName] = new Date();
			}
		}
	}
	
	function parseChat()
	{		
		var irc = 'wss://irc-ws.chat.twitch.tv/';
		socket = new WebSocket(irc);
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
						doAddForViewer(false,tmp,displayName);
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
							tts(str);
							sendLimit = new Date();
						}
					}
				}
			}
		}
	}
	
	function parseAlam(key)
	{
		var alamSocket = new WebSocket('wss://io.mytwip.net/socket.io/?alertbox_key=' + key + '&version=1.1.42&EIO=3&transport=websocket');
		alamSocket.onopen = function()
		{			
			alamSocket.onerror = data => console.log(data.type,data);			
			alamSocket.onclose = function(data){console.log(data.type,'reconnect...');parseAlam(twipKey);}
			alamSocket.onmessage = function(rcv)
			{
				var reg = /(\[.*\])/.exec(rcv.data);
				if(reg)
				{
					var json = JSON.parse(reg[1]);
					if(json[0] == "new donate")
					{
						var count = (parseInt(json[1].amount)/donateUnit).toFixed(0);
						var name = RegExp(donateDelimiter + '([^' + donateDelimiter + ']*)' + donateDelimiter).exec(json[1].comment)[1];
						if(count != "0")
							doAddForViewer(true,name,json[1].nickname,count);
					}
				}
			}
		}
	}
	
	function tts(text)
	{
		if(useTTS)
		{
			var audio = new Audio('https://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=0&client=tw-ob&tl=ko-kr&q=' + text);
			audio.play();								
		}
	}
		
	init();
	parseChat();
	parseAlam(twipKey);
})();