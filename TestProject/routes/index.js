/*
    Known issues: if the user refreshes the page, the session is restarted and the access_token is lost.
        fix: save the access_token in local db or indexed db.
*/

var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var https = require('https');
var ejs = require('ejs');
var fs = require('fs');
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
});

router.get('/getGroups', function (req, res) {
    var access_token = req.session['access_token'];

    // console.log('#########################');
    // console.log('access_token: ' + access_token);
    // console.log('#########################');

     var options = {
       host: 'www.wrike.com',
       port: 443,
       path: '/api/v3/accounts/IEAAF6IL/groups',
       method: 'GET',
       headers: {
           'Authorization': 'bearer ' + access_token
       }
    };

    https.request(options, function (response) {
        var result = '';
        response.on('data', function (chunk) {
            console.log(chunk);
            result += chunk;
        });
        response.on('end', function () {
            console.log(result);
            var oData = JSON.parse(result);
            var oDs = [];

            for(var i = 0; i < oData["data"].length; i++){
                var array = {};
                array.id = oData["data"][i].id;
                array.title = oData["data"][i].title;
                oDs.push(array);
            };   

            var partial = res.render('_groups', { posts: oDs });
            res.end(partial);
        });
        response.on('error', function (err) {
            console.log(err);
        });       
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

router.get('/getFolderTree', function (req, res) {
     var access_token = req.session['access_token'];

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
        var result = '';
        response.on('data', function (chunk) {
            console.log(chunk);
            result += chunk;
        });
        response.on('end', function () {
            var oData = JSON.parse(result);
            var oDs = [];

            for(var i = 0; i < oData["data"].length; i++){
                var total = oData["data"][i].childIds.length;
                var array = {};
                array.id = oData["data"][i].id;
                array.title = oData["data"][i].title;
                array.total = total;
                oDs.push(array);
            };   

            var partial = res.render('_folderTree', { posts: oDs });
            res.end(partial);
        });
        response.on('error', function (err) {
            console.log(err);
        });       
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

router.get('/getProjectFolders', function (req, res) {
     var access_token = req.session['access_token'];

     var options = {
       host: 'www.wrike.com',
       port: 443,
       path: '/api/v3/accounts/IEAAF6IL/folders',
       method: 'GET',
       headers: {
           'Authorization': 'bearer ' + access_token
       }
    };

    https.request(options, function (response) {
        var result = '';
        response.on('data', function (chunk) {
            console.log(chunk);
            result += chunk;
        });
        response.on('end', function () {
            console.log(result);
            var oData = JSON.parse(result);
            var oDs = [];
            var Root;

            for(var i = 0; i < oData["data"].length; i++){
                // Get the root looking at the title = Root
                var title = oData["data"][i].title;                

                if (title === "Root"){
                    Root = oData["data"][i];
                    break;
                };

            };   

            res.end(JSON.stringify(Root));
        });
        response.on('error', function (err) {
            console.log(err);
        });       
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

router.post('/loadChildFolderByIds', function (req, res) {
    var access_token = req.session['access_token'];
    var body = req.body;
    var ids = "";

    for(var i = 0; i < body.childIds.length; i++){
        ids += body.childIds[i];
        if(i != body.childIds.length - 1){
            ids += ",";
        };        
    };

    // testing
    console.log(ids);
    var options = {
        host: 'www.wrike.com',
        port: 443,
        path: '/api/v3/folders/' + ids,
        method: 'GET',
        headers: {
            'Authorization': 'bearer ' + access_token
        }
    };

    https.request(options, function (response) {
        var result = '';
        response.on('data', function (chunk) {
            console.log(chunk);
            result += chunk;
        });
        response.on('end', function () {
            console.log(result);
            var oData = JSON.parse(result);
            var oDs = [];

            for(var i = 0; i < oData["data"].length; i++){            
                var total = oData["data"][i].childIds.length;
                var array = {};
                array.id = oData["data"][i].id;
                array.title = oData["data"][i].title;
                array.total = total;
                oDs.push(array);
            };  
            
            var partial = res.render('_folderTree', { posts: oDs });
            res.end(partial);
        });
        response.on('error', function (err) {
            console.log(err);
        });       
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

router.post('/getChildFolderById', function (req, res) {
    var access_token = req.session['access_token'];
    var body = req.body;

    var options = {
        host: 'www.wrike.com',
        port: 443,
        path: '/api/v3/folders/' + body.id,
        method: 'GET',
        headers: {
            'Authorization': 'bearer ' + access_token
        }
    };

    https.request(options, function (response) {
        var result = '';
        response.on('data', function (chunk) {
            console.log(chunk);
            result += chunk;
        });
        response.on('end', function () {
            console.log(result);
            res.end(result);
        });
        response.on('error', function (err) {
            console.log(err);
        });       
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

router.post('/getGrandChildFolders', function (req, res) {
    var access_token = req.session['access_token'];
    var body = req.body;
    var ids = "";

    if(body.data[0].childIds.length > 0){

        for(var i = 0; i < body.data[0].childIds.length; i++){
            ids += body.data[0].childIds[i];
            if(i != body.data[0].childIds.length - 1){
                ids += ",";
            };        
        };

        console.log(ids);
        var options = {
            host: 'www.wrike.com',
            port: 443,
            path: '/api/v3/folders/' + ids,
            method: 'GET',
            headers: {
                'Authorization': 'bearer ' + access_token
            }
        };

        https.request(options, function (response) {
            var result = '';
            response.on('data', function (chunk) {
                console.log(chunk);
                result += chunk;
            });
            response.on('end', function () {
                console.log(result);
                var oData = JSON.parse(result);
                var oDs = [];

                for(var i = 0; i < oData["data"].length; i++){            
                    var total = oData["data"][i].childIds.length;
                    var array = {};
                    array.id = oData["data"][i].id;
                    array.title = oData["data"][i].title;
                    array.total = total;
                    oDs.push(array);
                };  
                
                var partial = res.render('_childFolders', { posts: oDs });
                res.end(partial);
            });
            response.on('error', function (err) {
                console.log(err);
            });       
        }).on('error', function (e) {
        res.sendStatus(500);
        }).end();      
    } else {
        res.end("");
    };

});

router.post('/loadTasksForFolder', function (req, res) {
     var access_token = req.session['access_token'];
     var body = req.body;

     var options = {
       host: 'www.wrike.com',
       port: 443,
       path: '/api/v3/folders/' + body.id + '/tasks?fields=["subTaskIds"]',
       method: 'GET',
       headers: {
           'Authorization': 'bearer ' + access_token
       }
    };

    https.request(options, function (response) {
        var result = '';
        response.on('data', function (chunk) {
            console.log(chunk);
            result += chunk;
        });
        response.on('end', function () {
            var oData = JSON.parse(result);
            var oDs = [];

            // var answer = {
            //     "view": "",
            //     "master": [{
            //         "parentId": "",
            //         "subTaskIds": []
            //     }]                
            // };

            for(var i = 0; i < oData["data"].length; i++){
                var array = {};
                var ids = "";
                array.id = oData["data"][i].id;
                array.title = oData["data"][i].title;              

                for(var x = 0; x < oData["data"][i].subTaskIds.length; x++){
                    ids += oData["data"][i].subTaskIds[x];
                    if(x != oData["data"][i].subTaskIds.length - 1){
                        ids += ",";
                    };
                };

                array.ids = ids;  
                oDs.push(array);
            };   

            var partial = res.render('_tasks', { posts: oDs });
            res.end(partial);

            /**** example of loading partial into variable ****/
            /*var tmp = fs.readFileSync("views/_tasks.html").toString();
            var template = ejs.compile(tmp)({ posts: oDs });
            answer.view = template;
            res.end(JSON.stringify(answer));*/
        });
        response.on('error', function (err) {
            console.log(err);
        });       
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

router.post('/loadSubTasks', function (req, res) {
    var access_token = req.session['access_token'];
    var body = req.body;

    var options = {
        host: 'www.wrike.com',
        port: 443,
        path: '/api/v3/tasks/' + body.ids,
        method: 'GET',
        headers: {
            'Authorization': 'bearer ' + access_token
        }
    };

    https.request(options, function (response) {
        var result = '';
        response.on('data', function (chunk) {
            console.log(chunk);
            result += chunk;
        });
        response.on('end', function () {
            console.log(result);
            var oData = JSON.parse(result);
            var oDs = [];

            for(var i = 0; i < oData["data"].length; i++){    
                var array = {};
                array.id = oData["data"][i].id;
                array.title = oData["data"][i].title;
                //array.permalink = oData["data"][i].permalink; //testing
                oDs.push(array);
            };  
            
            var partial = res.render('_subTasks', { posts: oDs });
            res.end(partial);
        });
        response.on('error', function (err) {
            console.log(err);
        });       
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

router.post('/loadTask', function (req, res) {
    var access_token = req.session['access_token'];
    var body = req.body;

    var options = {
        host: 'www.wrike.com',
        port: 443,
        path: '/api/v3/tasks/' + body.id,
        method: 'GET',
        headers: {
            'Authorization': 'bearer ' + access_token
        }
    };

    https.request(options, function (response) {
        var result = '';
        response.on('data', function (chunk) {
            console.log(chunk);
            result += chunk;
        });
        response.on('end', function () {
            var oData = JSON.parse(result);
            res.end(JSON.stringify(oData));
        });
        response.on('error', function (err) {
            console.log(err);
        });       
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

router.post('/loadProfile', function (req, res) {
    var access_token = req.session['access_token'];
    var body = req.body;

    var options = {
        host: 'www.wrike.com',
        port: 443,
        path: '/api/v3/contacts?me=true',
        method: 'GET',
        headers: {
            'Authorization': 'bearer ' + access_token
        }
    };

    https.request(options, function (response) {
        var result = '';
        response.on('data', function (chunk) {
            console.log(chunk);
            result += chunk;
        });
        response.on('end', function () {
            var oData = JSON.parse(result);
            res.end(JSON.stringify(oData));
        });
        response.on('error', function (err) {
            console.log(err);
        });       
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

router.get('/loadTasksWidget', function (req, res) {
    var access_token = req.session['access_token'];
    var userId = req.session['Contact_ID'];

    var options = {
        host: 'www.wrike.com',
        port: 443,
        path: '/api/v3/tasks?responsibles=[' + userId + ']',
        method: 'GET',
        headers: {
            'Authorization': 'bearer ' + access_token
        }
    };

    https.request(options, function (response) {
        var result = '';
        response.on('data', function (chunk) {
            console.log(chunk);
            result += chunk;
        });
        response.on('end', function () {
            var oData = JSON.parse(result);

            //get the count and create the data layer in partial.

            res.end(JSON.stringify(oData));
        });
        response.on('error', function (err) {
            console.log(err);
        });       
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

router.post('/getUser', function (req, res) {
    var access_token = req.session['access_token'];
    var body = req.body;

    var options = {
        host: 'www.wrike.com',
        port: 443,
        path: '/api/v3/contacts?me=true',
        method: 'GET',
        headers: {
            'Authorization': 'bearer ' + access_token
        }
    };

    https.request(options, function (response) {
        var result = '';
        response.on('data', function (chunk) {
            console.log(chunk);
            result += chunk;
        });
        response.on('end', function () {
            var oData = JSON.parse(result);
            var avatarUrl = "";

            for(var i = 0; i < oData["data"].length; i++){
                req.session['Contact_ID'] = oData["data"][i].id;
                req.session['AvatarUrl'] = oData["data"][i].avatarUrl;
                avatarUrl = oData["data"][i].avatarUrl;
            }; 

            res.end(avatarUrl);
        });
        response.on('error', function (err) {
            console.log(err);
        });       
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

router.get('/getContacts', function (req, res) {
    var access_token = req.session['access_token'];

    // console.log('#########################');
    // console.log('access_token: ' + access_token);
    // console.log('#########################');

     var options = {
       host: 'www.wrike.com',
       port: 443,
       path: '/api/v3/contacts?me=true',
       method: 'GET',
       headers: {
           'Authorization': 'bearer ' + access_token
       }
    };

    https.request(options, function (response) {
        var result = '';
        response.on('data', function (chunk) {
            console.log(chunk);
            result += chunk;
        });
        response.on('end', function () {
            console.log(result);
            var oData = JSON.parse(result);
            var oDs = [];

            for(var i = 0; i < oData["data"].length; i++){
                var array = {};
                var profiles = [];
                var profile = {};
                array.id = oData["data"][i].id;
                array.firstName = oData["data"][i].firstName;
                array.lastName = oData["data"][i].lastName;

                for(var x = 0; x < oData["data"][i].profiles.length; x++){
                    profile.accountId = oData["data"][i].profiles[x].accountId;
                    profile.email = oData["data"][i].profiles[x].email;
                    profile.role = oData["data"][i].profiles[x].role;
                    profile.external = oData["data"][i].profiles[x].external;
                    profile.admin = oData["data"][i].profiles[x].admin;
                    profile.owner = oData["data"][i].profiles[x].owner;
                    profiles.push(profile);
                };

                array.profiles = profiles;

                oDs.push(array);
            };   

            var partial = res.render('_contacts', { posts: oDs });
            res.end(partial);
        });
        response.on('error', function (err) {
            console.log(err);
        });       
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

//getUserById -- not working
router.get('/getUserById', function (req, res) {
    var access_token = req.session['access_token'];
    // console.log('#########################');
    // console.log('access_token: ' + access_token);
    // console.log('#########################');

     var options = {
       host: 'www.wrike.com',
       port: 443,
       path: '/api/v3/users/KUACVP23',
       method: 'GET',
       headers: {
           'Authorization': 'bearer ' + access_token
       }
    };

    https.request(options, function (response) {
        var result = '';
        response.on('data', function (chunk) {
            console.log(chunk);
            result += chunk;
        });
        response.on('end', function () {
            console.log(result);
            var oData = JSON.parse(result);
            var oDs = [];

            for(var i = 0; i < oData["data"].length; i++){
                var array = {};
                array.id = oData["data"][i].id;
                array.firstName = oData["data"][i].firstName;
                array.lastName = oData["data"][i].lastName;
                oDs.push(array);
            };   

            var partial = res.render('_user', { posts: oDs });
            res.end(partial);
        });
        response.on('error', function (err) {
            console.log(err);
        });       
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

router.get('/getAccounts', function (req, res) {
    var access_token = req.session['access_token'];
    // console.log('#########################');
    // console.log('access_token: ' + access_token);
    // console.log('#########################');

     var options = {
       host: 'www.wrike.com',
       port: 443,
       path: '/api/v3/accounts',
       method: 'GET',
       headers: {
           'Authorization': 'bearer ' + access_token
       }
    };

    https.request(options, function (response) {
        var result = '';
        response.on('data', function (chunk) {
            console.log(chunk);
            result += chunk;
        });
        response.on('end', function () {
            console.log(result);
            var oData = JSON.parse(result);
            var oDs = [];

            for(var i = 0; i < oData["data"].length; i++){
                var array = {};
                array.id = oData["data"][i].id;
                array.name = oData["data"][i].name;
                oDs.push(array);
            };   

            var partial = res.render('_accounts', { posts: oDs });
            res.end(partial);
        });
        response.on('error', function (err) {
            console.log(err);
        });       
    }).on('error', function (e) {
       res.sendStatus(500);
    }).end();
});

module.exports = router;