requirejs(['jquery', 'bootstrap', 'loginModule', 'nanoscroller', 'videojs', 'alert', 'api'],
    function(jquery, bootstrap, LoginModule, Scroller, VideoJs, Alert, API) {
        //验证登录状态
        var userInfo = LoginModule.verifyLogin(),
            ifLogin = userInfo.ifLogin, //@ATTENTION: 这里的ifLogin是字符串而不是boolean！
            rid = getQueryVariable('rid'),
            routeInfo,
            routeStatus;


        /**
         * nav setup
         */
        var navSetup = (function() {
            var curNodeId = getQueryVariable('nid');
            //routeInfo 轨迹基本信息
            $.ajax({
                    url: '../php/route.php',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        type: 'getRouteData',
                        routeId: rid
                    }
                })
                .done(function(result) {
                    // console.log("get route info success");
                    routeInfo = result;
                    fillNavInfo(routeInfo);
                })
                .fail(function() {
                    console.log("get route info error");
                })
                .always(function() {
                    // console.log("complete");
                });


            //填充导航内容
            function fillNavInfo(content) {
                var courseName,
                    courseId = content.courseID || '',
                    routeName = content.pathName || '',
                    routeNodesStr = content.nodeIDs || [],
                    navContainer = $('#js_routeNav'),
                    courseTit = $('#js_courseName'),
                    routeTit = $('#js_routeName'),
                    courseHref = './course.html?courseId=';

                // 获取课程信息
                $.ajax({
                        url: '../php/course.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            type: 'getCourseData',
                            courseId: courseId
                        },
                        async: false
                    })
                    .done(function(result) {
                        courseName = result.content.courseName;
                        //title
                        courseTit.html('<i class="glyphicon glyphicon-triangle-left"></i>' + courseName);
                        courseTit.attr('href', courseHref + courseId);
                        routeTit.text(routeName);

                    })
                    .fail(function() {
                        console.log("error");
                    })
                    .always(function() {
                        // console.log("complete");
                    });

                //nodes
                routeNodesStr && createNodes(navContainer, routeNodesStr);

                //填充页面正文内容
                pageSetup(curNodeId);


                //创建导航节点
                function createNodes(container, nodesStr) {
                    var playingNode = getQueryVariable('nid'),
                        playingClass = '',
                        htmlStr = '',
                        url = './route.html?rid=' + rid + '&nid=',
                        nodes;

                    $.ajax({
                            url: '../php/route-nodes.php',
                            type: 'GET',
                            dataType: 'json',
                            data: {
                                nodeStr: nodesStr
                            },
                            async: true
                        })
                        .done(function(result) {
                            nodes = result.content;
                            // 每个节点生成dom
                            $(nodes).each(function(index, el) {
                                if (playingNode === el.nodeID) {
                                    playingClass = 'playing';
                                } else {
                                    playingClass = '';
                                }
                                htmlStr += '<li class="nav-item"><a class="' + playingClass + '" href="' + url + el.nodeID + '" data-nid="' + el.nodeID + '"><div class="nav-icon"><div class="pipe"></div><div class="status"></div></div>' + '<span class="progress-title">' + el.nodeName + '</span></a></li>';
                            });

                            container && container.html(htmlStr);
                            getStatus();
                        })
                        .fail(function() {
                            console.log("error");
                        })
                        .always(function(result) {
                            // console.log("complete");
                        });

                    return;
                }

                // 填充status
                function getStatus() {
                    var done,
                        undone,
                        cur;

                    //routeStatus 当前学习状态
                    $.ajax({
                            url: '../php/route-status.php',
                            type: 'GET',
                            dataType: 'json',
                            data: {
                                routeStr: rid,
                                userId: userInfo.userId
                            }
                        })
                        .done(function(result) {
                            if (result.status == '0') {
                                setTimeout(function() {
                                    Alert.alert('.wrap', 'warning', '<strong>提示： </strong>您还没有加入该轨迹，观看记录将不会被记录！');
                                }, 1000);
                                return
                            } else if (result.status == '200') {
                                routeStatus = result.content[0];
                                fillStatus(routeStatus);
                                $('<span id="js_unenroll" class="btn-unenroll pull-right" title="退出轨迹"></span>').insertAfter('#js_routeName');

                                //绑定退出轨迹事件
                                $('#js_unenroll').on('click', function(event) {
                                    var answer = confirm('退出轨迹，该轨迹的学习记录将一并删除！确定退出？');

                                    if (answer) {
                                        API.unenrollRoutes({
                                            routeStr: rid,
                                            userId: userInfo.userId
                                        }, function(result) {
                                            if (result.status == '200') {
                                                alert('退出成功！');
                                                window.location.reload();
                                            }
                                        });
                                    }
                                });
                            }
                        })
                        .fail(function() {
                            console.log("get route status error");
                        })
                        .always(function(result) {
                            // console.log("complete");
                        });
                }

                //填充节点状态
                function fillStatus(routeStatus) {
                    var done = routeStatus.haveLearned ? routeStatus.haveLearned.split('&') : [];
                    undone = routeStatus.havenotLearned.split('&');
                    cur = routeStatus.isLearning.split('&');

                    //已完成
                    if (done.length) {
                        $(done).each(function(index, el) {
                            $('[data-nid=' + el + ']').addClass('done');
                        });
                    }
                    //未完成
                    $(undone).each(function(index, el) {
                        $('[data-nid=' + el + ']').addClass('undone');
                    });
                    //当前进度
                    $('[data-nid=' + cur + ']').addClass('cur');
                }

                return;
            }



            //更改正文
            function pageSetup(nodeId) {
                $.ajax({
                        url: '../php/route-nodes.php',
                        type: 'GET',
                        dataType: 'json',
                        data: { nodeStr: nodeId }
                    })
                    .done(function(result) {
                        console.log(result);
                        fillPageCont(result.content[0]);
                    })
                    .fail(function() {
                        console.log("error");
                    })
                    .always(function() {
                        // console.log("complete");
                    });

                return;
            }
            //填充正文内容
            function fillPageCont(content) {
                var pageTit = $('#js_pageTit'),
                    pageDesc = $('#js_pageDesc'),
                    video = $('#js_video'),
                    nodeName = content.nodeName || '',
                    nodeDesc = content.nodeDesc || '',
                    videoSrc = content.videoSrc || '',
                    subMaterial;

                pageTit.text(nodeName);
                pageDesc.text(nodeDesc);
                video.find('source').attr('src', videoSrc);

                // 补充资源

            }

        }());

        /**
         * scroller setup
         */
        $('.nano').nanoScroller({
            preventPageScrolling: true
        });

        /**
         * video setup
         */
        var videoSetup = (function() {
            var option = {
                    "controls": true,
                    "autoplay": false,
                    "preload": "none",
                    "width": "100%",
                },
                video = VideoJs('#js_video', option),
                nid = getQueryVariable('nid'),
                rid = getQueryVariable('rid');

            //播放结束后记录观看状态
            video.on('ended', function(event) {
                var next = recordStatus(routeStatus, nid);
                window.location.href = 'http://localhost/cucmooc/pages/route.html?rid='+rid+'&nid=' + next;
            });

            function recordStatus(records, curId) {
                var done = records.haveLearned.split('&'),
                    undone = records.havenotLearned.split('&'),
                    cur = records.isLearning,
                    nextCur;

                done.push(curId);
                nextCur = undone[0];
                undone.splice(jQuery.inArray(nextCur, undone), 1);
                done.join('&');
                undone.join('&');

                //新状态写入数据库
                $.ajax({
                        url: '/path/to/file',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            newHaveLearned: done,
                            newHavenotLearned: undone,
                            newIsLearning: nextCur
                        }
                    })
                    .done(function() {
                        console.log("record status success");
                    })
                    .fail(function() {
                        console.log("error");
                    })
                    .always(function() {
                        // console.log("complete");
                    });

                    return nextCur;
            }

        }());


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
