define(function() {
    var loginPopup = function(btnLogin, loginContainer) {
        console.log('login model connected');

        var btnClose,
            btnSubmitLogin,
            popupString = '<button class="close">Close X</button>'
             + '<div class="mount-node">'
             + '<div class="container login-container">'
             + '<h3 class="login-title">登录</h3>'
             + '<form id="js_login" action="" method="POST"><div class="row form-item m-b-lg"><div class="form-field col-md-12"><input type="text" id="js_usernameInput" class="form-control" name="username" placeholder="Input your username"></div></div>'
             + '<div class="row form-item m-b-lg"><div class="form-field col-md-12"><input type="password" id="js_pswdInput" class="form-control" name="password" placeholder="Choose a password"></div></div>'
             + '<div class="row form-item"><div class="form-action col-md-12"><button type="submit" id="js_btnSubmitLogin" class=" btn-login m-b-md">登录</button></div></div>'
             + '</form></div></div>';

        btnLogin.on('click', null, function(event) {

            loginContainer.html(popupString);
            loginContainer.toggleClass('show');
            $('html').attr({
                'data-fixed': true
            });

            //关闭按钮
            btnClose = loginContainer.find('.close');
            btnClose.on('click', null, function(event) {
                loginContainer.removeClass('show');
                loginContainer.html('');
                $('html').attr({
                'data-fixed': false
            });
            });

            //提交登录
            btnSubmitLogin = loginContainer.find('#js_btnSubmitLogin');
            btnSubmitLogin.on('click', null, function(event) {
                event.preventDefault();
                var username = $('#js_usernameInput').val(),
                    password = $('#js_pswdInput').val();

                $.ajax({
                    url: '../php/login.php',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        username: username,
                        password: password
                    }
                })
                .done(function(result) {
                    console.log("success");
                    if(result.status == '200'){
                        console.log('登录成功');
                    }else{
                        console.log('登录失败');
                    }
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function(result) {
                    console.log("complete");
                });

            });
        });
    };


    return {
        loginPopup: loginPopup
    };
});
