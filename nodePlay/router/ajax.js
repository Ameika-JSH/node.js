const express = require('express');
const router = require('express').Router();
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');


router.get('/getDics', function (req, res) {	
	var limit = req.query.limit; //
	getDics(req,res,limit);
});

router.post('/gameInputValue',function(req,res)
{
	var str = req.body.input + ' - ' + req.body.resultString + ' : ' + new Date().toLocaleString();
	console.log(str);
	fs.appendFileSync( req.body.gameName + 'Results/' + req.ip.replace(/:/g,'') + '.txt',str + '\n');
	res.send('done');
});

function getDics(req,res,pre)
{
	var rtn = [];
	var loopArr = [];
	var rowCount
	var page;
	var starts = req.query.val;
	var str = req.query.str;
	var url = "http://krdic.naver.com/search.nhn?query=" + encodeURI(starts + '*') + "&kind=keyword";
	var stringUrl = "http://krdic.naver.com/search.nhn?query=" + encodeURI(str) + "&kind=keyword";	
	
	const splint = 5;

	request(stringUrl,function(err,response,html)
	{
		if(err)
		{
			console.log(stringUrl);
			console.log(err);
			return;
		}
		var $ = cheerio.load(html);
		var searchCheck = parseInt($('em')[0].children[0].data.replace('(','').replace(')',''));
		searchCheck = isNaN(searchCheck) ? 0 : searchCheck;
		console.log(str + ' : 시작 (' + searchCheck + ')');
		if(0 == searchCheck)
		{
			res.send({cheat : 2});
			return;
		}		
		request(url,function(err,response,html)
		{
			if(err)
			{
				console.log(url);
				console.log(err);
				return;
			}
			var $ = cheerio.load(html);
			rowCount = parseInt($('em')[0].children[0].data.replace('(','').replace(')',''));
			console.log('전체 ' + rowCount + '건');
			page = parseInt(rowCount/10) + (rowCount%10 == 0 ? 0 : 1);
			
			if(pre == 0 || pre > page) pre = page;
			
			for(var i = (pre == splint ? 0 : splint);i<pre;i++)
			{
				loopArr.push(function(arr,indx,limit)
				{
					var temp = []
					url = url + "&page=" + (indx+1);
					request(url,function(err,response,html)
					{
						var $ = cheerio.load(html.replace(/<strong>/g,'').replace(/<\/strong>/g,''));
						var aArr = $('.fnt15');
						for(var j = 0; j < 10 && (indx*10) + j < rowCount; j++)
						{
							var target = aArr[j].children[0].data.split('(')[0].replace(/ /g,'');
							if(rtn.indexOf(target) == -1 &&
							   target.startsWith(starts) &&
							   target.length > 1 &&
							   !/[가-힣]*한다|헌다|되다|리다|하다|허다|대다/.exec(target))
							   /*!target.endsWith('한다') &&
							   !target.endsWith('헌다') &&
							   !target.endsWith('되다') &&
							   !target.endsWith('리다') &&
							   !target.endsWith('하다') &&
							   !target.endsWith('허다') &&
							   !target.endsWith('대다'))*/
							   {							   
								   var check = true;
								   for(var h = 0 ; h < target.length && check ; h++)
								   {
									   check = /[가-힣]*/.exec(target[h]);
								   }   
								   if(check)
									   rtn.push(target);
							   }							
						}		
						
						if(indx < limit-1)						
						{
							arr[indx+1](arr,indx+1,limit);
						}
						else
						{
							console.log(rtn.length);
							if(rtn.length == 0)
								res.send({cheat:1});
							else
								res.send({cheat : 0, data : rtn , page : page , splint : splint});
						}	
					});
				});		
			}
			loopArr[0](loopArr,0,loopArr.length);	
		});	
	});
}


console.log('Ajax router Start ');
module.exports = router;