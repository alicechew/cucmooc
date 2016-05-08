define(function() {
    //路径配置
    var phpPath = '../php/',
        ifLogin = false,
        userId,
        userName,
        userEnroll,
        loginContainer = $('#js_loginFormPopup');


    //验证登录状态
    var verifyLogin = function(){

        $.ajax({
            url: phpPath + 'verify-login.php',
            type: 'GET',
            dataType: 'json',
            async: false    //important! 异步进行，保证ifLogin和user信息正确返回
        })
        .done(function(result) {
            console.log("verify login success");
            console.log(result);
            createNav(result.ifLogin, result.username);

            //记录必要信息并返回
            ifLogin = result.ifLogin;
            userId = result.userId;
            userName = result.userName;
            userEnroll = result.userEnroll;
        })
        .fail(function() {
            console.log("verify login error");
        })
        .always(function() {
            // console.log("complete");
        });

        //生成导航
        function createNav(ifLogin, userName){
            var unloginNavStr = '<header class="navbar navbar-fixed-top box-shadow">'
            + '<div class="container"><div class="navbar-header">'
                    + '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav_collapse" aria-expanded="false">'
                       + '<span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>'
                   + '</button>'
                   + '<a class="navbar-brand" href="#">CUCMOOC</a></div>'
                + '<div id="nav_collapse" class="collapse navbar-collapse">'
                   + '<ul class="nav navbar-nav"><li class="active"><a href="./index.html">主页</a></li><li><a href="./categories.html">课程分类</a></li><li><a href="#">关于</a></li></ul>'
                   + '<ul class="nav navbar-nav navbar-right"><li id="js_loginButtons"><div class="m-t-sm">'
                               + '<a id="js_btnLogin" class="btn btn-default btn-sm">登录</a>'
                               + '<a href="./register.html" target="_blank" class="btn btn-sm btn-success m-l-sm"><strong>注册</strong></a>'
                           + '</div></li>'
                       + '<li id="js_loginStatus" style="display:none"><div class="m-t-sm">'
                              + '<a id="js_loginStatus_user" href="#" class="btn btn-link">user</a>'
                               + '<a id="js_btnLogout" class="btn btn-default btn-sm">登出</a>'
                           + '</div></li></ul></div></div></header>',
                loginNavStr = '<header class="navbar navbar-fixed-top box-shadow">'
            + '<div class="container"><div class="navbar-header">'
                    + '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav_collapse" aria-expanded="false">'
                       + '<span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span>'
                   + '</button>'
                   + '<a class="navbar-brand" href="#">CUCMOOC</a></div>'
                + '<div id="nav_collapse" class="collapse navbar-collapse">'
                   + '<ul class="nav navbar-nav"><li class="active"><a href="./index.html">主页</a></li><li><a href="./course-search.html">课内搜索</a></li><li><a href="./categories.html">课程分类</a></li><li><a href="#">关于</a></li></ul>'
                   + '<ul class="nav navbar-nav navbar-right"><li id="js_loginButtons"><div class="m-t-sm">'
                               + '<a id="js_btnLogin" class="btn btn-default btn-sm">登录</a>'
                               + '<a href="./register.html" target="_blank" class="btn btn-sm btn-success m-l-sm"><strong>注册</strong></a>'
                           + '</div></li>'
                       + '<li id="js_loginStatus" style="display:none"><div class="m-t-sm">'
                              + '<a id="js_loginStatus_user" href="#" class="btn btn-link">user</a>'
                               + '<a id="js_btnLogout" class="btn btn-default btn-sm">登出</a>'
                           + '</div></li></ul></div></div></header>';

        if(ifLogin == 'true'){
            $('#js_navWrap').html(loginNavStr);
        }else{
            $('#js_navWrap').html(unloginNavStr);
        }
        changeNavStatus(ifLogin, userName);

        }
        function changeNavStatus(ifLogin, username){
            var loginArea = $('#js_loginButtons'),
                loginStatus = $('#js_loginStatus'),
                usernameEl = $('#js_loginStatus_user'),
                btnLogin = $('#js_btnLogin'),
                btnLogout = $('#js_btnLogout');

                if(ifLogin != 'false'){
                    loginArea.hide();
                    loginStatus.show();
                    if(username != ''){
                        usernameEl.text(username);
                    }
                }else{
                    loginStatus.hide();
                    loginArea.show();
                }

                // 绑定登录按钮
                btnLogin.on('click', null, function(event) {
                   loginPopup(loginContainer);
                });
                //绑定登出按钮事件
                btnLogout.on('click', null, function(event) {
                    logout();
                    window.location.reload();
                });
        }

        return {
            ifLogin: ifLogin,
            userId: userId,
            userEnroll: userEnroll
        };tr

    };

    //弹出登录框
    var loginPopup = function(loginContainer) {
        console.log('login model connected');

        var btnClose,
            btnSubmitLogin,
            popupString = '<button class="close">Close X</button>'
             + '<div class="mount-node">'
             + '<div class="container login-container">'
             + '<h3 class="login-title">登录</h3>'
             + '<form id="js_login" action="" method="POST">'
             + '<div class="form-group m-b-md">'
             + '<label for="js_usernameInput">用户名</label>'
             + '<input type="text" id="js_usernameInput" class="form-control" name="username" placeholder="Input your username">'
             + '</div>'
             + '<div class="form-group m-b-md">'
             + '<label for="js_pswdInput">密码</label>'
             + '<input type="password" id="js_pswdInput" class="form-control" name="password" placeholder="Choose a password">'
             + '</div>'
             + '<div class="form-group"><div class="form-action col-md-12"><button type="submit" id="js_btnSubmitLogin" class=" btn-login m-b-md">登录</button></div></div>'
             + '</form></div></div>';


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
                    url: phpPath + 'login.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        username: username,
                        password: password
                    }
                })
                .done(function(result) {
                    console.log("login success");
                    if(result.status == '200'){
                        console.log('登录成功');
                        window.location.reload();
                    }else{
                        console.log('登录失败');
                    }
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function(result) {
                    console.log(result);
                    // console.log("complete");
                });

            });

    };

    //登出
    var logout = function(){
        if(!ifLogin){
            return;
        }

        $.ajax({
            url: phpPath + 'logout.php',
            type: 'GET'
        })
        .done(function() {
            console.log("logout success");
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            // console.log("complete");
        });

    };


    return {
        verifyLogin: verifyLogin,
        loginPopup: loginPopup,
        logout: logout
    };
});
