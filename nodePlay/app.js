const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer'); 
const dirTree = require('directory-tree');
const request = require('request');
const cheerio = require('cheerio');

const app = express();
const upload = multer();

const port = 8080;

app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./router/pages'));

const routerNames = ['shiritori','baseball','tictactoe','ajax','tetris'];
routerNames.forEach(function(data){app.use('/' + data, require('./router/' + data));});

app.listen(port,function(){console.log('nodeServer(port = ' + port + ')  Start at : ' + new Date().toLocaleString());});

/*
app.get('/ehdgoanfrhkqorentksdlakfmrhekfgehfhr',function(req,res)
{
	if(req.query.pass == '20000701')
		res.sendFile(root + '/editor.html');
	else
		res.send('잘못된 접근 입니다.');
});

app.get('/fileRead',function(req,res)
{
	var fileName = req.query.fileName;
	fs.readFile(fileName,'utf-8',function(err,data)
	{
		console.log(err);
		console.log(data);
		if(err)			
			res.send('잘못된 파일 이름');
		else
			res.send(data);
	});
});

app.get('/fileList',function(req,res)
{	
	const tree = dirTree(__dirname);
	res.send(tree);
});


app.post('/fileWrite',upload.array(),function(req,res)
{
	console.log(req.body);
	var fileName = req.body.fileName;
	var fileData = req.body.fileData;
	fs.writeFile(fileName,fileData,function(err)
	{
		if(err)					
			res.send(err);		
		else
			res.send('수정완료');
	});
});


app.post('/fileDelete',upload.array(),function(req,res)
{
	console.log(req.body);
	var fileName = req.body.fileName;
	fs.unlink(fileName,function(err)
	{
		if(err)					
			res.send(err);		
		else
			res.send('삭제완료');
	});
});*/