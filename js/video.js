requirejs(['jquery', 'bootstrap', 'loginModule', 'videojs'],
    function(jquery, bootstrap, LoginModule, VideoJs) {

        //验证登录状态
        var userInfo = LoginModule.verifyLogin(),
            ifLogin = userInfo.ifLogin;       //@ATTENTION: 这里的ifLogin是字符串而不是boolean！

        //videojs setup
        var videoSetup = (function(){
            var option = {
                    "controls": true,
                    "autoplay": false,
                    "preload": "none",
                    "width": "100%",
                };

                VideoJs('#js_video', option);
        }());
    });
