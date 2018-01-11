const express = require('express');
const router = require('express').Router();
const fs = require('fs');
const sqlite = require("./sqlite.js");
const crypto = require('crypto');
const path = require('path');

const root = path.join(path.dirname(__dirname), '/pages/');
const defaultPage = "timeTable";

/* Login*/

router.post('/login', function (req, res) {		
	let param = req.body;
	let sha256 = crypto.createHash('sha256');
	param.inputPw = sha256.update(param.inputPw).digest('hex');
	//sha256 = crypto.createHash('sha256');
	//sqlite.dbRun('insert into emp_info values("test","' + sha256.update('test').digest('hex') + '","test","test","test")');
	sqlite.dbRun("SELECT * FROM EMP_INFO WHERE " +
	             "ID=?inputId AND " + 
				 "PW=?inputPw",param,"직원 정보 조회")
	.then((rows)=>
	{
		if(rows.length==1)
		{
			console.log('login success!!');
			req.session.loginId=param.inputId;
			res.send(defaultPage); 
		}
		else res.send(false);
	})
	.catch(()=>{res.send(false);});
});

/* Time Table */
router.get('/timeTable/officeList', function (req, res) {	
	let param = req.query;
	console.log(param);
	sqlite.dbRun("SELECT ROOM FROM ROOM_INFO WHERE OFFICE=?office ORDER BY ROOM",param,"회의실 정보 조회")
	.then((rows)=>{res.send(rows);})
	.catch(()=>{res.send(false);});
});

router.get('/timeTable/reserveList', function (req, res) {	
	let param = req.query;
	console.log(param);
	sqlite.dbRun("SELECT * FROM ROOM_INFO ORDER BY OFFICE",param,"회의실 정보 조회")
	.then((rows)=>{res.render(root + 'reserveList.ejs',{'param':param,'row' : rows});})
	.catch((err)=>{console.log(err);res.send(false);});
});


/* Room Info */
router.get('/roomInfo', function (req, res) {	
	sqlite.dbRun("SELECT * FROM ROOM_INFO",undefined,"회의실 정보 조회")
	.then((rows)=>{res.send(rows);})
	.catch(()=>{res.send(false);});
});

router.post('/roomInfo', function (req, res) {	
	let param = req.body;
	if(!param.inputComment) param.inputComment = '"-"';
	console.log(param);
	
	sqlite.dbRun("INSERT INTO ROOM_INFO VALUES(" + 
		  "?inputOffice," + 
		  "?inputRoom," + 
		  "?inputSize," + 
		  "?inputComment)",param,"회의실 정보 입력")
		  .then(()=>{res.send(true);})
		  .catch(()=>{res.send(false);});
});

router.put('/roomInfo', function (req, res) {	
	let param = req.body;
	sqlite.dbRun("UPDATE ROOM_INFO " + 
	             "SET " + 
				 "OFFICE=?office," + 
				 "ROOM=?room," + 
				 "SIZE=?size," + 
				 "COMMENT=?comment" + 
				 "WHERE " +
				 "OFFICE=?old-office AND " + 
				 "ROOM=?old-room AND " + 
				 "SIZE=?old-size AND " + 
				 "COMMENT=?old-comment" ,param,"회의실 정보 수정")
	.then((rows)=>{res.send(true);})
	.catch((err)=>{res.send(false);});
});

router.delete('/roomInfo', function (req, res) {	
	let param = req.body;
	console.log(param);
	sqlite.dbRun("DELETE FROM ROOM_INFO WHERE " + 
		  "OFFICE=?office " + 
		  "AND ROOM=?room",param,"회의실 정보 삭제")
		  .then((rows)=>{res.send(true);})
		  .catch((err)=>{res.send(false);});
});



console.log('Ajax router Start ');
module.exports = router;