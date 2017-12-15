let mysql      = require('mysql');
let stuser = mysql.createConnection({
  host     : 'localhost',
  port	   : '3407',
  user     : 'stuser',
  password : 'stuser',
  database : 'ltcmstdev'
});
 
stuser.connect();
 
stuser.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
stuser.end();

let omuser = mysql.createConnection({
  host     : 'localhost',
  port	   : '3406',
  user     : 'omuser',
  password : 'omuser',
  database : 'ELLTOMDEV'
});
 
omuser.connect();
 
omuser.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
omuser.end();