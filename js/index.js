
requirejs(['jquery', 'bootstrap', 'loginModule'],
    function(jquery, bootstrap ,LoginModule) {

        //util
        String.prototype.temp = function(obj) {
            return this.replace(/\$\w+\$/gi, function(matchs) {
                var returns = obj[matchs.replace(/\$/g, '')];
                return (returns + '') == 'undefined' ? '' : returns;
            });
        };

        //验证登录状态
        var userInfo = LoginModule.verifyLogin(),
            ifLogin = userInfo.ifLogin;       //@ATTENTION: 这里的ifLogin是字符串而不是boolean！


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
        var personalCourse = (function(ifLogin){
            var userEnroll = userInfo.userEnroll,
                userCourseContainer = $('#js_userCourseList');
            //未登录则不作更改
            if(ifLogin == 'false'){
                return;
            }
            //隐藏登录提示
            $('.login-notice').hide();
            $('.recommend-point').removeClass('hide');
            $('.recommend-route').removeClass('hide');
            createItem(userEnroll);
            //拆解userEnroll字串
            function spiltCourse(userEnroll){
                var courses = userEnroll.split('&');
                return courses;
            }

            function createItem(userEnroll){
                //html模板
                var courses,
                    itemName = 'courseName',
                    itemIntro = 'courseIntro',
                    itemPath = './course.html?',
                    itemId = 'courseId',
                    itemImgSrc = 'itemImgSrc',
                    courseHtmlStr = '<div class="col-md-3 col-xs-6">'
                        + '<div class="item-panel panel b-a">'
                        +    '<div class="item-pic">'
                        +       '<a target="_blank" href="'+ itemPath + 'courseId=$' + itemId + '$"><img src="$' + itemImgSrc +'$" class="img-full" alt=""></a>'
                        +   '</div>'
                        +    '<div class="item-tit text-center font-bold text-md">'
                        +       '<a target="_blank" href="' + itemPath + 'courseId=$' + itemId + '$">$' + itemName + '$</a>'
                        +   '</div>'
                        +   '<div class="item-desc m-l-sm m-r-sm m-b-sm">'
                        +      '<div class="text-center">$' + itemIntro + '$</div>'
                        +   '</div>'
                        +   '</div>'
                        + '</div>';

                    //如果没有参加课程，则不发送ajax
                    if(!userEnroll){
                        var noticeStr = '<div class="login-notice"><p class="text-center">您还没有参加任何课程！快去挑选心仪课程吧！</p></div>';
                        userCourseContainer.html(noticeStr);
                        return;
                    }

                    courses = spiltCourse(userEnroll)
                    $.ajax({
                        url: '../js/data/personal-course.json',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            courses: courses
                        },
                    })
                    .done(function(result) {
                        console.log("success");
                        fillInList(result, userCourseContainer, courseHtmlStr);
                    })
                    .fail(function() {
                        console.log("error");
                    })
                    .always(function(result) {
                        console.log("complete");
                    });
            }

            function fillInList(content, container, htmlTemp) {
                var htmlList = '';
                container.html('');
                $(content).each(function(index, el) {
                    el.itemImgSrc = el.itemImgSrc || '../images/bg_imgloading.png';
                    htmlList += htmlTemp.temp(el);
                });
                container.html(htmlList);
            }


        }(ifLogin));

        //填充推荐内容
        //@TODO：试试传入填充种类参数。三种填充内容公用一个填充函数。
        var fillRecommend = (function(){
        var courseItems = $('.recommend-course').find('.item-panel'),
            courseName = courseItems.find('.item-tit').find('a'),
            courseDesc = courseItems.find('.item-desc').find('div'),
            courseImg = courseItems.find('img');

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

                courseImg.each(function(index, el) {
                    el.src = result[index].courseImgSrc || '../images/bg_imgloading.png';
                });
            })
            .fail(function() {
                console.log("recommend course load error");
            })
            .always(function() {
                // console.log("complete");
            });
        }());

    });
