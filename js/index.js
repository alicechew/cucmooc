
requirejs(['jquery', 'bootstrap', 'loginModule'],
    function(jquery, bootstrap ,LoginModule) {

        //验证登录状态
        LoginModule.verifyLogin();
        //记录登录状态
        var ifLogin = LoginModule.ifLogin;

        //绑定按钮事件
        var bindLoginEvent = (function() {
            var btnLogin = $('#js_indexLogin'),
                loginContainer = $('#js_loginFormPopup');

            //绑定登录按钮
            btnLogin.on('click', null, function(event) {
                LoginModule.loginPopup(loginContainer);
            });

        })();


        //@TODO: 您的课程内容随登录状态变换

        //填充推荐课程
        var items = $('.item-panel'),
            courseName = $('.item-tit').find('a'),
            courseDesc = $('.item-desc').find('div');

        $.ajax({
                url: '../php/homepage.php',
                type: 'GET',
                dataType: 'json'
            })
            .done(function(result) {
                console.log('recommend course load success');
                //推荐课程数量固定，故直接填充，不动态生成
                courseName.each(function(index, el) {
                    // el.innerText = result[index].courseName;
                    // firefox 不支持innerText
                    $(el).text(result[index].courseName);
                });
                courseDesc.each(function(index, el) {
                    // el.innerText = result[index].courseDesc;
                    $(el).text(result[index].courseDesc);
                });
            })
            .fail(function() {
                console.log("recommend course load error");
            })
            .always(function() {
                // console.log("complete");
            });
    });
