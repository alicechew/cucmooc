(function() {
    var simData = {
        "courseId": "01",
        "courseName": "JavaScript入门",
        "knowledgePoint": [{
            "pointId": "0101",
            "pointLevel": 1,
            "pointTitle": "对象 Object",
            "ifChild": false,
            "parentPoint": "",
            "pointHref": "#"
        }, {
            "pointId": "0102",
            "pointLevel": 1,
            "pointTitle": "标准类型",
            "ifChild": true,
            "parentPoint": "",
            "pointHref": "#"
        }, {
            "pointId": "010201",
            "pointLevel": 2,
            "pointTitle": "Undefined",
            "ifChild": true,
            "parentPoint": "0102",
            "pointHref": "#"
        }, {
            "pointId": "010202",
            "pointLevel": 2,
            "pointTitle": "Boolean",
            "ifChild": false,
            "parentPoint": "0102",
            "pointHref": "#"
        }, {
            "pointId": "01020101",
            "pointLevel": 3,
            "pointTitle": "null",
            "ifChild": false,
            "parentPoint": "010201",
            "pointHref": "#"
        }]
    };


    $(document).ready(function() {
        var $data = $(simData.knowledgePoint),
            container = $('#js_kldgPoint'),
            pointIndex = 0;
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
    });

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


})();
