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
    // var authorization_code = req.param('code');
    // var oRes = res;
    // var oReq = req;
    // console.log('#########################');
    // console.log(authorization_code);
    // console.log('#########################');
    
    // //now that we have the code we need to get the access token
    // var postData = querystring.stringify({
    //     client_id: "YBdUueJr",
    //     client_secret: "uxwxruAr7C4NJD9Pxfy65KqKLqy1UYw8R55T9lazzumsuwDRkj75WEUGI08petGp",
    //     grant_type: 'authorization_code',
    //     code: authorization_code
    // });

    // // request option
    // var options = {
    //     host: 'www.wrike.com',
    //     port: 443,
    //     path: '/oauth2/token?' + postData,
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Content-Length': Buffer.byteLength(postData)
    //     }
    // };

    // // request object    
    // var pReq = https.request(options, function (pRes) {
    //     var result = '';
    //     pRes.on('data', function (chunk) {
    //         result += chunk;
    //     });
    //     pRes.on('end', function () {
    //         var oData = JSON.parse(result);
    //         req.session['access_token'] = oData.access_token;
    //         req.session['token_type'] = oData.token_type;
    //         req.session['refresh_token'] = oData.refresh_token;

    //         console.dir(req.session);
    //         oRes.render('dashboard', {});
    //     });
    //     pRes.on('error', function (err) {
    //         console.log(err);
    //     });
    // });

    // // req error
    // pReq.on('error', function (err) {
    //     console.log(err);
    // });

    // //send request witht the postData form
    // pReq.write(postData);
    // pReq.end();
    res.render('dashboard', { pageTitle: 'testing the engine' });
});

router.get('/getFolderTree', function (req, res) {
    // var access_token = req.session['access_token'];

    // console.log('#########################');
    // console.log('access_token: ' + access_token);
    // console.log('#########################');

    //  var options = {
    //    host: 'www.wrike.com',
    //    port: 443,
    //    path: '/api/v3/folders',
    //    method: 'GET',
    //    headers: {
    //        'Authorization': 'bearer ' + access_token
    //    }
    // };

    // https.request(options, function (response) {
    //    response.pipe(res);
    // }).on('error', function (e) {
    //    res.sendStatus(500);
    // }).end();

    const posts = [
        {
        "kind": "folderTree",
        "data": [
            {
            "id": "IEAAF6ILI4D4YNH4",
            "title": "New Project",
            "childIds": [],
            "scope": "RbFolder",
            "project": {
                "authorId": "KUACSIZD",
                "ownerIds": [
                "KUACSIZD"
                ],
                "status": "Green",
                "createdDate": "2017-01-20T21:09:23Z"
            }
            }
        ]
        }
    ];


    console.log(posts[0][0]);

    var partial = res.render('_folderTree', { posts: posts });
    res.end(partial);
});

module.exports = router;
