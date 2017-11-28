const express = require('express');
const router = require('express').Router();
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();/*
const db = new sqlite3.Database('ms.sql');

router.get('/getDics', function (req, res) {	

});

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT)");

  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      console.log(row.id + ": " + row.info);
  });
});

db.close();
*/
console.log('Sqlite router Start ');
module.exports = router;