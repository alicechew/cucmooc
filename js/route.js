requirejs(['jquery', 'bootstrap', 'loginModule', 'nanoscroller'],
    function(jquery, bootstrap, LoginModule, Scroller) {

        //验证登录状态
        var userInfo = LoginModule.verifyLogin(),
            ifLogin = userInfo.ifLogin;       //@ATTENTION: 这里的ifLogin是字符串而不是boolean！


        $('.nano').nanoScroller({
            preventPageScrolling: true
        });
    });
