const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

const port = 81;

app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./router/pages'));
app.use('/ajax', require('./router/ajax'));

app.listen(port,function(){console.log('nodeServer(port = ' + port + ')  Start at : ' + new Date().toLocaleString());});
