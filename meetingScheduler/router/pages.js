const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const sqlite = require("./sqlite.js");

const root = path.join(path.dirname(__dirname), '/pages/');
const pageList = ["timeTable","roomMng"];
/*
router.get('*',function(req,res,next)
{
	console.log(new Date().toLocaleString());
	console.log(req.ip);
	console.log(req.headers.host);
	console.log(req.headers['user-agent']);
	next();
});
*/

router.get('/',function(req,res)
{
	console.log('로그인페이지 : ' + req.session.loginId);
	if(req.session.loginId) res.redirect("/roomMng");
	else res.render(root + 'main.ejs',{page:"login"});	
});

router.get('*',function(req,res,next)
{	
	console.log('전체세션 체크 : ' + req.session.loginId);
	if(!req.session.loginId) res.redirect("/");
	else next();
});


router.get('/roomMng',function(req,res)
{
	sqlite.dbRun("SELECT * FROM ROOM_INFO",undefined,"회의실 정보 조회")
	.then((rows)=>
	{		
		console.log(rows);
		res.render(root + 'main.ejs', { page : "roomMng", data : rows});
	});	
});
router.get('/:pageName',function(req,res)
{
    const pageName = req.params.pageName;
    if (fs.existsSync(root + pageName + '.ejs') && pageList.includes(pageName))
        res.render(root + 'main.ejs', { page : pageName });
	else
		res.send('잘못된 접근 입니다.');
});
console.log(sqlite);

console.log('Page router Start ');
module.exports = router;