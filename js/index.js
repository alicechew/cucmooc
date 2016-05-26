/**
 * author: Shuang Qiu
 * Ver: 0.1
 * Update Time: 2016/5/18
 */

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
            var ifEnroll,
                curCourse;

            setRecCourses();
            //未登录 --> 推荐课程
            // if (ifLogin === 'false') {

            // }

            //已登录
            if (ifLogin === 'true') {
                //隐藏登录提示
                $('.your-status').hide();
                //显示最近轨迹
                curCourse = setLastRoute(userInfo.userId);
                setDashBoard(curCourse);
            }

            //@TODO: loading
            // $('#js_courseCont').load(function() {
            //     $(this).html('<p style="color:red">loading...</p>');
            // });

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
                    lastRouteStr,
                    lastCourseId;


                API.getLastRoute({
                    userId: userId
                }, function(result) {
                    if (result.status == '200') {
                        lastRid = result.content[0].pathID;
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
                        lastCourseId = lastRoute.courseID;
                        nodeCount = lastRoute.nodeCount;
                        imgSrc = lastRoute.imgSrc;
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

                lastRouteStr = '<p class="title text-center">最近动态</p><div class="last-route"><div class="row"><div class="col-md-4 col-xs-12">' + '<img class="img-full" src="' + imgUrl + imgSrc + '"></div><div class="col-md-6 col-xs-10">' + '<h4>' + routeName + '</h4><div class="progress">' + '<span class="bar" style="width: ' + progress + '%"><span>' + progress + '%</span></span></div>' + '<p>当前节点：' + curNodeName + '</p></div><a target="_blank" href="' + routeHref + '" class="more">more</a></div></div>';
                $('#js_lastRoute').html(lastRouteStr);


                return lastCourseId;
            }

            function setDashBoard(curCourseId) {
                $('.your-course').html('<div id="js_userCourseList" class="course-nav"></div><div id="js_courseCont" class="row"></div>');
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
                        createCourseNav('#js_userCourseList', courseArr, curCourseId);

                        //快速导航
                        setQuickNav('#js_quicknavWrap');
                    }
                });
            }

            function setQuickNav(selector) {
                var container = $(selector),
                    navHtml,
                    position,
                    urcId = 'js_qn_urc',
                    recId = 'js_qn_rec',
                    $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body'); // 这行是 Opera 的补丁, 少了它 Opera 是直接用跳的而且画面闪烁;

                navHtml = '<div id="js_quicknav" class="quicknav"><div id="' + urcId + '" class="quicknav-item">最近动态</div>' + '<div class="line-wrap text-center"><div class="line"></div></div>' + '<div id="' + recId + '" class="quicknav-item">推荐课程</div></div>';

                container.html(navHtml);
                //滚至推荐课程
                $(selector).on('click', '#' + recId, function(event) {
                    $body.animate({
                            scrollTop: $('#js_rec').offset().top - $('#nav_collapse').height() //注意这里不要先把高度存起来，因为有可能页面还没加载完，所以还是点击的时候再计算高度
                        },
                        800);

                    return false; //返回false避免在原链接后加上#
                });

                $(selector).on('click', '#' + urcId, function(event) {
                    $body.animate({
                            scrollTop: $('#js_lastRoute').offset().top - $('#nav_collapse').height()
                        },
                        800);

                    return false; //返回false避免在原链接后加上#
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

                function blockClick(ev) {
                    if (!$(ev.target).hasClass('btn-unenroll')) {
                        return false;
                    }
                }
            }

            function setRecCourses() {
                refreshRecCourses('#js_recCourses');
            }

            function refreshRecCourses(selector) {
                API.getRecommendCourses({},
                    function(result) {
                        if (result.status == '200') {
                            fillRecCourses(selector, result.content);
                        }
                    },
                    function() {
                        alert('网络异常');
                    });
            }

            function fillRecCourses(selector, courses) {
                var recCourseHtml = '',
                    itemUrl = './course.html?courseId=',
                    hotIndex,
                    imgUrl = '../images/course/';

                $(courses).each(function(index, el) {
                    el.courseImgSrc = el.courseImgSrc || 'bg_imgloading.png';
                    recCourseHtml += '<div class="col-md-6 col-xs-12"><a target="_blank" class="item" href="' + itemUrl + el.courseID + '">' + '<div class="rec-panel"><div class="tab"><span>热度</span></br><span class="hot-index">' + el.courseHeat + '</span></div>' + '<div class="row"><div class="rec-pic col-md-5 col-xs-5"><img class="img-full" src="' + imgUrl + el.courseImgSrc + '" alt=""></div>' + '<div class="rec-info col-md-7 col-xs-7"><p class="title">' + el.courseName + '</p><p class="desc">' + el.courseDesc + '</p></div></div></div></a></div>'
                });
                $(selector).html(recCourseHtml);
            }

            function createCourseNav(selector, enrollArr, curCourseId) {
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
                        $curTab = $($('.course-nav').find('[data-cid="' + curCourseId + '"]')[0]);
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
                        setRecRoutes('#js_courseCont', cid);
                    } else {
                        // 串接轨迹字符串
                        routesStr = routesArr.join('&');
                        fillRoutes(routesStr);
                    }

                }
            }

            function setRecRoutes(selector, cid) {
                var container = $(selector),
                    recRouteHtml = '',
                    pathName = 'pathName',
                    pathDesc = 'pathDesc',
                    itemPath = './route.html?',
                    pathID = '2',
                    imgUrl = '../images/path/',
                    routeCont,
                    index = 1,
                    routeStatus = ['1'];

                API.getRecommendRoutes({
                        courseId: cid
                    },
                    function(result) {
                        if (result.status == '200') {
                            $(result.content).each(function(index, el) {
                                el.imgScr = el.imgSrc || 'bg_imgloading.png';
                                recRouteHtml += '<div class="col-md-3 col-xs-6">' + '<div class="item-panel panel b-a"><span class="icon-corner"></span>' + '<div class="item-pic">' + '<a target="_blank" href="' + itemPath + 'rid=' + el.pathID + '&nid=' + routeStatus[index] + '"><img src="' + imgUrl + el.imgScr + '" class="img-full" alt=""></a>' + '</div>' + '<div class="item-tit text-center font-bold text-md">' + '<a target="_blank" href="' + itemPath + 'rid=' + el.pathID + '&nid=' + routeStatus[index] + '">' + el.pathName + '</a>' + '</div>' + '<div class="item-desc m-l-sm m-r-sm m-b-sm">' + '<div class="text-center">' + el.pathDesc + '</div>' + '</div>' + '</div>' + '</div>';
                            });
                        }
                    });


                container.html(recRouteHtml);
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
                    itemImgSrc = el.imgSrc;
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

                API.getEnrollCourses({
                    type: 'getCoursesId',
                    userId: userId
                }, function(result) {
                    if (result.status == '200') {
                        var courses = new Array();
                        $(result.content).each(function(index, el) {
                            courses.push(el.courseID);
                        });
                        courseStr = courses.join('&');
                    }
                }, function() {
                    console.log('get user courses error');
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

                API.getCourseData({
                    type: 'getCoursesData',
                    courseStr: userEnroll
                }, function(result){
                    fillInList(result.content, userCourseContainer, courseHtmlStr);
                }, function(){
                    console.log('get courses data error');
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

    });
