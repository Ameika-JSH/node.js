const express = require('express');
const router = require('express').Router();
const fs = require('fs');
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('tttDb.sqlite');

db.serialize(()=>
{
	db.run("CREATE TABLE IF NOT EXISTS TTT (" + 
	"_0 varchar(10),_1 varchar(10),_2 varchar(10)," + 
	"_3 varchar(10),_4 varchar(10),_5 varchar(10)," + 
	"_6 varchar(10),_7 varchar(10),_8 varchar(10))");
});
router.get('/getDics', function (req, res) {	
	var limit = req.query.limit; //
	getDics(req,res,limit);
});

router.post('/logging',function(req,res)
{	
	console.log(req.body);
	res.send(req.body);
});

console.log('Ajax router Start ');
module.exports = router;