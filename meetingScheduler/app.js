const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session')

const app = express();

const port = 80;
const sess = {
  secret: 'keyboard cat'
}
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use('/', require('./router/pages'));

const routerNames = ['pages','ajax'];
routerNames.forEach(function(data){app.use('/' + data, require('./router/' + data));});

app.listen(port,function(){console.log('nodeServer(port = ' + port + ')  Start at : ' + new Date().toLocaleString());});
