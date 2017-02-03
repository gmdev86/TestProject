var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var https = require('https');
var ejs = require('ejs');
//var oRequest = require('request');

/* GET Login page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Dashboard page. */
router.get('/dashboard', function(req, res, next) {
    var authorization_code = req.param('code');
    var oRes = res;
    var oReq = req;
    console.log('#########################');
    console.log(authorization_code);
    console.log('#########################');
    
    //now that we have the code we need to get the access token
    var postData = querystring.stringify({
        client_id: "YBdUueJr",
        client_secret: "uxwxruAr7C4NJD9Pxfy65KqKLqy1UYw8R55T9lazzumsuwDRkj75WEUGI08petGp",
        grant_type: 'authorization_code',
        code: authorization_code
    });

    // request option
    var options = {
        host: 'www.wrike.com',
        port: 443,
        path: '/oauth2/token?' + postData,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    // request object    
    var pReq = https.request(options, function (pRes) {
        var result = '';
        pRes.on('data', function (chunk) {
            result += chunk;
        });
        pRes.on('end', function () {
            var oData = JSON.parse(result);
            req.session['access_token'] = oData.access_token;
            req.session['token_type'] = oData.token_type;
            req.session['refresh_token'] = oData.refresh_token;

            console.dir(req.session);
            oRes.render('dashboard', { pageTitle: 'testing the engine' });
        });
        pRes.on('error', function (err) {
            console.log(err);
        });
    });

    // req error
    pReq.on('error', function (err) {
        console.log(err);
    });

    //send request witht the postData form
    pReq.write(postData);
    pReq.end();

    //testing
    //res.render('dashboard', { pageTitle: 'testing the engine' });
});

router.get('/getFolderTree', function (req, res) {
    var access_token = req.session['access_token'];

    console.log('#########################');
    console.log('access_token: ' + access_token);
    console.log('#########################');

     var options = {
       host: 'www.wrike.com',
       port: 443,
       path: '/api/v3/folders',
       method: 'GET',
       headers: {
           'Authorization': 'bearer ' + access_token
       }
    };

    https.request(options, function (response) {
       response.pipe(res);
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

router.post('/_folderTree', function (req, res) {
    var b = res.body;
    console.log(b);
//     var oDs = [];
//     for(var i = 0; i < posts[0]["data"].length; i++){
//         var total = posts[0]["data"][i].childIds.length;
//         console.log(total);
//         var array = {};
//         array.id = posts[0]["data"][i].id;
//         array.title = posts[0]["data"][i].title;
//         array.total = total;

//         oDs.push(array);
//         //oDs.push(posts[0]["data"][i]);
//         console.log(oDs);
//     };   

//     var partial = res.render('_folderTree', { posts: oDs });
//     res.end(partial);
    res.end(res.body);
});

//create route passing the data object and load the parital view

// router.get('/getFolderTree', function (req, res) {
//     // var access_token = req.session['access_token'];

//     // console.log('#########################');
//     // console.log('access_token: ' + access_token);
//     // console.log('#########################');

//     //  var options = {
//     //    host: 'www.wrike.com',
//     //    port: 443,
//     //    path: '/api/v3/folders',
//     //    method: 'GET',
//     //    headers: {
//     //        'Authorization': 'bearer ' + access_token
//     //    }
//     // };

//     // https.request(options, function (response) {
//     //    response.pipe(res);
//     // }).on('error', function (e) {
//     //    res.sendStatus(500);
//     // }).end();

//     const posts = [
// {
//   "kind": "folderTree",
//   "data": [
//     {
//       "id": "IEAAF6ILI7777777",
//       "title": "Root",
//       "childIds": [
//         "IEAAF6ILI4DZT443",
//         "IEAAF6ILI4D4PDVU",
//         "IEAAF6ILI4D2CTEE",
//         "IEAAF6ILI4D4PDWR",
//         "IEAAF6ILI4DZT5B6"
//       ],
//       "scope": "WsRoot"
//     },
//     {
//       "id": "IEAAF6ILI7777776",
//       "title": "Recycle Bin",
//       "childIds": [
//         "IEAAF6ILI4D4YNH4",
//         "IEAAF6ILI4D7CFCC",
//         "IEAAF6ILI4D6IWI7",
//         "IEAAF6ILI4D6JDHZ"
//       ],
//       "scope": "RbRoot"
//     },
//     {
//       "id": "IEAAF6ILI4DZT5Y3",
//       "title": "Advancement",
//       "childIds": [],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4DZT53U",
//       "title": "Financial Aid",
//       "childIds": [],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4DZT5B6",
//       "title": "Functional Champion",
//       "childIds": [
//         "IEAAF6ILI4D4Q7TJ",
//         "IEAAF6ILI4DZT5Y3",
//         "IEAAF6ILI4DZT542",
//         "IEAAF6ILI4DZUBKO",
//         "IEAAF6ILI4D7B4VU",
//         "IEAAF6ILI4DZT52O",
//         "IEAAF6ILI4DZUCQC",
//         "IEAAF6ILI4DZT5YT",
//         "IEAAF6ILI4DZUBFA",
//         "IEAAF6ILI4DZT53F",
//         "IEAAF6ILI4DZUCWW",
//         "IEAAF6ILI4DZT53U"
//       ],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4DZT53F",
//       "title": "Registrar's Office",
//       "childIds": [],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4DZT5YT",
//       "title": "Finance",
//       "childIds": [],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4DZT542",
//       "title": "Human Resources",
//       "childIds": [],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4DZT52O",
//       "title": "Student Affairs",
//       "childIds": [],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4DZUBFA",
//       "title": "Admissions",
//       "childIds": [],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4DZUBKO",
//       "title": "Institutional Research",
//       "childIds": [],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4DZUCQC",
//       "title": "PMO",
//       "childIds": [],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4DZUCWW",
//       "title": "ACTS",
//       "childIds": [],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4D4YNH4",
//       "title": "New Project",
//       "childIds": [],
//       "scope": "RbFolder",
//       "project": {
//         "authorId": "KUACSIZD",
//         "ownerIds": [
//           "KUACSIZD"
//         ],
//         "status": "Green",
//         "createdDate": "2017-01-20T21:09:23Z"
//       }
//     },
//     {
//       "id": "IEAAF6ILI4D2CTEE",
//       "title": "EIT-AS Projects",
//       "childIds": [],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4DZT443",
//       "title": "Institute Projects",
//       "childIds": [
//         "IEAAF6ILI4D47KOH",
//         "IEAAF6ILI4DS7FUX",
//         "IEAAF6ILI4D5YNIV",
//         "IEAAF6ILI4DZQZIC",
//         "IEAAF6ILI4D5YQVH",
//         "IEAAF6ILI4D6PCXZ",
//         "IEAAF6ILI4DZS5WG"
//       ],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4D4Q7TJ",
//       "title": "EIT",
//       "childIds": [],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4D4PDVU",
//       "title": "Other EIT-AS Requests",
//       "childIds": [],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4D4PDWR",
//       "title": "ACTS Project Requests",
//       "childIds": [
//         "IEAAF6ILI4DZQZIC",
//         "IEAAF6ILI4D5YQVH"
//       ],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4D5YNIV",
//       "title": "ISSM Implementation",
//       "childIds": [],
//       "scope": "WsFolder",
//       "project": {
//         "authorId": "KUAB3WPR",
//         "ownerIds": [
//           "KUAB3WPR"
//         ],
//         "status": "Green",
//         "createdDate": "2017-01-26T19:08:03Z"
//       }
//     },
//     {
//       "id": "IEAAF6ILI4D7B4VU",
//       "title": "Academic Affairs",
//       "childIds": [],
//       "scope": "WsFolder"
//     },
//     {
//       "id": "IEAAF6ILI4D7CFCC",
//       "title": "CampusLabs",
//       "childIds": [],
//       "scope": "RbFolder",
//       "project": {
//         "authorId": "KUABT62W",
//         "ownerIds": [
//           "KUABT62W",
//           "KUACWPBU",
//           "KUACWNOR"
//         ],
//         "status": "Green",
//         "createdDate": "2017-02-02T22:15:20Z"
//       }
//     },
//     {
//       "id": "IEAAF6ILI4DZQZIC",
//       "title": "Infosilem Implementation",
//       "childIds": [],
//       "scope": "WsFolder",
//       "project": {
//         "authorId": "KUAB3WPR",
//         "ownerIds": [
//           "KUAB3WPR"
//         ],
//         "status": "Green",
//         "createdDate": "2017-01-03T15:47:51Z"
//       }
//     },
//     {
//       "id": "IEAAF6ILI4DZS5WG",
//       "title": "Business Process Review",
//       "childIds": [],
//       "scope": "WsFolder",
//       "project": {
//         "authorId": "KUAB3WPR",
//         "ownerIds": [
//           "KUAB3WPR"
//         ],
//         "status": "Green",
//         "createdDate": "2017-01-03T19:54:43Z"
//       }
//     },
//     {
//       "id": "IEAAF6ILI4D47KOH",
//       "title": "Enterprise CRM",
//       "childIds": [],
//       "scope": "WsFolder",
//       "project": {
//         "authorId": "KUAB3WPR",
//         "ownerIds": [
//           "KUAB3WPR"
//         ],
//         "status": "Green",
//         "createdDate": "2017-01-23T15:18:14Z"
//       }
//     },
//     {
//       "id": "IEAAF6ILI4DS7FUX",
//       "title": "Banner XE Upgrade",
//       "childIds": [],
//       "scope": "WsFolder",
//       "project": {
//         "authorId": "KUAB3WPR",
//         "ownerIds": [
//           "KUAB3WPR"
//         ],
//         "status": "Green",
//         "createdDate": "2016-11-15T19:51:28Z"
//       }
//     },
//     {
//       "id": "IEAAF6ILI4D6IWI7",
//       "title": "XE Upgrade Tasks  Event Mgmt",
//       "childIds": [],
//       "scope": "RbFolder",
//       "project": {
//         "authorId": "KUAB3WPR",
//         "ownerIds": [
//           "KUAB3WPR"
//         ],
//         "status": "Green",
//         "createdDate": "2017-01-30T18:46:51Z"
//       }
//     },
//     {
//       "id": "IEAAF6ILI4D5YQVH",
//       "title": "Handshake",
//       "childIds": [],
//       "scope": "WsFolder",
//       "project": {
//         "authorId": "KUAB3WPR",
//         "ownerIds": [
//           "KUAB3WPR",
//           "KUACVQED",
//           "KUACWNOR"
//         ],
//         "status": "Green",
//         "createdDate": "2017-01-26T19:20:36Z"
//       }
//     },
//     {
//       "id": "IEAAF6ILI4D6JDHZ",
//       "title": "Banner Finance Admnistration and Banner General Administration",
//       "childIds": [],
//       "scope": "RbFolder",
//       "project": {
//         "authorId": "KUAB3WPR",
//         "ownerIds": [
//           "KUAB3WPR"
//         ],
//         "status": "Green",
//         "createdDate": "2017-01-30T19:25:46Z"
//       }
//     },
//     {
//       "id": "IEAAF6ILI4D6PCXZ",
//       "title": "EMS Upgrade",
//       "childIds": [],
//       "scope": "WsFolder",
//       "project": {
//         "authorId": "KUAB3WPR",
//         "ownerIds": [
//           "KUAB3WPR"
//         ],
//         "status": "Green",
//         "createdDate": "2017-01-31T15:07:44Z"
//       }
//     }
//   ]
// }
//     ];


//     //console.log(posts[0]["data"][0]);

//     var oDs = [];
//     for(var i = 0; i < posts[0]["data"].length; i++){
//         var total = posts[0]["data"][i].childIds.length;
//         console.log(total);
//         var array = {};
//         array.id = posts[0]["data"][i].id;
//         array.title = posts[0]["data"][i].title;
//         array.total = total;

//         oDs.push(array);
//         //oDs.push(posts[0]["data"][i]);
//         console.log(oDs);
//     };   

//     var partial = res.render('_folderTree', { posts: oDs });
//     res.end(partial);
// });

module.exports = router;
