define(function() {
    var loginPopup = function(btnLogin, loginContainer) {
        console.log('login model connected');

        var btnClose,
            popupString = '<button class="close">Close X</button>'
             + '<div class="mount-node">'
             + '<div class="container login-container">'
             + '<h3 class="login-title">登录</h3>'
             + '<form id="js_login" action="" method="POST"><div class="row form-item m-b-lg"><div class="form-field col-md-12"><input type="text" class="form-control" name="username" placeholder="Input your username"></div></div>'
             + '<div class="row form-item m-b-lg"><div class="form-field col-md-12"><input type="password" class="form-control" name="password" placeholder="Choose a password"></div></div>'
             + '<div class="row form-item"><div class="form-action col-md-12"><button type="submit" class=" btn-signup m-b-md">登录</button></div></div>'
             + '</form></div></div>';

        btnLogin.on('click', null, function(event) {

            loginContainer.html(popupString);
            loginContainer.toggleClass('show');
            $('html').attr({
                'data-fixed': true
            });

            btnClose = loginContainer.find('.close');
            btnClose.on('click', null, function(event) {
                loginContainer.removeClass('show');
                loginContainer.html('');
                $('html').attr({
                'data-fixed': false
            });
            });
        });
    };


    return {
        loginPopup: loginPopup
    };
});
