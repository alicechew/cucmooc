requirejs(['jquery', 'bootstrap', 'widgets/login-module'],
    function() {

        var courseData = {
            "subjectName": 'IT互联网',
            "courseImgSrc": '',
            "courseName": "php基础",
            "courseDesc": "php基础课程介绍课程介绍课程介绍课程介绍课程介绍课程介绍课程介绍课程介绍课程介绍课程介绍课程介绍课程介绍课程介绍课程介绍",
            "knowledgePoint": [{
                "pointId": "0101",
                "pointLevel": 1,
                "pointTitle": "PHP一级知识点1",
                "ifChild": false,
                "parentPoint": "",
                "pointHref": "#"
            }, {
                "pointId": "0102",
                "pointLevel": 1,
                "pointTitle": "PHP一级知识点2",
                "ifChild": true,
                "parentPoint": "",
                "pointHref": "#"
            }, {
                "pointId": "010201",
                "pointLevel": 2,
                "pointTitle": "二级知识点1",
                "ifChild": true,
                "parentPoint": "0102",
                "pointHref": "#"
            }, {
                "pointId": "010202",
                "pointLevel": 2,
                "pointTitle": "二级知识点2",
                "ifChild": false,
                "parentPoint": "0102",
                "pointHref": "#"
            }, {
                "pointId": "01020101",
                "pointLevel": 3,
                "pointTitle": "三级知识点1",
                "ifChild": false,
                "parentPoint": "010201",
                "pointHref": "#"
            }]
        };
        $(document).ready(function() {
            var courseId = getQueryVariable('courseId');
            console.log(courseId);
            // $.ajax({
            //     url: '/path/to/file',
            //     type: 'GET',
            //     dataType: 'json',
            //     data: {courseId: courseId},
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

            fillInfo(courseData.subjectName, courseData.courseName, courseData.courseDesc, courseData.imgSrc, courseData.knowledgePoint);



        });

        //填充基本信息
        function fillInfo(subject, name, desc, imgSrc, knowledgePoint) {
            var subjectEl = $('#js_subject'),
                courseEl = $('#js_course'),
                nameEl = $('#js_courseName'),
                descEl = $('#js_courseDesc'),
                imgEl = $('#js_courseImg'),
                $data = $(knowledgePoint),
                container = $('#js_kldgPoint'),
                pointIndex = 0;

            subjectEl.text(subject);
            courseEl.text(name);
            nameEl.text(name);
            descEl.text(desc);
            imgEl.text(imgSrc);


            //知识点列表生成
            $data.each(function(index, el) {
                //先写好list结构再动态生成
                createList(container, $data[index]);

            });

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
