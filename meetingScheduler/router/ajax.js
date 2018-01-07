const express = require('express');
const router = require('express').Router();
const fs = require('fs');
const sqlite = require("./sqlite.js");


const defaultPage = "timeTable";

/* Login*/

router.post('/login', function (req, res) {		
	let param = req.body;
	req.session.loginId=param.inputId;
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