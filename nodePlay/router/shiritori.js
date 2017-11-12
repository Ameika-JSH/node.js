const express = require('express');
const router = require('express').Router();
const fs = require('fs');

router.post('/result',function(req,res)
{	
	var result = req.body.val;
	var str = req.body.val + ' - ' + req.body.resultString + ' : ' + new Date().toString();
	var file = 'shiritoriResult/' + req.ip.replace(/:/g,'') + '.txt';

	if(!fs.existsSync(file)) fs.writeFileSync(file,'0:0','utf8');
	
	var score = fs.readFileSync(file,'utf8');		
	var win = parseInt(score.split(':')[0]);
	var lose = parseInt(score.split(':')[1]);
	
	
	if(result == 'win') win++;		
	else lose++;
		
	fs.writeFileSync(file,'' + win + ':' + lose,'utf8');
	res.send({win : win , lose : lose});
});


console.log('Shritori router Start ');
module.exports = router;