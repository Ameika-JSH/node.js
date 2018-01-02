const express = require('express');
const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const root = path.join(path.dirname(__dirname),'/pages/');

router.get('*',function(req,res,next)
{
	console.log(new Date().toLocaleString());
	console.log(req.ip);
	console.log(req.headers.host);
	console.log(req.headers['user-agent']);
	next();
});

router.get('/',function(req,res)
{
	res.sendFile(root + 'main.html');	
});

router.get('/:pageName',function(req,res)
{
	if(fs.existsSync(root + req.params.pageName + '.html'))
		res.sendFile(root + req.params.pageName + '.html');	
	else
		res.send('잘못된 접근 입니다.');
});


console.log('Page router Start ');
module.exports = router;