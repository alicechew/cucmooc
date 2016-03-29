requirejs(['jquery', 'bootstrap', 'loginModule', 'nanoscroller', 'videojs'],
    function(jquery, bootstrap, LoginModule, Scroller, VideoJs) {

        //验证登录状态
        var userInfo = LoginModule.verifyLogin(),
            ifLogin = userInfo.ifLogin; //@ATTENTION: 这里的ifLogin是字符串而不是boolean！

        /**
         * nav setup
         */
        var navSetup = (function() {
            var routeId = 'c01r01',
                curNodeId = 'c01r01n03';

            /**
             * @QUESTION: currentNode要存在数据库orSECCTION
             */

            $.ajax({
                    url: '../js/data/route.json',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        // routeId: routeId
                    }
                })
                .done(function(result) {
                    console.log("route setup success");
                    fillNavInfo(result);
                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    // console.log("complete");
                });

            //填充导航内容
            function fillNavInfo(content) {
                var courseName = content.courseName || '',
                    courseId = content.courseId || '',
                    routeName = content.routeName || '',
                    routeNodes = content.routeNodes || [],
                    navContainer = $('#js_routeNav'),
                    courseTit = $('#js_courseName'),
                    routeTit = $('#js_routeName'),
                    courseHref = './course.html?id=';

                //title
                courseTit.html('<i class="glyphicon glyphicon-triangle-left"></i>' + courseName);
                courseTit.attr('href', courseHref + courseId);
                routeTit.text(routeName);

                //nodes
                routeNodes && createNodes(navContainer, routeNodes);

                //page
                pageSetup(curNodeId);
                return;
            }

            //创建导航节点
            function createNodes(container, nodes) {
                var playingNode = getQueryVariable('nid'),
                    playingClass = '',
                    htmlStr = '',
                    url = './route.html?rid=' + routeId + '&nid=';

                $(nodes).each(function(index, el) {
                    if(playingNode === el.nodeId){
                        playingClass = 'playing';
                    }else{
                        playingClass = '';
                    }
                    htmlStr += '<li class="nav-item"><a class="'
                    + el.nodeStatus + ' ' + playingClass +'" href="'
                    + url + el.nodeId + '"><div class="nav-icon"><div class="pipe"></div><div class="status"></div></div>'
                    + '<span class="progress-title">' + el.nodeName + '</span></a></li>';
                });

                container && container.html(htmlStr);

                return;
            }

            //更改正文
            function pageSetup(nodeId){
                $.ajax({
                    url: '../js/data/route-node.json',
                    type: 'GET',
                    dataType: 'json',
                    data: {nodeId: nodeId}
                })
                .done(function(result) {
                    console.log("get page cont success");
                    fillPageCont(result[0]);
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
            function fillPageCont(content){
                var pageTit = $('#js_pageTit'),
                    pageDesc = $('#js_pageDesc'),
                    video = $('#js_video'),
                    nodeName = content.nodeName || '',
                    nodeDesc = content.nodeDesc || '',
                    videoSrc = content.videoSrc || '';

                    pageTit.text(nodeName);
                    pageDesc.text(nodeDesc);
                    video.find('source').attr('src',videoSrc);
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
            };

            VideoJs('#js_video', option);
        }());
    });