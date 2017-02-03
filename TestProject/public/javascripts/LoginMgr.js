class LoginMgr {
    constructor() {
        var self = this;
        this.btnLogin = document.getElementById("btnLogin");

        this.btnLogin.onclick = function () {
            self.signOn();
        };
        
    };

    signOn() {
        //window.location.replace("https://www.wrike.com/oauth2/authorize?client_id=YBdUueJr&response_type=code");
        window.location.replace("/dashboard");
    };

};