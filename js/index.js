requirejs(['jquery', 'bootstrap', 'loginModule', 'api'],
    function(jquery, bootstrap, LoginModule, API) {

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


        //绑定导航按钮事件
        var bindLoginEvent = (function() {
            var btnLogin = $('#js_indexLogin'),
                loginContainer = $('#js_loginFormPopup');

            //绑定登录按钮
            btnLogin.on('click', null, function(event) {
                LoginModule.loginPopup(loginContainer);
            });
        })();

        /**
         * 用户内容加载
         */
        var userDashBoard = (function(API, ifLogin) {
            var ifEnroll;


            //未登录 --> 推荐课程
            if (ifLogin === 'false') {
                setRecCourses();
            }

            //已登录
            if (ifLogin === 'true') {
                //隐藏登录提示
                $('.your-status').hide();
                //显示最近轨迹
                setLastRoute(userInfo.userId);
                setDashBoard();
            }

            //@TODO: loading
            $('#js_courseCont').load(function() {
                $(this).html('<p style="color:red">loading...</p>');
            });

            //显示最后观看轨迹
            function setLastRoute(userId) {
                var lastRid,
                    nodeCount,
                    haveLearned,
                    haveCount,
                    imgUrl = '../images/path/',
                    imgSrc = 'r01.jpg',
                    routeHref = './route.html?',
                    routeName,
                    curNodeId,
                    curNodeName,
                    progress,
                    lastRouteStr;


                API.getLastRoute({
                    userId: userId
                }, function(result) {
                    if (result.status == '200') {
                        lastRid = result.content.pathID;
                        routeHref += 'rid=' + lastRid;
                    }
                }, function() {
                    console.log('getLastRoute error');
                });

                API.getRoutesData({
                    routeStr: lastRid
                }, function(result) {
                    if (result.status == '200') {
                        var lastRoute = result.content[0];
                        routeName = lastRoute.pathName;
                        nodeCount = lastRoute.nodeCount;
                    }
                }, function() {
                    console.log('getRoutesData error');
                });

                API.getRouteStatus({
                    routeStr: lastRid,
                    userId: userId
                }, function(result) {
                    if (result.status == '200') {
                        curNodeId = result.content[0].isLearning;
                        routeHref += '&nid=' + curNodeId;
                        //计算进度
                        haveLearned = result.content[0].haveLearned.split('&');
                        haveCount = haveLearned.length;
                        progress = Math.ceil(haveCount / nodeCount * 10) * 10;
                    }
                }, function() {
                    console.log('getRouteStatus error');
                });

                API.getNodesData({
                    nodeStr: curNodeId
                }, function(result) {
                    if (result.status == '200') {
                        curNodeName = result.content[0].nodeName;
                    }
                }, function() {
                    console.log('getNodesData error');
                });

                lastRouteStr = '<p class="title text-center">最近动态</p><div class="last-route"><div class="row"><div class="col-md-4 col-xs-12">' + '<img class="img-full" src="' + imgUrl + imgSrc + '"></div><div class="col-md-6 col-xs-10">' + '<h4>' + routeName + '</h4><div class="progress">' + '<span class="bar" style="width: ' + progress + '%"><span>' + progress + '%</span></span></div>' + '<p>当前节点：' + curNodeName + '</p></div><a target="_blank" href="'+routeHref+'" class="more">more</a></div></div>';
                $('#js_lastRoute').html(lastRouteStr);
            }

            function setDashBoard() {
                $('.your-course').html('<div id="js_userCourseList" class="course-nav"></div><div id="js_courseCont"></div>');
                //判断用户选课
                API.getEnrollCourses({
                    userId: userInfo.userId
                }, function(result) {
                    var courseArr = [];
                    if (result.status == '200') {
                        ifEnroll = result.content.length > 0 ? true : false;
                    }
                    //未选课 --> 推荐课程
                    if (!ifEnroll) {
                        setRecCourses();
                    }
                    //已选课 --> 创建课程导航
                    else {
                        $(result.content).each(function(index, el) {
                            courseArr.push(el.courseID);
                        });
                        setTitle('.your-course', '您的课程');
                        createCourseNav('#js_userCourseList', courseArr);
                    }
                });
            }

            function setTitle(selector, title) {
                var container = $(selector),
                    title = title,
                    titStr = '<div class="row"><div class="wrapper clearfix">' + '<h3 class="text-center">' + title + '<span class="btn-manage" id="js_manage">管理<span class="icon-manage"></span></span><span class="btn-manage" id="js_finish">完成<span class="icon-manage"></span></span></h3></div></div>';

                container.prepend(titStr);

                //init
                $('#js_finish').addClass('hide');

                //绑定管理按钮事件
                $('.your-course').on('click', '.btn-manage', function(event) {
                    var $this = $(this),
                        type = $this.attr('id') == 'js_manage' ? 'manage' : 'finish';

                    $this.addClass('hide');
                    if (type == 'manage') {
                        $('#js_finish').removeClass('hide');
                        $('.btn-unenroll').removeClass('hide');
                        $('.course-nav-tab').on('click', blockClick);
                    } else {
                        $('#js_manage').removeClass('hide');
                        $('.btn-unenroll').addClass('hide');
                        $('.course-nav-tab').unbind('click', blockClick);
                    }
                });

                function blockClick() {
                    return false;
                }
            }

            function setRecCourses() {
                var container = $('.recommend-course'),
                    title = '推荐课程',
                    titStr = '<div class="row"><div class="wrapper clearfix">' + '<h3 class="pull-left">' + title + '</h3>' + '<button class="pull-right btn btn-default" href="#">查看更多</button>' + '</div></div>';

                container.html(titStr);
                refreshRecCourses('#js_recCourses');
            }

            function refreshRecCourses(selector) {
                API.getRecommendCourses({},
                    function(result) {
                        if (result.status == '200') {
                            // fillRecCourses(selector ,result.content);
                        }
                    },
                    function() {
                        alert('网络异常');
                    });
            }

            function fillRecCourses(selector, courses) {


                container.html(titStr);
                $(courses).each(function(index, el) {

                });
            }

            function createCourseNav(selector, enrollArr) {
                var container = $(selector),
                    enrollStr,
                    navHtml = '',
                    $curTab;

                //串接课程字符串
                enrollStr = enrollArr.join('&');
                //获取所有课程信息
                API.getCourseData({
                    courseStr: enrollStr
                }, function(result) {
                    if (result.status == '200') {
                        $(result.content).each(function(index, el) {
                            navHtml += '<li class="course-nav-tab" data-cid="' + el.courseID + '"><a>' + el.courseName + '<a/><span class="btn-unenroll hide" data-cid="' + el.courseID + '">退出课程</span></li>'
                        });
                        container.html(navHtml);

                        //init
                        $curTab = $($('.course-nav-tab')[0]);
                        $curTab.addClass('cur');
                        refreshCourseContent($curTab.attr('data-cid'));

                        //绑定事件
                        $('.course-nav').on('click', '.course-nav-tab', function(event) {
                            var cid,
                                $this = $(this);
                            if ($this === $curTab) {
                                return;
                            }
                            $this.addClass('cur');
                            $curTab.removeClass('cur');
                            $curTab = $this;
                            //获取cid，刷新ajax
                            cid = $this.attr('data-cid');
                            refreshCourseContent(cid);
                        });

                        //绑定退出课程事件
                        $('#js_userCourseList').on('click', '.btn-unenroll', function(event) {
                            var $this = $(this),
                                cid = $this.attr('data-cid'),
                                ridArr = [],
                                rids,
                                result;

                            result = confirm('如果退出课程，您在该课程下的学习轨迹将全部删除！ 确定退出？');

                            if (result) {
                                //获取用户参与的该课程的全部轨迹id
                                API.getEnrollRoutes({
                                    userId: userInfo.userId,
                                    courseId: cid
                                }, function(result) {
                                    if (result.status == '200') {
                                        $(result.content).each(function(index, el) {
                                            ridArr.push(el.pathID);
                                        });

                                        rids = ridArr.join('&');
                                    }
                                });

                                if (rids) {
                                    //退出该课程下所有轨迹
                                    API.unenrollRoutes({
                                        userId: userInfo.userId,
                                        routeStr: rids
                                    }, function(result) {
                                        console.log(result);
                                    });
                                }

                                //退出该课程
                                API.unenrollCourses({
                                    userId: userInfo.userId,
                                    courseStr: cid
                                }, function(result) {
                                    if (result.status == '200') {
                                        setDashBoard();
                                    }
                                }, function() {
                                    console.log('error');
                                });
                            }
                        });

                        //绑定退出轨迹事件
                        $('#js_courseCont').on('click', '.btn-unenroll', function(event) {
                            var $this = $(this),
                                rid = $this.attr('data-rid'),
                                result;

                            result = confirm('如果退出轨迹，您在该轨迹的学习记录将被删除！确定退出?');

                            if (result) {
                                API.unenrollRoutes({
                                    userId: userInfo.userId,
                                    routeStr: rid
                                }, function(result) {
                                    if (result.status == '200') {
                                        window.location.reload();
                                    }
                                }, function() {
                                    console.log('unenroll route error');
                                }, function(result) {
                                    console.log(result);
                                });
                            }
                        });
                    }
                }, function() {
                    alert('网络异常');
                });

                function refreshCourseContent(cid) {
                    var container = $('#js_courseCont'),
                        ifRoutes, //是否已选轨迹
                        routesArr = [],
                        routesStr = '',
                        htmlStr = '';

                    //获取该课程的所有已参与轨迹
                    API.getEnrollRoutes({
                        userId: userInfo.userId,
                        courseId: cid
                    }, function(result) {
                        if (result.status == '200') {
                            ifRoutes = result.content.length > 0 ? true : false;
                            if (ifRoutes) {
                                $(result.content).each(function(index, el) {
                                    routesArr.push(el.pathID);
                                });
                            }
                        }
                    });

                    //未选轨迹 --> 推荐轨迹
                    if (!ifRoutes) {
                        //@TODO: 推荐轨迹
                    } else {
                        // 串接轨迹字符串
                        routesStr = routesArr.join('&');
                        fillRoutes(routesStr);
                    }

                }
            }

            function fillRoutes(routesStr) {
                //html模板
                var routes,
                    itemName = 'pathName',
                    itemIntro = 'pathDesc',
                    itemPath = './route.html?',
                    itemId = 'pathID',
                    imgUrl = '../images/path/',
                    itemImgSrc = 'bg_imgloading.png',
                    routeHtmlStr = '',
                    routeCont,
                    routeStatus = [];

                API.getRouteStatus({
                    routeStr: routesStr,
                    userId: userInfo.userId
                }, function(result) {
                    if (result.status == '200') {
                        $(result.content).each(function(index, el) {
                            routeStatus.push(el.isLearning);
                        });
                    }
                }, function() {
                    console.log('getRouteStatus error');
                });

                // 获取轨迹信息
                API.getRoutesData({
                    routeStr: routesStr
                }, function(result) {
                    if (result.status == '200') {
                        routeCont = result.content;
                    }
                });

                $(routeCont).each(function(index, el) {
                    routeHtmlStr += '<div class="col-md-3 col-xs-6">' + '<div class="item-panel panel b-a"><span class="btn-unenroll hide" data-rid="' + el.pathID + '">unenroll</span>' + '<div class="item-pic">' + '<a target="_blank" href="' + itemPath + 'rid=' + el.pathID + '&nid=' + routeStatus[index] + '"><img src="' + imgUrl + itemImgSrc + '" class="img-full" alt=""></a>' + '</div>' + '<div class="item-tit text-center font-bold text-md">' + '<a target="_blank" href="' + itemPath + 'rid=' + el.pathID + '&nid=' + routeStatus[index] + '">' + el.pathName + '</a>' + '</div>' + '<div class="item-desc m-l-sm m-r-sm m-b-sm">' + '<div class="text-center">' + el.pathDesc + '</div>' + '</div>' + '</div>' + '</div>';
                });
                $('#js_courseCont').html(routeHtmlStr);
                // routeHtmlStr = '<div class="col-md-3 col-xs-6">' + '<div class="item-panel panel b-a"><span class="btn-unenroll hide" data-rid="$' + itemId + '$">unenroll</span>' + '<div class="item-pic">' + '<a target="_blank" href="' + itemPath + 'rid=$' + itemId + '$"><img src="' + imgUrl + '$' + itemImgSrc + '$" class="img-full" alt=""></a>' + '</div>' + '<div class="item-tit text-center font-bold text-md">' + '<a target="_blank" href="' + itemPath + 'rid=$' + itemId + '$">$' + itemName + '$</a>' + '</div>' + '<div class="item-desc m-l-sm m-r-sm m-b-sm">' + '<div class="text-center">$' + itemIntro + '$</div>' + '</div>' + '</div>' + '</div>';

                // fillInList(cont, $('#js_courseCont'), routeHtmlStr);
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
        }(API, ifLogin));

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
            function getUserCourses(userId) {
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
                        if (result.status == '200') {
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
                    courseHtmlStr = '<div class="col-md-3 col-xs-6">' + '<div class="item-panel panel b-a">' + '<div class="item-pic">' + '<a target="_blank" href="' + itemPath + 'courseId=$' + itemId + '$"><img src="' + imgUrl + '$' + itemImgSrc + '$" class="img-full" alt=""></a>' + '</div>' + '<div class="item-tit text-center font-bold text-md">' + '<a target="_blank" href="' + itemPath + 'courseId=$' + itemId + '$">$' + itemName + '$</a>' + '</div>' + '<div class="item-desc m-l-sm m-r-sm m-b-sm">' + '<div class="text-center">$' + itemIntro + '$</div>' + '</div>' + '</div>' + '</div>';

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

            // function fillInList(content, container, htmlTemp) {
            //     var htmlList = '';
            //     container.html('');
            //     $(content).each(function(index, el) {
            //         el.itemImgSrc = el.courseImgSrc || 'bg_imgloading.png';
            //         htmlList += htmlTemp.temp(el);
            //     });
            //     container.html(htmlList);
            // }
        });

        /**
         * 用户参与轨迹
         */
        // var userRoute = (function(ifLogin) {
        //     var userEnroll = getUserRoutes(userInfo.userId),
        //         userCourseContainer = $('#js_userRouteList');
        //     //未登录则不作更改
        //     if (ifLogin == 'false') {
        //         return;
        //     }
        //     createItem(userEnroll);


        //     //获取用户已参加轨迹信息
        //     function getUserRoutes(userId) {
        //         var routeStr = '';
        //         $.ajax({
        //                 url: '../php/homepage.php',
        //                 type: 'GET',
        //                 dataType: 'json',
        //                 data: {
        //                     type: 'getRoutesId',
        //                     userId: userId
        //                 },
        //                 async: false
        //             })
        //             .done(function(result) {
        //                 if (result.status == '200') {
        //                     var routes = new Array();
        //                     $(result.content).each(function(index, el) {
        //                         routes.push(el.pathID);
        //                     });
        //                     routeStr = routes.join('&');
        //                 }
        //             })
        //             .fail(function() {
        //                 console.log("get user routes error");
        //             })
        //             .always(function() {
        //                 // console.log("complete");
        //             });
        //         return routeStr;
        //     }

        //     //@TODO: 2016-4-4
        //     function createItem(userEnroll) {
        //         //html模板
        //         var routes,
        //             itemName = 'pathName',
        //             itemIntro = 'pathDesc',
        //             itemPath = './route.html?',
        //             itemId = 'pathID',
        //             imgUrl = '../images/path/',
        //             itemImgSrc = 'itemImgSrc',
        //             cur,
        //             courseHtmlStr = '<div class="col-md-3 col-xs-6">' + '<div class="item-panel panel b-a">' + '<div class="item-pic">' + '<a target="_blank" href="' + itemPath + 'rid=$' + itemId + '$"><img src="' + imgUrl + '$' + itemImgSrc + '$" class="img-full" alt=""></a>' + '</div>' + '<div class="item-tit text-center font-bold text-md">' + '<a target="_blank" href="' + itemPath + 'rid=$' + itemId + '$">$' + itemName + '$</a>' + '</div>' + '<div class="item-desc m-l-sm m-r-sm m-b-sm">' + '<div class="text-center">$' + itemIntro + '$</div>' + '</div>' + '</div>' + '</div>';

        //         //如果没有参加轨迹，则不发送ajax
        //         if (!userEnroll) {
        //             var noticeStr = '<div class="login-notice"><p class="text-center">您还没有参加任何轨迹！</p></div>';
        //             userCourseContainer.html(noticeStr);
        //             return;
        //         }

        //         $.ajax({
        //                 url: '../php/homepage.php',
        //                 type: 'GET',
        //                 dataType: 'json',
        //                 data: {
        //                     type: 'getRoutesData',
        //                     routeStr: userEnroll
        //                 }
        //             })
        //             .done(function(result) {
        //                 console.log(result);
        //                 fillInList(result.content, userCourseContainer, courseHtmlStr);
        //             })
        //             .fail(function() {
        //                 console.log("get routes data error");
        //             })
        //             .always(function(result) {
        //                 // console.log("complete");
        //             });
        //     }

        //     //@TODO: status
        //     function getStatus(routeId, userId) {
        //         var cur;

        //         //routeStatus 当前学习状态
        //         $.ajax({
        //                 url: '../php/route-status.php',
        //                 type: 'GET',
        //                 dataType: 'json',
        //                 data: {
        //                     routeId: routeId,
        //                     userId: userId
        //                 },
        //                 async: false
        //             })
        //             .done(function(result) {
        //                 if (result.status == '200') {
        //                     routeStatus = result.content;
        //                     cur = routeStatus.isLearning || '';
        //                 }
        //             })
        //             .fail(function() {
        //                 console.log("get route status error");
        //             })
        //             .always(function(result) {
        //                 // console.log("complete");
        //             });

        //         return cur;
        //     }

        //     function fillInList(content, container, htmlTemp) {
        //         var htmlList = '';
        //         container.html('');
        //         $(content).each(function(index, el) {
        //             el.itemImgSrc = el.courseImgSrc || 'bg_imgloading.png';
        //             htmlList += htmlTemp.temp(el);
        //         });
        //         container.html(htmlList);
        //     }
        // }(ifLogin));

        // //填充推荐内容
        // //@TODO：试试传入填充种类参数。三种填充内容公用一个填充函数。
        // var fillRecommend = (function() {
        //     var courseItems = $('.recommend-course').find('.item-panel'),
        //         courseName = courseItems.find('.item-tit').find('a'),
        //         courseDesc = courseItems.find('.item-desc').find('div'),
        //         courseImg = courseItems.find('img'),
        //         url = '../images/course/';

        //     $.ajax({
        //             url: '../php/homepage.php',
        //             type: 'GET',
        //             dataType: 'json',
        //             data: {
        //                 type: 'recommend'
        //             }
        //         })
        //         .done(function(result) {
        //             console.log('recommend course load success');
        //             //推荐课程数量固定，故直接填充，不动态生成
        //             courseName.each(function(index, el) {
        //                 // el.innerText = result[index].courseName;
        //                 // firefox 不支持innerText
        //                 $(el).text(result[index].courseName);
        //             });
        //             courseDesc.each(function(index, el) {
        //                 // el.innerText = result[index].courseDesc;
        //                 $(el).text(result[index].courseDesc);
        //             });

        //             courseImg.each(function(index, el) {
        //                 var imgSrc = result[index].courseImgSrc || 'bg_imgloading.png';
        //                 el.src = url + imgSrc;
        //             });
        //         })
        //         .fail(function() {
        //             console.log("recommend course load error");
        //         })
        //         .always(function() {
        //             // console.log("complete");
        //         });
        // }());

    });
