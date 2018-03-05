(function()
{
	document.cookie = 'init=9ra_tv';	
	if(!getData('names')) resetCharacter();
	var targets = getData('names').split(',');
	console.log(targets);
	
	
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
				console.log('do something');
			}				
		});		
	});
	
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
	}
	
})();