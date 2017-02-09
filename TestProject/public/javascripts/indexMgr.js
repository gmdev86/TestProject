class IndexMgr {
    constructor() {
        var self = this;

        self.getProjectFolders();

        self.getUser();

        var loadProfile = document.getElementById("loadProfile");
        loadProfile.addEventListener('click',function(e){
            self.loadProfile();
        });     

        var showDash = document.getElementById("RW-Show-Dashboard");
        showDash.addEventListener('click',function(e){
            //set header back to dashboard
            $('.page-header').text('Dashboard');

            //show dashboard
            var dash = document.getElementById('RW-Dashboard');
            dash.style.display = "block";

            //hide profile
            var prof = document.getElementById('RW-Profile');
            prof.style.display = "none";

            //show side nav folders 
            var sideNav = document.getElementById('inject_folderTree');
            sideNav.style.display = "block";
        });

    };

    getGroups() {
        var self = this;
        //Load Folder Tree
        $.ajax({
            url: "http://localhost:1337/getGroups",
            type: "GET",
            async: true,
            success: function (result) {
                document.getElementById("mainLoading").style.display = "none";
                document.getElementById("groupLoading").style.display = "none";
                var inject_groups = document.getElementById('inject_groups');
                inject_groups.innerHTML = result;
                //self.getContacts();
            },
            error: function (e) {
                console.log(e);
            }
        });
    };

    getFolderTree() {
        var self = this;
        //Load Folder Tree
        $.ajax({
            url: "http://localhost:1337/getFolderTree",
            type: "GET",
            async: true,
            success: function (result) {
                document.getElementById("mainLoading").style.display = "none";
                document.getElementById("folderTreeLoading").style.display = "none";
                var inject_folderTree = document.getElementById('inject_folderTree');
                inject_folderTree.innerHTML = result;
                self.getContacts();
            },
            error: function (e) {
                console.log(e);
            }
        });
    };

    getProjectFolders() {
        var self = this;
        //Load Folder Tree
        $.ajax({
            url: "http://localhost:1337/getProjectFolders",
            type: "GET",
            async: true,
            success: function (oData) {
                //go get child data
                //var voData = JSON.parse(oData);
                $.ajax({
                    url: "http://localhost:1337/loadChildFolderByIds",
                    type: "POST",
                    data: oData,
                    contentType: 'application/json', //must have this: tells the server what type
                    async: true,
                    success: function (result) {                            
                        document.getElementById("mainLoading").style.display = "none";
                        var inject_folderTree = document.getElementById('inject_folderTree');
                        inject_folderTree.innerHTML = result;

                        $(".projectFolders").on('click',function(event){
                            var li = event.currentTarget;
                            $(li).find("ul").toggleClass("in");
                            console.log(li);
                        });

                        self.getChildFolders();
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });

            },
            error: function (e) {
                console.log(e);
            }
        });
    };

    getChildFolders(){
        var self = this;
        var lis = document.getElementsByClassName("projectFolders");
        console.dir(lis);

        for(var i = 0; i < lis.length; i++){
            var folderId = lis[i].lastElementChild.innerText;
            var me = lis[i];

            var obj = {
                "id": folderId
            };

            self.generateGrandChild(obj,me);            
        };
   
    };

    generateGrandChild(obj,me){
        var self = this;
        $.ajax({
            url: "http://localhost:1337/getChildFolderById",
            type: "POST",
            data: JSON.stringify(obj),
            contentType: 'application/json', //must have this: tells the server what type
            async: true,
            success: function (result) {

                $.ajax({
                    url: "http://localhost:1337/getGrandChildFolders",
                    type: "POST",
                    data: result,
                    contentType: 'application/json', //must have this: tells the server what type
                    async: true,
                    success: function (oData) {

                        if(oData != ""){
                            var div = document.createElement("div");
                            div.innerHTML = oData;
                            me.appendChild(div);   
                            $(".grandChildfolder").on('click',function(event){
                                var li = event.currentTarget;
                                var id = $(li).find("div").text();
                                var title = $(li).find("strong").text();
                                // update page title hide task widget
                                $('.page-header').text(title);

                                console.log(id);
                                //Load tasks for folderId
                                document.getElementById("tasksLoading").style.display = "block";
                                self.loadTasksForFolder(id);
                            });
                        };

                    },
                    error: function (e) {
                        console.log(e);
                    }
                });

            },
            error: function (e) {
                console.log(e);
            }
        });
    };

    loadTasksForFolder(folderId){
        var self = this;

        var data = {
            "id": folderId
        };

        $.ajax({
            url: "http://localhost:1337/loadTasksForFolder",
            type: "POST",
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json', //must have this: tells the server what type
            success: function (result) {
                document.getElementById("tasksLoading").style.display = "none";
                var inject_tasks = document.getElementById('inject_tasks');
                inject_tasks.innerHTML = result;
                //load all sub tasks
                var lis = $('.task-icon');

                for(var l = 0; l < lis.length; l++){
                    var li = lis[l];
                    var div = $(li).find('div.hidden-children').text();
                    if(div){
                        self.loadSubTasks(li,div);                   
                    };
                };

                $('.task-icon').on('click',function(event){
                    var lis = event.currentTarget;
                    var ul = $(lis).find("ul");
                    var count = ul.length;
                    console.log(lis);
                    if(count > 0){
                        $(ul).toggleClass("in");
                        $(lis).find("i.fa-chevron-circle-down").toggle();
                        $(lis).find("i.fa-chevron-circle-up").toggle();
                    } else {
                        //Load task
                        var id = $(lis).find("div.hidden-parent-id").text();
                        self.loadTask(id);
                    };
                    
                });

            },
            error: function (e) {
                console.log(e);
            }
        }); 

    };

    loadSubTasks(me, subTaskIds){
        var self = this;

         var data = {
            "ids": subTaskIds
        };

        $.ajax({
            url: "http://localhost:1337/loadSubTasks",
            type: "POST",
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json', //must have this: tells the server what type
            success: function (result) {
                var div = document.createElement("div");
                div.innerHTML = result;
                me.appendChild(div);
                $('.subTask-icon').off();
                $('.subTask-icon').bind('click',function(event){
                    event.stopImmediatePropagation();
                    var ele = event.currentTarget;
                    var id = $(ele).find('div').text();
                    self.loadTask(id);
                });
            },
            error: function (e) {
                console.log(e);
            }
        }); 

    };

    loadTask(id){
        var self = this;

         var data = {
            "id": id
        };

        $.ajax({
            url: "http://localhost:1337/loadTask",
            type: "POST",
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json', //must have this: tells the server what type
            success: function (result) {
                var div = document.getElementById("form-inject");
                div.innerHTML = '';
                var pre = document.createElement("pre");
                pre.innerText = JSON.stringify(JSON.parse(result),null, ' ');
                div.appendChild(pre);
                //div.innerHTML = result;
            },
            error: function (e) {
                console.log(e);
            }
        }); 

    };

    loadProfile(){
        var self = this;

         var data = {
            "id": "KUAB3WPR"
        };

        $.ajax({
            url: "http://localhost:1337/loadProfile",
            type: "POST",
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json', //must have this: tells the server what type
            success: function (result) {
                var div = document.getElementById("profile-inject");
                div.innerHTML = '';
                var pre = document.createElement("pre");
                pre.innerText = JSON.stringify(JSON.parse(result),null, ' ');
                div.appendChild(pre);
                //set header back to Profile
                $('.page-header').text('Profile');
                
                //hide dashboard
                var dash = document.getElementById('RW-Dashboard');
                dash.style.display = "none";

                //show profile
                var prof = document.getElementById('RW-Profile');
                prof.style.display = "block";

                //hide side nav folders 
                var sideNav = document.getElementById('inject_folderTree');
                sideNav.style.display = "none";
            },
            error: function (e) {
                console.log(e);
            }
        }); 

    };

    loadTasksWidget(){
        var self = this;

        $.ajax({
            url: "http://localhost:1337/loadTasksWidget",
            type: "GET",
            async: true,
            contentType: 'application/json', //must have this: tells the server what type
            success: function (result) {
                console.log(result);
            },
            error: function (e) {
                console.log(e);
            }
        }); 
    };

    getContacts(){
        var self = this;
        $.ajax({
            url: "http://localhost:1337/getContacts",
            type: "GET",
            async: true,
            success: function (result) {
                document.getElementById("contactsLoading").style.display = "none";
                var inject_contacts = document.getElementById('inject_contacts');
                inject_contacts.innerHTML = result;
                self.getAccounts();
            },
            error: function (e) {
                console.log(e);
            }
        });
    };

    getAccounts(){
        var self = this;
        $.ajax({
            url: "http://localhost:1337/getAccounts",
            type: "GET",
            async: true,
            success: function (result) {
                document.getElementById("accountsLoading").style.display = "none";
                var inject_accounts = document.getElementById('inject_accounts');
                inject_accounts.innerHTML = result;
            },
            error: function (e) {
                console.log(e);
            }
        });
    };

    getUser(){
        var self = this;

         var data = {
            "id": "KUAB3WPR"
        };

        $.ajax({
            url: "http://localhost:1337/getUser",
            type: "POST",
            async: true,
            data: JSON.stringify(data),
            contentType: 'application/json', //must have this: tells the server what type
            success: function (result) {
                console.log("Loaded user in session....")
                console.log(result);
                //Hide the avatar placeholder
                var aph = document.getElementById('avatar-placeholder');
                aph.style.display = "none";

                //Show the users avatar
                var avatar = document.getElementById('avatar');
                avatar.setAttribute("src", result);
                avatar.setAttribute("class", "img-circle");
                avatar.setAttribute("style",'display: ""; width: 50px; height 25px;');

                //Load Tasks widget
                self.loadTasksWidget();
            },
            error: function (e) {
                console.log(e);
            }
        }); 
    };

};