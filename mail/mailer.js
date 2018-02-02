'use strict'/*
const local = '127.0.0.1';
const lotte = 'ews.lotte.net';

var Telnet = require('telnet-client')
var connection = new Telnet()

 
var params = {
  host: local,
  port: '25',
  timeout: 60000,
  debug:true
  // removeEcho: 4
}


connection.on('ready', function(...p) {
	console.log('ready :',p);
	connection.send('HELO ldcc',(err,res)=>
	{
		console.log('HELO done');
		consoleER('HELO',err,res);	
		connection.send('MAIL TO:ameika@lotte.net',(err,res)=>
		{
			console.log('MAIL TO done:');
			consoleER('MAIL TO',err,res);
		});			
		console.log('MAIL TO code end');
	});
	console.log('HELO code end');
});
connection.on('connect', function() {
	console.log('connect :');	
});
 
 function consoleER(cmd,err,res)
 {
	 console.log('cmd :',cmd);
	 console.log('err:',err);
	 console.log('res:',res);
 }
 
 function mailTo(cnt)
 {
	 connection.exec('MAIL TO:ameika@lotte.net',(err,res)=>
	{
		console.log('MAIL TO('+ cnt +') done:');
		consoleER(err,res);
		if(err) mailTo(cnt+1);
	});
 }
 
connection.on('writedone', function(...p) {
	console.log('writedone :',p);
});
connection.on('data', function(stream) {
	console.log('data :');
});
connection.on('failedlogin', function(...p) {
	console.log('failedlogin :',p);
});
connection.on('error', function(...p) {
	console.log('error :',p);
});
 
connection.on('timeout', function(...p) {
	console.log('socket timeout!',p);  
});
connection.on('failedlogin', function(...p) {
	console.log('socket failedlogin!',p);  
});
 
connection.on('end', function(...p) {
	console.log('socket end!',p);  
});
 
connection.on('close', function(...p) {
  console.log('connection closed',p)
})
 
connection.connect(params);
console.log('end of code');/

/*mailer*/
const testMail = 'ameika@lotte.net';
const nodemailer = require('nodemailer');

let smtpConfig = {
    host: 'ews.lotte.net',
    port: 25,
	secure:false,
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
};

let message = {
    from: testMail,
    to: testMail,
    subject: 'Message title',
    text: 'Plaintext version of the message',
    html: '<p>HTML version of the message</p>',
	envelope : 
	{		
		from: 'ameika <' + testMail + '>',
		to: 'ameika <' + testMail + '>'
	},
    dsn: {
        id: 'some random message specific id',
        return: 'headers',
        notify: ['failure', 'delay'],
        recipient: testMail
    }
};

let transporter = nodemailer.createTransport(smtpConfig);

transporter.sendMail(message,(err,info,eee)=>
{
	if(err) console.log('err :',JSON.stringify(err,null,2),err);
	else console.log('info :',info);
});




/*
const SMTPConnection = require('nodemailer/lib/smtp-connection');
var mailcomposer = require("mailcomposer");

let consoleCallback = (...p)=>{console.log(p);}

let connectOption = 
{
	port : 8080,
	secure : false,
	ignoreTLS : true,
	transactionLog : true,
	debug : true
}

let auth = 
{
	credentials : 
	{
		user : 'testname',
		pass : 'testpass'
	}
}

let connection = new SMTPConnection(connectOption);
connection.connect(()=>
{	
	connection.login(auth, (err,success)=>
	{
		if(err) console.log('err :',err);
		else if(success)
		{
			let envelope = 
			{
				from : testMail,
				to : testMail
			}
			let message =  mailcomposer({
				from: testMail,
				to: testMail,
				subject: 'A test subject.',
				text: 'A test body.'
			});
			connection.send(envelope, message.createReadStream(), (err,info)=>
			{				
				if(err) console.log('err :',err);
				else console.log('info :',info);
				connection.quit();
				connection.close();
			})
		}
	});
});

*/

/*

const nodemailer = require('nodemailer');
var simplesmtp = require("simplesmtp");
var mailcomposer = require("mailcomposer");
let message =  mailcomposer({
				from: testMail,
				to: testMail,
				subject: 'A test subject.',
				text: 'A test body.'
			});
			
			
let client = simplesmtp.connect(25);
client.once("idle", function(){
    client.useEnvelope({
        from: testMail,
        to: [testMail]
    });
});

client.on("message", function(){
	message.createReadStream().pipe(client);
});

client.on("ready", function(success, response){
    if(success){
        console.log("The message was transmitted successfully with "+response);
		client.quit();
    }
});*/