const express = require('express');
const router = require('express').Router();
const fs = require('fs');
const nodemailer = require('nodemailer');
const account = require('./account.js');

var transporter = nodemailer.createTransport({
  service:'Gmail',
  auth: {
    user: account.id,
    pass: account.pass
  } ,
  tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    }
});

var mailOptions = {
  from: account.id,
  to: 'ameika@lotte.net',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
console.log('Mail router Start ');
module.exports = router;