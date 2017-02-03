class IndexMgr {
    constructor() {
        var self = this;
        self.getFolderTree();
    };

    getFolderTree() {
        //Load Folder Tree
        $.ajax({
            url: "http://localhost:1337/getFolderTree",
            type: "GET",
            async: true,
            success: function (result) {
                //document.getElementById("divLoading").style.display = "none";
                //document.getElementById("secTasks").style.display = "block";

                console.log(result);
                //var inject_folderTree = document.getElementById('inject_folderTree');
                //inject_folderTree.innerHTML = result;

                //make another ajax call passing the data from result to get the partial view
                $.ajax({
                    url: "http://localhost:1337/_folderTree",
                    type: "POST",
                    async: true,
                    data: result,
                    success: function (res) {
                        document.getElementById("divLoading").style.display = "none";
                        document.getElementById("secTasks").style.display = "block";

                        console.log(res);
                        var inject_folderTree = document.getElementById('inject_folderTree');
                        inject_folderTree.innerHTML = res;

                        //make another ajax call passing the data from result to get the partial view

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

};