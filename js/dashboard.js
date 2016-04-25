requirejs(['jquery', 'bootstrap', 'loginModule', 'api'],
    function(jquery, bootstrap, LoginModule, API) {

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
         * 课程管理
         */
        var setCourse = function(API) {

            setCourseMainPage();


            // 课程overview页面
            function setCourseMainPage() {
                setCourseMainBase('#js_main');
                setCourseTable('');

                function setCourseMainBase(selector) {
                    var container = $(selector),
                        pageTitle = '课程管理',
                        html = '<h1 class="page-header">' + pageTitle + '</h1><div class="row placeholders"></div><h2 class="sub-header">课程列表</h2><div id="js_courseTable" class="course-table table-responsive"></div>';

                    container.html(html);
                }

                function setCourseTable(text) {
                    var $tbody;

                    API.searchCourses({
                        searchText: text
                    }, function(result) {
                        fillCourseTable('#js_courseTable', result);
                        $tbody = $('#js_courseTable').find('tbody');
                    });

                    //事件绑定
                    $tbody.on('click', 'tr', function(event) {
                        var cid = $(this).attr('data-cid');
                        setCourseInfoPage(cid);
                    });
                }

                function fillCourseTable(selector, courses) {
                    var container = $(selector),
                        tableHtml = '',
                        thHtml = '',
                        tbHtml = '';

                    thHtml = '<tr><th>课程id</th><th>课程名称</th><th>课程简介</th></tr>';
                    //表头
                    $(courses).each(function(index, el) {
                        tbHtml += '<tr data-cid="' + el.courseID + '"><td>' + el.courseID + '</td><td>' + el.courseName + '</td><td>' + el.courseDesc + '</td></tr>';
                    });

                    tableHtml = '<table class="table table-striped"><thead>' + thHtml + '</thead><tbody>' + tbHtml + '</tbody>';
                    container.html(tableHtml);
                }
            }

            //单个课程详情页
            function setCourseInfoPage(cid) {
                var html = '',
                    ifEditInfo = false,
                    ifEditPoint = false,
                    $imgMask = $(' <div class="img-mask"> <a id="js_btnChangePic" class="btn-changepic">更改图片</a> </div> ');

                setCourseInfoBase('#js_main');
                //绑定返回按钮事件
                $('#js_btnBack').on('click', function(event) {
                    setCourseMainPage();
                });;

                function setCourseInfoBase(selector) {
                    var baseHtml = '',
                        titHtml = '<div><span id="js_btnBack" class="btn-back"><i></i>返回</span></div><h2 class="sub-header">课程信息 <span id="js_cinfo_btnEdit" class="btn-edit"><i class="icon-edit"></i>编辑内容</span></h2>',
                        infoHtml = '',
                        pointHtml = '<h2 class="sub-header">课程知识点<span id="js_cpoint_btnEdit" class="btn-edit"><i class="icon-edit"></i>编辑知识点</span></h2><div id="js_cpoint"></div>',
                        container = $(selector);

                    infoHtml = '<div id="js_cinfo" class="row course-info">' + '<div class="col-md-5 col-sm-4 col-xs-5 placeholder text-center"> <div class="img-wrap"> <img id="js_cinfo_pic" class="img-responsive" src="../images/course/bg_imgloading.png" alt="" width="450" height="300"></div> <h4>课程图片: <span id="js_cinfo_imgSrc">null</span></h4> </div> <div class="col-md-7 col-sm-8 col-xs-7 placeholder"> <div class="form-group"> <label for="js_cinfo_name">课程名称</label> <input id="js_cinfo_name" type="text" class="form-control" readonly="true"> </div> <div class="form-group"> <label for="js_cinfo_desc">一句话描述</label> <input id="js_cinfo_desc" type="text" class="form-control" readonly="true"> </div> <div class="form-group"> <label for="js_cinfo_intro">课程描述</label> <textarea id="js_cinfo_intro" class="form-control" rows="5" readonly="true"></textarea> </div> </div>' + '</div>';
                    baseHtml = titHtml + infoHtml + pointHtml;
                    container.html(baseHtml);

                    fillCourseInfo(cid);
                    //绑定事件
                    $('#js_cinfo_btnEdit').on('click', function(event) {
                        $this = $(this);
                        // 当前未处于编辑状态
                        if (!ifEditInfo) {
                            ifEditInfo = true;
                            //更改按钮状态&文本框状态
                            $this.addClass('active');
                            $this.html('<i class="icon-edit"></i>保存更改');
                            $('#js_cinfo_name').removeAttr('readonly');
                            $('#js_cinfo_intro').removeAttr('readonly');
                            $('#js_cinfo_desc').removeAttr('readonly');
                            $('.img-wrap').append($imgMask);

                        } else {
                            ifEditInfo = false;
                            $this.removeClass('active');
                            $this.html('<i class="icon-edit"></i>编辑内容');
                            $('#js_cinfo_name').attr('readonly', '');
                            $('#js_cinfo_intro').attr('readonly', '');
                            $('#js_cinfo_desc').attr('readonly', '');
                            $imgMask.remove();

                            //@TODO: 提交更改

                        }
                    });


                    //知识点列表
                    setCoursePoints(cid);
                    //绑定事件
                    $('#js_cpoint_btnEdit').on('click', function(event) {
                        $this = $(this);
                        // 当前未处于编辑状态
                        if (!ifEditPoint) {
                            ifEditPoint = true;
                            //更改按钮状态&文本框状态
                            $this.addClass('active');
                            $this.html('<i class="icon-edit"></i>保存更改');

                        } else {
                            ifEditPoint = false;
                            $this.removeClass('active');
                            $this.html('<i class="icon-edit"></i>编辑知识点');

                            //@TODO: 提交更改

                        }
                    });
                }

                function fillCourseInfo(cid) {
                    var imgUrl = '../images/course/'
                    API.getCourseData({
                        courseStr: cid
                    }, function(result) {
                        if (result.status == '200') {
                            var course = result.content[0];
                            $('#js_cinfo_name').val(course.courseName);
                            $('#js_cinfo_desc').val(course.courseDesc);
                            $('#js_cinfo_intro').val(course.courseIntro);
                            $('#js_cinfo_pic').attr('src', imgUrl + course.courseImgSrc);
                            $('#js_cinfo_imgSrc').text(course.courseImgSrc);
                        }
                    });
                }

                function setCoursePoints(cid) {

                    createKnowList('#js_cpoint', cid);
                    //创建知识点列表
                    function createKnowList(selector, courseId) {
                        var container = $(selector),
                            $curPoint;

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
                                    fillPointList(container, el);
                                });
                            })
                            .fail(function() {
                                console.log("get points error");
                            })
                            .always(function() {});

                        //绑定知识点点击事件
                        container.on('click', '.point', function(event) {
                            var $this = $(this);
                            if (!ifEditPoint) {
                                return;
                            }
                            if (!$curPoint) {
                                $curPoint = $this;
                                $curPoint.find('.btn-edit-group').removeClass('hide');
                            } else if ($curPoint === $this) {
                                return;
                            } else {
                                $curPoint.find('.btn-edit-group').addClass('hide');
                                $curPoint = $this;
                                // $curPoint.css("background-color","#dbdbdb");
                                $curPoint.find('.btn-edit-group').removeClass('hide');
                            }
                        });

                        //绑定编辑按钮组点击事件
                        container.on('click', '.btn-edit-point', function(event) {
                            var oriTit = '',
                                $this = $(this),
                                $temp = $('<a class="cpoint-temp"><input type="text" class="cpoint-temp-input"><span class="cpoint-temp-save" title="保存修改">save</span><span class="cpoint-temp-cancel" title="放弃修改">cancel</span></a>');

                            if (!ifEditPoint) {
                                return;
                            }
                            //取得原标题
                            oriTit = $this.parent().siblings('.point-title').text();
                            $this.parent().parent().append($temp);
                            $('.cpoint-temp-input').val(oriTit);
                            $('.cpoint-temp-save').on('click', clickEventHandler);
                            $('.cpoint-temp-cancel').on('click', function(event) {
                                if ($temp) {
                                    $temp.remove();
                                    $(this).unbind('click', clickEventHandler);
                                }
                            });

                            function clickEventHandler(event) {
                                var newTit = $(this).siblings('.cpoint-temp-input').val();
                                $this.parent().parent().parent().find('.point-title').text(newTit);
                                $temp.remove();
                            }
                        });

                        //绑定增加子知识点按钮事件
                        container.on('click', '.btn-add-sub', function(event) {
                            var $this = $(this),
                                curLevel = $this.parent().parent().attr('data-level'),
                                newLevel = parseInt(curLevel) + 1,
                                $temp = $('<a class="cpoint-temp-sub point-level-' + newLevel + '"><input type="text" class="cpoint-temp-input"><span class="cpoint-temp-save" title="保存修改">save</span><span class="cpoint-temp-cancel" title="放弃修改">cancel</span></a>');

                            if (!ifEditPoint) {
                                return;
                            }

                            $this.parent().parent().parent().append($temp);

                            $('.cpoint-temp-save').on('click', clickEventHandler);
                            $('.cpoint-temp-cancel').on('click', function(event) {
                                if ($temp) {
                                    $temp.remove();
                                    $(this).unbind('click', clickEventHandler);
                                }
                            });

                            function clickEventHandler(event) {
                                var newTit = $(this).siblings('.cpoint-temp-input').val(),
                                    subList,
                                    ifChild = false;

                                subList = $this.parent().parent().siblings('ul');
                                ifChild = Boolean(subList.length);

                                if (!ifChild) {
                                    $('<ul><li class="point-level-' + newLevel + '"><a class="point" data-level="'+newLevel+'"><span class="point-title">' + newTit + '</span><span class="btn-edit-group hide"><span class="btn-edit-point" title="编辑节点">edit</span><span class="btn-add-sub" title="添加子知识点">addsub</span><span class="btn-delete-point" title="删除知识点">delete</span></span></a></li></ul>').insertAfter($this.parent().parent());
                                }else{
                                    subList.append('<li class="point-level-' + newLevel + '"><a class="point" data-level="'+newLevel+'"><span class="point-title">' + newTit + '</span><span class="btn-edit-group hide"><span class="btn-edit-point" title="编辑节点">edit</span><span class="btn-add-sub" title="添加子知识点">addsub</span><span class="btn-delete-point" title="删除知识点">delete</span></span></a></li>');
                                }
                                $temp.remove();
                            }
                        });
                    }

                    //填充知识点列表
                    function fillPointList(container, point) {
                        var oriHTML = container.html(),
                            pointLevel = point.pointLevel,
                            pointTitle = point.pointName,
                            ifChild = point.ifChild,
                            ifParent = point.parentPoint ? true : false,
                            tabIndex,
                            btnString,
                            listString,
                            subListString;

                        //判断该知识点是否有子知识点
                        if (ifChild == '1') {
                            tabIndex = point.pointID;
                            //生成展开按钮
                            // btnString = '<span class="point-btn" data-tab="' + tabIndex + '"><span class="bar"></span><span class="bar bar2 open-bar"></span></span>';
                            //若有子级知识点则创建ul留空
                            subListString = '<ul data-list="' + tabIndex + '"></ul>';
                        } else {
                            btnString = '';
                            subListString = '';
                        }
                        //拼合单点列表
                        listString = '<li class="point-level-' + pointLevel + '">' + '<a class="point" data-level="' + pointLevel + '"><span class="point-title">' + pointTitle + '</span><span class="btn-edit-group hide"><span class="btn-edit-point" title="编辑节点">edit</span><span class="btn-add-sub" title="添加子知识点">addsub</span><span class="btn-delete-point" title="删除知识点">delete</span></span></a>' + subListString + '</li>';

                        //判断该知识点是否有父级知识点，若有则插入到该父节点的ul
                        if (ifParent) {
                            $('ul[data-list="' + point.parentPoint + '"]').append(listString);
                        } else {
                            oriHTML += listString;
                            container.html(oriHTML);
                        }
                    }


                }
            }



        };

        setCourse(API);
    });
