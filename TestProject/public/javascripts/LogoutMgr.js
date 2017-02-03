class LogoutMgr {
    constructor() {
        var self = this;
        this.lkLogout = document.getElementById("lkLogout");

        this.lkLogout.onclick = function () {
            self.signOut();
        };
    };

    signOut() {
        window.location.replace("/Logout");
    };

};