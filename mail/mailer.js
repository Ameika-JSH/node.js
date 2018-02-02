

/*mailer*/
const testMail = 'ameika@lotte.net';
const nodemailer = require('nodemailer');

let smtpConfig = {
    host: 'localhost',
    port: 25,
    secure: false, // upgrade later with STARTTLS
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
	if(err) console.log('err :',err);
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