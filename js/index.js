requirejs(['jquery', 'bootstrap', 'loginModule'],
    function(jquery, bootstrap, LoginModule) {

        //util
        String.prototype.temp = function(obj) {
            return this.replace(/\$\w+\$/gi, function(matchs) {
                var returns = obj[matchs.replace(/\$/g, '')];
                return (returns + '') == 'undefined' ? '' : returns;
            });
        };

        //验证登录状态
        var userInfo = LoginModule.verifyLogin(),
            ifLogin = userInfo.ifLogin; //@ATTENTION: 这里的ifLogin是字符串而不是boolean！


        //绑定按钮事件
        var bindLoginEvent = (function() {
            var btnLogin = $('#js_indexLogin'),
                loginContainer = $('#js_loginFormPopup');

            //绑定登录按钮
            btnLogin.on('click', null, function(event) {
                LoginModule.loginPopup(loginContainer);
            });

        })();

        /**
         * 用户参与课程
         */
        var userCourse = (function(ifLogin) {
            var userEnroll = getUserCourses(userInfo.userId),
                userCourseContainer = $('#js_userCourseList');
            //未登录则不作更改
            if (ifLogin == 'false') {
                return;
            }
            //隐藏登录提示
            $('.login-notice').hide();
            $('.your-status').hide();
            $('.your-route').removeClass('hide');
            $('.your-course').removeClass('hide');
            $('.recommend-point').removeClass('hide');
            $('.recommend-route').removeClass('hide');
            createItem(userEnroll);


            //获取用户已参加课程信息
            function getUserCourses(userId){
                var courseStr = '';
                $.ajax({
                    url: '../php/homepage.php',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        type: 'getCoursesId',
                        userId: userId
                    },
                    async: false
                })
                .done(function(result) {
                    if(result.status == '200'){
                        var courses = new Array();
                        $(result.content).each(function(index, el) {
                            courses.push(el.courseID);
                        });
                        courseStr = courses.join('&');
                    }
                })
                .fail(function() {
                    console.log("get user courses error");
                })
                .always(function() {
                    // console.log("complete");
                });
                return courseStr;
            }
            //拆解userEnroll字串
            function spiltCourse(userEnroll) {
                var courses = userEnroll.split('&');
                return courses;
            }

            function createItem(userEnroll) {
                //html模板
                var courses,
                    itemName = 'courseName',
                    itemIntro = 'courseDesc',
                    itemPath = './course.html?',
                    itemId = 'courseID',
                    imgUrl = '../images/course/',
                    itemImgSrc = 'itemImgSrc',
                    courseHtmlStr = '<div class="col-md-3 col-xs-6">' + '<div class="item-panel panel b-a">' + '<div class="item-pic">' + '<a target="_blank" href="' + itemPath + 'courseId=$' + itemId + '$"><img src="'+ imgUrl +'$' + itemImgSrc + '$" class="img-full" alt=""></a>' + '</div>' + '<div class="item-tit text-center font-bold text-md">' + '<a target="_blank" href="' + itemPath + 'courseId=$' + itemId + '$">$' + itemName + '$</a>' + '</div>' + '<div class="item-desc m-l-sm m-r-sm m-b-sm">' + '<div class="text-center">$' + itemIntro + '$</div>' + '</div>' + '</div>' + '</div>';

                //如果没有参加课程，则不发送ajax
                if (!userEnroll) {
                    var noticeStr = '<div class="login-notice"><p class="text-center">您还没有参加任何课程！快去挑选心仪课程吧！</p></div>';
                    userCourseContainer.html(noticeStr);
                    return;
                }
                $.ajax({
                        url: '../php/homepage.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            type: 'getCoursesData',
                            courseStr: userEnroll
                        },
                    })
                    .done(function(result) {
                        fillInList(result.content, userCourseContainer, courseHtmlStr);
                    })
                    .fail(function() {
                        console.log("get courses data error");
                    })
                    .always(function(result) {
                        // console.log("complete");
                    });
            }

            function fillInList(content, container, htmlTemp) {
                var htmlList = '';
                container.html('');
                $(content).each(function(index, el) {
                    el.itemImgSrc = el.courseImgSrc || 'bg_imgloading.png';
                    htmlList += htmlTemp.temp(el);
                });
                container.html(htmlList);
            }
        }(ifLogin));

        /**
         * 用户参与轨迹
         */
        var userRoute = (function(ifLogin) {
            var userEnroll = getUserRoutes(userInfo.userId),
                userCourseContainer = $('#js_userRouteList');
            //未登录则不作更改
            if (ifLogin == 'false') {
                return;
            }
            createItem(userEnroll);


            //获取用户已参加课程信息
            function getUserRoutes(userId){
                var routeStr = '';
                $.ajax({
                    url: '../php/homepage.php',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        type: 'getRoutesId',
                        userId: userId
                    },
                    async: false
                })
                .done(function(result) {
                    if(result.status == '200'){
                        var routes = new Array();
                        $(result.content).each(function(index, el) {
                            routes.push(el.pathID);
                        });
                        routeStr = routes.join('&');
                    }
                })
                .fail(function() {
                    console.log("get user routes error");
                })
                .always(function() {
                    // console.log("complete");
                });
                return routeStr;
            }

            //@TODO: 2016-4-4
            function createItem(userEnroll) {
                //html模板
                var routes,
                    itemName = 'pathName',
                    itemIntro = 'pathDesc',
                    itemPath = './route.html?',
                    itemId = 'pathID',
                    imgUrl = '../images/path/',
                    itemImgSrc = 'itemImgSrc',
                    courseHtmlStr = '<div class="col-md-3 col-xs-6">' + '<div class="item-panel panel b-a">' + '<div class="item-pic">' + '<a target="_blank" href="' + itemPath + 'courseId=$' + itemId + '$"><img src="'+ imgUrl +'$' + itemImgSrc + '$" class="img-full" alt=""></a>' + '</div>' + '<div class="item-tit text-center font-bold text-md">' + '<a target="_blank" href="' + itemPath + 'courseId=$' + itemId + '$">$' + itemName + '$</a>' + '</div>' + '<div class="item-desc m-l-sm m-r-sm m-b-sm">' + '<div class="text-center">$' + itemIntro + '$</div>' + '</div>' + '</div>' + '</div>';

                //如果没有参加轨迹，则不发送ajax
                if (!userEnroll) {
                    var noticeStr = '<div class="login-notice"><p class="text-center">您还没有参加任何轨迹！</p></div>';
                    userCourseContainer.html(noticeStr);
                    return;
                }

                $.ajax({
                        url: '../php/homepage.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            type: 'getRoutesData',
                            routeStr: userEnroll
                        }
                    })
                    .done(function(result) {
                        console.log(result);
                        fillInList(result.content, userCourseContainer, courseHtmlStr);
                    })
                    .fail(function() {
                        console.log("get routes data error");
                    })
                    .always(function(result) {
                        // console.log("complete");
                    });
            }

            function fillInList(content, container, htmlTemp) {
                var htmlList = '';
                container.html('');
                $(content).each(function(index, el) {
                    el.itemImgSrc = el.courseImgSrc || 'bg_imgloading.png';
                    htmlList += htmlTemp.temp(el);
                });
                container.html(htmlList);
            }
        }(ifLogin));

        //填充推荐内容
        //@TODO：试试传入填充种类参数。三种填充内容公用一个填充函数。
        var fillRecommend = (function() {
            var courseItems = $('.recommend-course').find('.item-panel'),
                courseName = courseItems.find('.item-tit').find('a'),
                courseDesc = courseItems.find('.item-desc').find('div'),
                courseImg = courseItems.find('img'),
                url = '../images/course/';

            $.ajax({
                    url: '../php/homepage.php',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        type: 'recommend'
                    }
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
                        var imgSrc = result[index].courseImgSrc || 'bg_imgloading.png';
                        el.src = url + imgSrc;
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
