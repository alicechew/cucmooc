var LoginModule = function(btnLogin, loginContainer){
    console.log('login model connected');

    var btnClose,
        popupString = '<button class="close">Close X</button>'
         + '<div class="mount-node">'
         + '<div class="container login-container">'
         + '<form id="js_login" class="m-t-lg" action="" method="POST"><div class="row form-item m-b-lg"><div class="form-field col-md-12"><input type="text" class="form-control" name="username" placeholder="Input your username"></div></div>'
         + '<div class="row form-item m-b-lg"><div class="form-field col-md-12"><input type="password" class="form-control" name="password" placeholder="Choose a password"></div></div>'
         + '<div class="row form-item"><div class="form-action col-md-12"><button type="submit" class=" btn-signup m-b-md">登录</button></div></div>'
         + '</form></div></div>';

         btnLogin.on('click', null, function(event) {
            // console.log(loginContainer);
            loginContainer.html(popupString);
            loginContainer.toggleClass('show');
            btnClose = loginContainer.find('.close');
            btnClose.on('click', null, function(event) {
            loginContainer.removeClass('show');
        });
        });


};