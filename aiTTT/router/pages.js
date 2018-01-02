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
	res.sendFile(root + 'tictactoe.html');	
});

console.log('Page router Start ');
module.exports = router;