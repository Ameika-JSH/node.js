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
		 ")",undefined,"ROOM_INFO 이상무");
		 
		 
dbRun("CREATE TABLE IF NOT EXISTS EMP_INFO " + 
		 "(" +
		 "ID TEXT," + 
		 "PW TEXT," +
		 "NAME TEXT," +
		 "OFFICE TEXT," +
		 "GRADE TEXT," +
		 "PART TEXT," +
		 "PRIMARY KEY(ID)" + 
		 ")",undefined,"EMP_INFO 이상무");
		 
dbRun("SELECT * FROM ROOM_INFO",undefined,"ROOM_INFO 확인")
.then((rows)=>{console.log(rows);});


exports.dbRun = dbRun;