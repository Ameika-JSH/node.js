const express = require('express');
const router = require('express').Router();
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

let dbRun = (query,param,msg,res)=>
{	
	return new Promise((resolve,reject)=>
	{
		const db = new sqlite3.Database('office.sql');
		if(param)
		{
			Object.keys(param).forEach(function(key)
			{
				query = query.replace("?" + key,'"' + param[key] + '"');
			});
		}
		console.log('dbRun : ' + query);
		db.serialize(function() 
		{
			db.all(query,function(err,rows)
			{
				db.close(()=>{console.log(msg);});
				if(err)
				{
					console.error(err);
					reject(err);
				}
				else if(rows){					
					console.log(rows);
					resolve(rows);
				}
				else
				{
					console.log("no rows - " + JSON.stringify(arguments));
					resolve(true);
				}
				;			
			});
		});
	});
}



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

console.log('Sqlite router Start ');


dbRun("CREATE TABLE IF NOT EXISTS ROOM_INFO " + 
		 "(" +
		 "OFFICE TEXT," + 
		 "ROOM TEXT," +
		 "SIZE NUMBER," +
		 "COMMENT TEXT," +
		 "PRIMARY KEY(OFFICE,ROOM)" + 
		 ")",undefined,"ROOM_INFO 이상무")
		 .catch((err)=>{console.log(err);});
		 
		 
dbRun("CREATE TABLE IF NOT EXISTS EMP_INFO " + 
		 "(" +
		 "ID TEXT PRIMARY KEY," + 
		 "PW TEXT," +
		 "NAME TEXT," +
		 "OFFICE TEXT," +
		 "GRADE TEXT," +
		 "PART TEXT" +
		 ")",undefined,"EMP_INFO 이상무")
		 .catch((err)=>{console.log(err);});
		 
dbRun("CREATE TABLE IF NOT EXISTS MEETING_LIST " + 
	  "(" +
	  "MEETING_NO INTEGER PRIMARY KEY AUTOINCREMENT," +
	  "OFFICE TEXT," +
	  "ROOM TEXT," +
	  "MEETING_TITLE TEXT," + 
	  "DATE TEXT," + 
	  "START_TIME TIME," + 
	  "END_TIME TIME," +
	  "START_CODE INTEGER," + 
	  "END_CODE INTEGER," +
	  "FOREIGN KEY(OFFICE,ROOM) REFERENCES ROOM_INFO(OFFICE,ROOM)" +
	  ")",undefined,"MEETING_LIST 이상무")
	  .catch((err)=>{console.log("MEETING_LIST : " + err);});
	  
dbRun("CREATE TABLE IF NOT EXISTS MEETING_MEMBER " + 
	  "(" +
	  "MEETING_NO INTEGER," +
	  "ID TEXT," +
	  "FOREIGN KEY(MEETING_NO) REFERENCES MEETING_LIST(MEETING_NO) " +
	  ")",undefined,"MEETING_MEMBER 이상무")
		.catch((err)=>{console.log("MEETING_MEMBER : " + err);});
		 /*
dbRun("SELECT * FROM ROOM_INFO",undefined,"ROOM_INFO 확인")
.then((rows)=>{console.log(rows);});*/


exports.dbRun = dbRun;