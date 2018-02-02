/*smtp*/
/*
const fs = require("fs");
const SMTPServer = require('smtp-server').SMTPServer;
const server = new SMTPServer({
    secure: false,
	name : 'B2MM_SMTP',
	banner : 'welcome B2MM_SMTP',
	disabledCommands  : ['STARTTLS'],
	authMethods  : ['PLAIN'],
	onAuth : (auth,session,callback)=>
	{
		console.log('onAuth - auth :',auth);
		console.log('onAuth - session :',session);
		//console.log('onAuth - callback',callback.toString());
		callback(null,{user:'mailer_' + session.id});
	},
	onConnect : (session,callback)=>
	{
		console.log('onConnect - session :',session);
		//console.log('onConnect - callback',callback.toString());
		callback();
	},
	onClose : (session)=>
	{
		console.log('onClose - session :',session);
	},
	onMailFrom : (address,session,callback)=>
	{
		console.log('onMailFrom - address :',address);
		console.log('onMailFrom - session :',session);
		//console.log('onMailFrom - callback',callback.toString());
		callback();
	},
	onRcptTo : (address,session,callback)=>
	{
		console.log('onRcptTo - address :',address);
		console.log('onRcptTo - session :',session);
		//console.log('onRcptTo - callback',callback.toString());
		callback();
	},
	onData : (stream,session,callback)=>
	{
		console.log('onData - stream :',stream);
		console.log('onData - session :',session);	
		//console.log('onData - callback',callback.toString());
		stream.pipe(process.stdout);	
		stream.on('end',()=>{callback();});		
	},
	socketTimeout : 1000*60*60,
	closeTimeout  : 1000*60*60
});
server.listen(25,'localhost');
*/



var simplesmtp = require("simplesmtp"),
    fs = require("fs");

var smtp = simplesmtp.createServer(
{
	debug : true,
	disableSTARTTLS :true,
	enableAuthentication : true
});
smtp.listen(25);

smtp.on("startData", function(connection){
    console.log("Message from:", connection.from);
    console.log("Message to:", connection.to);
    connection.saveStream = fs.createWriteStream("message.txt");
});

smtp.on("data", function(connection, chunk){
    connection.saveStream.write(chunk);
});

smtp.on("dataReady", function(connection, callback){
    connection.saveStream.end();
    console.log("Incoming message saved to message.txt");
    callback(null, "ABC1"); // ABC1 is the queue id to be advertised to the client
    // callback(new Error("Rejected as spam!")); // reported back to the client
});