class IndexMgr {
    constructor() {
        var self = this;
        //self.getGroups();
        self.getProjectFolders();
        //self.getFolderTree();
        //self.getContacts();
        //self.getUserById();
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
                document.getElementById("secTasks").style.display = "block";
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
                document.getElementById("secTasks").style.display = "block";
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
                        document.getElementById("secTasks").style.display = "block";
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

    getUserById(){
        var self = this;
        $.ajax({
            url: "http://localhost:1337/getUserById",
            type: "GET",
            async: true,
            success: function (result) {
                document.getElementById("userLoading").style.display = "none";
                var inject_user = document.getElementById('inject_user');
                inject_user.innerHTML = result;
            },
            error: function (e) {
                console.log(e);
            }
        });
    };

};