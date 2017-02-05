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
                document.getElementById("divLoading").style.display = "none";
                document.getElementById("secTasks").style.display = "block";
                var inject_folderTree = document.getElementById('inject_folderTree');
                inject_folderTree.innerHTML = result;
            },
            error: function (e) {
                console.log(e);
            }
        });
    };

};