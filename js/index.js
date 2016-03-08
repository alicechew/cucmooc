(function(){
    var login = (function(){
        var btnLogin = $('#js_login'),
            loginContainer = $('#js_loginFormPopup');

        LoginModule(btnLogin, loginContainer);
        //     popupString = '<button class="close">Close X</button>'
        //  + '<div class="mount-node">'
        //  + '<div class="container login-container">'
        //  + '<form id="js_login" class="m-t-lg" action="" method="POST"><div class="row form-item m-b-lg"><div class="form-field col-md-12"><input type="text" class="form-control" name="username" placeholder="Input your username"></div></div>'
        //  + '<div class="row form-item m-b-lg"><div class="form-field col-md-12"><input type="password" class="form-control" name="password" placeholder="Choose a password"></div></div>'
        //  + '<div class="row form-item"><div class="form-action col-md-12"><button type="submit" class=" btn-signup m-b-md">登录</button></div></div>'
        //  + '</form></div></div>';
        // btnLogin.on('click', null, function(event) {
        //     console.log(loginContainer);
        //     loginContainer.html(popupString);
        //     loginContainer.toggleClass('show');
        // });
    })();


    var items = $('.item-panel'),
    courseName = $('.item-tit').find('a'),
    courseDesc = $('.item-desc').find('div');



    $.ajax({
        url: '../php/homepage.php',
        type: 'GET',
        dataType: 'json'
    })
    .done(function(result) {
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
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });

})();