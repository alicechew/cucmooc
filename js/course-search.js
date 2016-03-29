requirejs(['jquery', 'bootstrap', 'paginator', 'loginModule'],
    function(jquery, bootstrap, paginator, LoginModule) {


        //验证登录状态
        LoginModule.verifyLogin();
        //记录登录状态
        var ifLogin = LoginModule.ifLogin,
            userId = LoginModule.userId;


        String.prototype.temp = function(obj) {
            return this.replace(/\$\w+\$/gi, function(matchs) {
                var returns = obj[matchs.replace(/\$/g, '')];
                return (returns + '') == 'undefined' ? '' : returns;
            });
        };

/**
 * categoriesSection 已选课程目录生成
 * @param  {String} ) userId [用户id]
 */
        var categoriesSection = (function(userId){

            $.ajax({
                url: '../js/data/search.json',
                type: 'GET',
                dataType: 'json',
                data: {userId: userId},
            })
            .done(function(result) {
                console.log("get categories success");
                createCategories('#js_courseList', result.courseList);
            })
            .fail(function() {
                console.log("get categories error");
            })
            .always(function(result) {
                console.log(result);
                // console.log("complete");
            });


            function createCategories(selector, result){
                var container = $(selector),
                    url = './course.html?cid=',
                    listStr,
                    tabItem,
                    prevTab,
                    curTab;

                if(!result.length){
                    listStr = '<p class="text-center">当前没有参加课程</p>';
                }else{
                    listStr = '<li class="cur" data-cid="all">全部课程</li>';
                    $(result).each(function(index, el) {
                        listStr += '<li data-cid="' + el.courseId + '">' + el.courseName + '</li>';
                    });
                }

                container.append(listStr);

                //init
                tabItem = container.find('li');
                prevTab = container.find('[data-cid="all"]');
                curTab = prevTab;
                //bind events
                tabItem.on('click', function(event) {
                    var cid = $(this).attr('data-cid');
                    console.log(cid);
                    if(curTab == this){
                        return;
                    }else{
                        curTab = this;
                        $(curTab).addClass('cur');
                        $(prevTab).removeClass('cur');
                        prevTab = curTab;
                    }
                });

            }


        }());


/**
 * listSource 填充列表函数
 * @param  {Boolean} ifSearch  [是否为搜索动作引发的填充列表]
 * @param  {String} searchType [搜索类型：course|point]
 * @param  {String} searchText [搜索关键字]
 */
        var listSource = function(ifSearch, searchType, searchText) {
            var htmlList = '',
                htmlTemp,
                itemName = searchType + 'Name',
                itemDesc = searchType + 'Desc',
                itemPath = './course.html?',
                itemId = searchType + 'Id',
                itemImgSrc = 'itemImgSrc';

                htmlTemp = '<div class="col-md-3 col-xs-6">'
                        + '<div class="item-panel panel b-a">'
                        +    '<div class="item-pic">'
                        +       '<a target="_blank" href="'+ itemPath + 'courseId=$' + itemId + '$"><img src="$' + itemImgSrc +'$" class="img-full" alt=""></a>'
                        +   '</div>'
                        +    '<div class="item-tit text-center font-bold text-md">'
                        +       '<a target="_blank" href="' + itemPath + 'courseId=$' + itemId + '$">$' + itemName + '$</a>'
                        +   '</div>'
                        +   '<div class="item-desc m-l-sm m-r-sm">'
                        +      '<div class="text-center">$' + itemDesc + '$</div>'
                        +   '</div>'
                        +   '</div>'
                        + '</div>';

            $.ajax({
                    url: '../php/categories.php',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        searchType: searchType,
                        searchText: searchText
                    }
                })
                .done(function(result) {
                    console.log("success");

                    var container = $('.course-list'),
                        itemPerPage = 8,
                        itemGroup = divideContent(result, itemPerPage),
                        option = {
                            size: 'normal',
                            currentPage: 1,
                            totalPages: itemGroup.numOfPage,
                            bootstrapMajorVersion: 3, //important！ver2结构为div内直接li
                            onPageClicked: function(event, originalEvent, type, page) {
                                fillInList(itemGroup.dividedCont[page - 1], container);
                            }
                        },
                        sortTitle = $('#js_sortTitle'),
                        searchNotice = $('#js_searchNotice');

                    if (ifSearch) {
                        sortTitle.text('搜索结果');

                        if (!eval(result).length) {
                            searchNotice.show();
                            container.html('');
                            $('#js_paginator').hide();
                            return;
                        }
                    }
                    searchNotice.hide();
                    fillInList(itemGroup.dividedCont[0], container);
                    $('#js_paginator').bootstrapPaginator(option);
                    $('#js_paginator').show();

                })
                .fail(function() {
                    console.log("error");
                })
                .always(function() {
                    console.log("complete");
                });


            function divideContent(content, itemPerPage) {
                var $content = $(content),
                    itemCount = $content.length,
                    itemPerPage = itemPerPage,
                    numOfPage = Math.ceil(itemCount / itemPerPage),
                    currentPage = 1,
                    tempGroup = [],
                    result = [];

                console.log('num of page:' + numOfPage);
                $content.each(function(index, el) {
                    if (currentPage < numOfPage) {
                        if (index % itemPerPage < itemPerPage - 1) {
                            // console.log(tempGroup);
                            tempGroup.push(el);
                        } else {
                            tempGroup.push(el);
                            result.push(tempGroup);
                            tempGroup = [];
                            currentPage++;
                        }
                    } else {
                        if (index < itemCount - 1) {
                            tempGroup.push(el);
                        } else {
                            tempGroup.push(el);
                            result.push(tempGroup);
                        }
                    }

                });

                return {
                    dividedCont: result,
                    itemCount: itemCount,
                    numOfPage: numOfPage
                };
            }

            function fillInList(content, container) {
                htmlList = '';
                container.html('');
                $(content).each(function(index, el) {
                    htmlList += htmlTemp.temp(el);
                });
                container.html(htmlList);
            }

        };

        // 提交搜索关键字
        var searchModule = (function() {
            var searchInputEl = $('#js_searchInput'),
                btnSubmit = $('#js_searchSubmit'),
                searchTypeEl = $('#js_searchType'),
                searchType,
                searchText;

                //绑定tooltip
                searchInputEl.tooltip({
                        trigger:'manual',
                        title: '搜索关键字不能为空！',
                        placement: 'bottom'
                    });

            btnSubmit.on('click', null, function(event) {
                searchType = searchTypeEl.val();
                searchText = searchInputEl.val();

                //搜索关键字为空时不发送请求，同时显示tooltip
                if (!searchText) {
                    searchInputEl.tooltip('show');
                    setTimeout(function(){
                        searchInputEl.tooltip('hide');
                    },1500);
                    return;
                }

                listSource(true, searchType, searchText);
            });
        })();

        listSource(false,'course','');
    });
