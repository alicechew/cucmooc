requirejs(['jquery', 'bootstrap', 'loginModule'],
    function(jquery, bootstrap, LoginModule) {

        //验证登录状态
        var userInfo = LoginModule.verifyLogin(),
            ifLogin = userInfo.ifLogin; //@ATTENTION: 这里的ifLogin是字符串而不是boolean！

        var courseData;
        $(document).ready(function() {
            var courseId = getQueryVariable('courseId'),
                btnEnroll = $('#js_btnEnroll'),
                btnFav = $('#js_btnFav'),
                userEnroll = userInfo.userEnroll,
                ifEnroll;

            getCourseInfo();
            fillRoute('#js_routeList', courseId);
            if (ifLogin == 'false') {
                ifEnroll = 'false';
            } else {
                ifEnroll = verifyUserEnroll(userInfo.userId, courseId);
            }


            //绑定按钮tooltip
            btnEnroll.tooltip({
                trigger: 'manual',
                title: '选课成功！',
                placement: 'top'
            });

            // 绑定按钮事件
            btnEnroll.on('click', null, function(event) {
                //未登录
                if (ifLogin === 'false') {
                    alert('请先登录！');
                    return;
                }
                //已参加
                if (ifEnroll) {
                    return;
                } else {
                    //发送到服务器
                    $.ajax({
                            url: '../php/course.php',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                type: 'enrollCourse',
                                userId: userInfo.userId,
                                courseId: courseId
                            }
                        })
                        .done(function(result) {
                            if (result.status == '200') {
                                //成功则popup
                                btnEnroll.tooltip('show');
                                setTimeout(function() {
                                    btnEnroll.tooltip('hide');
                                }, 1000);
                                //按钮状态变更
                                btnEnroll.text('已订阅');
                                btnEnroll.addClass('disabled');
                            } else if (result.status == '0') {
                                alert('选课失败，请稍后重试');
                            }
                        })
                        .fail(function() {
                            console.log("enroll course error");
                        })
                        .always(function(result) {
                            // console.log("complete");
                        });
                }
            });

            //获取课程信息
            function getCourseInfo() {
                $.ajax({
                        url: '../php/course.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            type: 'getCourseData',
                            courseId: courseId
                        }
                    })
                    .done(function(result) {
                        courseData = result.content;
                        fillInfo(courseData.subjectID, courseData.courseName, courseData.courseIntro, courseData.courseImgSrc);
                        createKnowList('#js_kldgPoint', courseId);
                    })
                    .fail(function() {
                        console.log("get course info error");
                    })
                    .always(function() {
                        // console.log("complete");
                    });
            }

            //填充基本信息
            function fillInfo(subjectId, courseName, courseDesc, imgSrc) {
                var subjectEl = $('#js_subject'),
                    courseEl = $('#js_course'),
                    nameEl = $('#js_courseName'),
                    descEl = $('#js_courseDesc'),
                    imgEl = $('#js_courseImg'),
                    url = '../images/course/',
                    pointIndex = 0,
                    subjectName;

                //获取学科名称
                $.ajax({
                        url: '../php/subject.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            type: 'getSubjectInfo',
                            subjectId: subjectId
                        }
                    })
                    .done(function(result) {
                        if (result.status == '200') {
                            subjectName = result.content.subjectName;
                        }
                    })
                    .fail(function() {
                        console.log("get subject name error");
                    })
                    .always(function() {
                        // console.log("complete");
                    });

                subjectEl.text(subjectName);
                courseEl.text(courseName);
                nameEl.text(courseName);
                descEl.text(courseDesc);
                imgEl.attr('src', url + imgSrc);
            }
            //创建知识点列表
            function createKnowList(selector, courseId) {
                var container = $(selector);

                $.ajax({
                        url: '../php/point.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            type: 'getPoints',
                            courseId: courseId
                        }
                    })
                    .done(function(result) {
                        var points = result.content;
                        $(points).each(function(index, el) {
                            fillList(container, el);
                        });
                    })
                    .fail(function() {
                        console.log("get points error");
                    })
                    .always(function() {});

                // 展开按钮事件委托
                //列表展开按钮事件(temp)
                container.on('click', '.point-btn', function(event) {
                    var $this = $(this),
                        index = $this.attr('data-tab'),
                        subList;

                    $this && $this.find('.bar2').toggleClass('open-bar');
                    subList = container.find('ul[data-list=' + index + ']');
                    subList && subList.slideToggle(400);
                });
            }
            //填充知识点列表
            function fillList(container, point) {
                var oriHTML = container.html(),
                    pointLevel = point.pointLevel,
                    pointTitle = point.pointName,
                    ifChild = point.ifChild,
                    ifParent = point.parentPoint ? true : false,
                    tabIndex,
                    btnString,
                    listString,
                    subListString,
                    pointHref = './knowledge-point.html';

                //判断该知识点是否有子知识点
                if (ifChild == '1') {
                    tabIndex = point.pointID;
                    //生成展开按钮
                    btnString = '<span class="point-btn" data-tab="' + tabIndex + '"><span class="bar"></span><span class="bar bar2 open-bar"></span></span>';
                    //若有子级知识点则创建ul留空
                    subListString = '<ul data-list="' + tabIndex + '"></ul>';
                } else {
                    btnString = '';
                    subListString = '';
                }
                //拼合单点列表
                listString = '<li class="point-level-' + pointLevel + '">' + btnString + '<a target="_blank" href="' + pointHref + '">' + pointTitle + '</a>' + subListString + '</li>';

                //判断该知识点是否有父级知识点，若有则插入到该父节点的ul
                if (ifParent) {
                    $('ul[data-list="' + point.parentPoint + '"]').append(listString);
                } else {
                    oriHTML += listString;
                    container.html(oriHTML);
                }
            }
            //判断用户是否参与课程
            function verifyUserEnroll(userId, courseId) {
                var enrollResult;
                $.ajax({
                        url: '../php/course.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            type: 'verifyEnroll',
                            userId: userId,
                            courseId: courseId
                        },
                    })
                    .done(function(result) {
                        if (result.status == '0') { //未参加课程
                            enrollResult = false;
                        } else if (result.status == '200') { //已参加课程
                            enrollResult = true;
                            btnEnroll.text('已订阅');
                            btnEnroll.addClass('disabled');
                        }

                        return enrollResult;
                    })
                    .fail(function() {
                        console.log("verify user enroll error");
                    })
                    .always(function(result) {
                        // console.log("complete");
                    });
            }
            //填充轨迹
            function fillRoute(selector, courseId) {
                var container = $(selector),
                    htmlStr;

                $.ajax({
                        url: '../php/course.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            type: 'getRoute',
                            courseId: courseId
                        }
                    })
                    .done(function(result) {
                        var cont = result.content,
                            rid,
                            title,
                            desc,
                            htmlStr = '';

                        $(cont).each(function(index, el) {
                            rid = el.pathID || '';
                            title = el.pathName || '';
                            desc = el.pathDesc || '';
                            htmlStr += '<li class="route" data-rid="' + rid + '">' + '<a><div class="title m-b-sm">' + title + '</div>' + '<div class="intro">' + desc + '</div></a></li>';
                        });

                        container.html(htmlStr);
                    })
                    .fail(function() {
                        console.log("get route info error");
                    })
                    .always(function() {
                        // console.log("complete");
                    });

            }
            //获取url参数
            function getQueryVariable(variable) {
                var query = window.location.search.substring(1),
                    vars = query.split('&');
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split('=');
                    if (pair[0] == variable) {
                        return pair[1];
                    }
                }
                return false;
            }

        });


        /**
         * route模块
         */
        var route = (function() {
            var modalEl = $('#js_routeModal'),
                btnEnrollRoute = $('#js_btnEnrollRoute'),
                routeNodes = new Array();

            $('#js_routeList').on('click', '.route', function(event) {
                modalEl.modal('show', $(this));
            });
            //加载modal内容
            modalEl.on('show.bs.modal', function(event) {
                var routeId = $(event.relatedTarget).attr('data-rid'),
                    userId = userInfo.userId;


                $(this).attr('data-rid', routeId);

                getRouteNode(routeId);
                //判断用户是否已加入该轨迹
                $.ajax({
                        url: '../php/route-status.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            routeStr: routeId,
                            userId: userId
                        }
                    })
                    .done(function(result) {
                        if (result.status == '200') {
                            //按钮状态变更
                            btnEnrollRoute.text('已加入');
                            btnEnrollRoute.addClass('disabled');
                            return;
                        } else {
                            //按钮状态变更
                            btnEnrollRoute.text('加入轨迹');
                            btnEnrollRoute.removeClass('disabled');
                        }
                    })
                    .fail(function() {
                        console.log("verify route error");
                    })
                    .always(function() {
                        // console.log("complete");
                    });

            });



            //加入轨迹按钮事件绑定
            btnEnrollRoute.on('click', function(event) {
                var routeId = modalEl.attr('data-rid'),
                    userId = userInfo.userId,
                    nodeStr,
                    firstNode;

                firstNode = routeNodes[0];
                routeNodes.shift();
                nodeStr = routeNodes.join('&');

                if (ifLogin == 'false') {
                    alert('请先登录!');
                    return;
                }
                $.ajax({
                        url: '../php/course.php',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            type: 'enrollRoute',
                            userId: userId,
                            routeId: routeId,
                            first: firstNode,
                            nodeStr: nodeStr
                        }
                    })
                    .done(function(result) {
                        if (result.status == '200') {
                            //弹出tooltip
                            btnEnrollRoute.tooltip('show');
                            setTimeout(function() {
                                btnEnrollRoute.tooltip('hide');
                            }, 1000);

                            //按钮状态变更
                            btnEnrollRoute.text('已加入');
                            btnEnrollRoute.addClass('disabled');
                        }
                    })
                    .fail(function() {
                        console.log("enroll route error");
                    })
                    .always(function() {
                        // console.log("complete");
                    });

                if (ifLogin == 'false') {
                    return;
                }
                //绑定tooltip
                btnEnrollRoute.tooltip({
                    trigger: 'manual',
                    title: '加入轨迹成功！',
                    placement: 'top'
                });
            });

            function getRouteNode(routeId) {
                var nodeStr = '';
                //获取轨迹节点信息
                $.ajax({
                        url: '../php/route.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            type: 'getRouteData',
                            routeId: routeId
                        }
                    })
                    .done(function(result) {
                        fillModal(result);
                        nodeStr = result.nodeIDs;
                        getNodes(routeId, nodeStr);
                    })
                    .fail(function() {
                        console.log("error");
                    })
                    .always(function() {
                        // console.log("complete");
                    });

                return;
            }

            function fillModal(cont) {
                var header = $('.route-info');
                header.find('h3').text(cont.pathName);
                header.find('p').text(cont.pathDesc);

                return;
            }

            function getNodes(routeId, nodeStr) {
                //获取轨迹节点内容
                $.ajax({
                        url: '../php/route-nodes.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            nodeStr: nodeStr
                        }
                    })
                    .done(function(result) {
                        var container = $('#js_modalNodeList'),
                            htmlStr = '',
                            firstNodeId = result.content[0].nodeID;

                        routeNodes = [];
                        $(result.content).each(function(index, el) {
                            var title = el.nodeName,
                                nid = el.nodeID;
                            routeNodes.push(el.nodeID);
                            htmlStr += '<li class="nav-item"><a data-nid="' + nid + '"><div class="nav-icon"><div class="pipe"></div><div class="status"></div></div>' + '<span class="progress-title">' + title + '</span></a>';
                        });
                        container.html(htmlStr);
                        getStatus(routeId, userInfo.userId, firstNodeId);
                    })
                    .fail(function() {
                        console.log("get route node error");
                    })
                    .always(function() {
                        // console.log("complete");
                    });
            }
            // 填充status
            function getStatus(routeId, userId, firstNodeId) {
                var done,
                    undone,
                    cur,
                    url = './route.html?rid=';

                //routeStatus 当前学习状态
                $.ajax({
                        url: '../php/route-status.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            routeStr: routeId,
                            userId: userId
                        },
                        async: false
                    })
                    .done(function(result) {
                        if (result.status == '0') {
                            //按钮路径
                            $('#js_btnOpenRoute').attr('href', url + routeId + '&nid=' + firstNodeId);
                            return;
                        } else if (result.status == '200') {
                            routeStatus = result.content[0];
                            fillStatus(routeId, routeStatus);
                        }
                    })
                    .fail(function() {
                        console.log("get route status error");
                    })
                    .always(function(result) {
                        console.log(result);
                    });
            }
            //填充节点状态
            function fillStatus(routeId, routeStatus) {
                var done = routeStatus.haveLearned ? routeStatus.haveLearned.split('&') : '',
                    undone = routeStatus.havenotLearned ? routeStatus.havenotLearned.split('&') : '',
                    cur = routeStatus.isLearning ? routeStatus.isLearning.split('&') : '',
                    url = './route.html?rid=';
                //已完成
                if (done) {
                    $(done).each(function(index, el) {
                        $('[data-nid=' + el + ']').addClass('done');
                    });
                }
                //未完成
                if (undone) {
                    $(undone).each(function(index, el) {
                        $('[data-nid=' + el + ']').addClass('undone');
                    });
                }
                //当前进度
                if (cur) {
                    $('[data-nid=' + cur + ']').addClass('cur');
                    //按钮路径
                    $('#js_btnOpenRoute').attr('href', url + routeId + '&nid=' + cur);
                }
            }
        }());
    });
