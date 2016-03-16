requirejs(['jquery', 'bootstrap', 'loginModule'],
    function(jquery, bootstrap, LoginModule) {

        //验证登录状态
        var userInfo = LoginModule.verifyLogin(),
            ifLogin = userInfo.ifLogin; //@ATTENTION: 这里的ifLogin是字符串而不是boolean！

        var pointData = {
            "subjectId":"01",
            "subjectName": 'IT互联网',
            "courseId":"01",
            "courseName": "php基础",
            "pointId":"0101",
            "pointName": "php基本语法",
            "pointDesc": "知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍知识点介绍"
        };
        $(document).ready(function() {
            var pointId = getQueryVariable('pointId');


            // $.ajax({
            //     url: '/path/to/file',
            //     type: 'GET',
            //     dataType: 'json',
            //     data: {pointId: pointId},
            // })
            // .done(function() {
            //     console.log("success");
            // })
            // .fail(function() {
            //     console.log("error");
            // })
            // .always(function() {
            //     console.log("complete");
            // });

            fillInfo(pointData.subjectName, pointData.courseName, pointData.pointName, pointData.pointDesc);
        });

        //填充基本信息
        function fillInfo(subject, course, point, desc) {
            var breadSubject = $('#js_breadSubject'),
                breadCourse = $('#js_breadCourse'),
                breadPoint = $('#js_breadPoint'),
                titCourse = $('#js_titCourse'),
                titPoint = $('#js_titPoint'),
                pointDesc = $('#js_pointDesc');

                breadSubject.text(subject);
                breadCourse.text(course);
                breadPoint.text(point);
                titCourse.text(course);
                titPoint.text(point);
                pointDesc.text(desc);

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
        //创建知识点目录
        function createList(container, point) {
            var oriHTML = container.html(),
                pointLevel = point.pointLevel,
                pointTitle = point.pointTitle,
                ifChild = point.ifChild,
                ifParent = point.parentPoint ? true : false,
                tabIndex,
                btnString,
                listString,
                subListString;

            //判断该知识点是否有子知识点
            if (ifChild) {
                tabIndex = point.pointId;
                //生成展开按钮
                btnString = '<span class="point-btn" data-tab="' + tabIndex + '"><span class="bar"></span><span class="bar bar2 open-bar"></span></span>';
                //若有子级知识点则创建ul留空
                subListString = '<ul data-list="' + tabIndex + '"></ul>';
            } else {
                btnString = '';
                subListString = '';
            }
            //拼合单点列表
            listString = '<li class="point-level-' + pointLevel + '">' + btnString + '<a href="' + point.pointHref + '">' + pointTitle + '</a>' + subListString + '</li>';

            //判断该知识点是否有父级知识点，若有则插入到该父节点的ul
            if (ifParent) {
                $('ul[data-list="' + point.parentPoint + '"]').append(listString);
            } else {
                oriHTML += listString;
                container.html(oriHTML);
            }
        }


    });
