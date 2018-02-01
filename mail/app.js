const EWS = require('node-ews');
 
// exchange server connection info
const ewsConfig = {
  username: 'ameika@lotte.net',
  password: '@whtjgus584',
  host: 'https://ews.lotte.net'
};
 
// initialize node-ews
const ews = new EWS(ewsConfig);
 
// define ews api function
const ewsFunction = 'CreateItem';
 
// define ews api function args
const ewsArgs = {
  "attributes" : {
    "MessageDisposition" : "SendAndSaveCopy"
  },
  "SavedItemFolderId": {
    "DistinguishedFolderId": {
      "attributes": {
        "Id": "sentitems"
      }
    }
  },
  "Items" : {
    "Message" : {
      "ItemClass": "IPM.Note",
      "Subject" : "와 미치겠다 진짜....",
      "Body" : {
        "attributes": {
          "BodyType" : "Text"
        },
        "$value": "<h1>이게 말이 되냐...</h1><h5>하루종일 고민한게 5분만에 해결...</h5>답은 node-ews다!"
      },
      "ToRecipients" : {
        "Mailbox" : {
          "EmailAddress" : "ameika@lotte.net"
        }
      },
      "IsRead": "false"
    }
  }
};
 
// query EWS and print resulting JSON to console
ews.run(ewsFunction, ewsArgs)
  .then(result => {
    console.log('result :',JSON.stringify(result,null,2));
  })
  .catch(err => {
    console.log('err :',JSON.stringify(err,null,2));
  });