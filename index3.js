const express = require('express');
const app = express();
const server=require('http').createServer(app);
const io=require('socket.io').listen(server);
const apiai = require('apiai')('5afc4bdf601046b39972ff3866cca392');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('./public'));

io.sockets.on('connection',function(socket){

	socket.on('message' , function(data){

		let apiaiReq = apiai.textRequest(data , {
			sessionId : 'chatbot-clvxfh'
		});

		apiaiReq.on('response' , (response) => {
			let apiText = response.result.fulfillment.speech;
			socket.emit('reply' , apiText);
		});

		apiaiReq.on('error' , (error) => {
			console.log(error);
		});

		apiaiReq.end();
	});

});

app.get('/' , function(req,res){
	res.render('home');
});

server.listen('8008');