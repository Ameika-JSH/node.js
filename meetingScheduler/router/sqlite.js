const express = require('express');
const router = require('express').Router();
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('ms.sql');

router.post('/insertRoom', function (req, res) {	
	let param = req.body;
	if(!param.inputComment) param.inputComment = '"-"';
	console.log(param);
	dbRun("INSERT INTO ROOM_INFO VALUES(" + 
		  "?inputFloor," + 
		  "?inputRoomNo," + 
		  "?inputSize," + 
		  "?inputComment)",param,"test");
	dbAll("SELECT * FROM ROOM_INFO",undefined,"test2");
	res.send(req.body);
});

dbRun("CREATE TABLE IF NOT EXISTS ROOM_INFO " + 
		 "(" +
		 "FLOOR NUMBER," + 
		 "ROOM_NO NUMBER," +
		 "SIZE NUMBER," +
		 "COMMENT TEXT," +
		 "PRIMARY KEY(FLOOR,ROOM_NO)" + 
		 ")",undefined,"ROOM_INFO 테이블 생성");

/*db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS ROOM_INFO " + 
		 "(" +
		 "FLOOR NUMBER," + 
		 "ROOM_NO NUMBER," +
		 "SIZE NUMBER," +
		 "COMMENT TEXT," +
		 "PRIMARY KEY(FLOOR,ROOM_NO)" + 
		 ")");
}

  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  db.all("SELECT DISTINCT * FROM lorem WHERE info like $data",{$data:"Ipsum%"}, function(err,rows) {
    if(err) console.log(err);
	else console.log(rows);
  });
});

db.close(()=>{console.log("DB 종료");});
*/

function dbRun(query,param,msg)
{	
	const db = new sqlite3.Database('ms.sql');
	if(param)
	{
		Object.keys(param).forEach(function(key)
		{
			query = query.replace("?" + key,param[key]);
		});
	}
	console.log(query);
	db.run(query);
	db.close(()=>{console.log(msg);});
}

function dbAll(query,param,msg)
{	let rtnRows;
	const db = new sqlite3.Database('ms.sql');
	db.all(query,param, function(err,rows) {
		if(err) console.log(err);
		else 
		{
			console.log(rows);
			rtnRows = rows;
		}
	});
	db.close(()=>{console.log(msg);});
}

console.log('Sqlite router Start ');
module.exports = router;