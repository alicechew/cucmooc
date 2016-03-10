requirejs(['jquery', 'bootstrap','paginator'],
    function() {

    String.prototype.temp = function(obj) {
        return this.replace(/\$\w+\$/gi, function(matchs) {
            var returns = obj[matchs.replace(/\$/g, '')];
            return (returns + '') == 'undefined' ? '' : returns;
        });
    };

    var htmlList = '',
        htmlTemp = $('#js_template').val();

    $.ajax({
            url: '../php/categories.php',
            type: 'GET',
            dataType: 'json'
        })
        .done(function(result) {
            console.log("success");
            var container = $('.course-list'),
                itemPerPage = 8,
                itemGroup = divideContent(result, itemPerPage),
                option = {
                    size: 'normal',
                    currentPage:1,
                    totalPages: itemGroup.numOfPage,
                    bootstrapMajorVersion: 3,   //important！ver2结构为div内直接li
                    onPageClicked: function(event, originalEvent, type, page){
                        fillInList(itemGroup.dividedCont[page-1],container);
                    }
                };

                $('#pagetest').bootstrapPaginator(option);
                fillInList(itemGroup.dividedCont[0], container);


        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });


        function divideContent(content, itemPerPage){
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
                        if(index % itemPerPage < itemPerPage - 1){
                            // console.log(tempGroup);
                            tempGroup.push(el);
                        }else{
                            tempGroup.push(el);
                            result.push(tempGroup);
                            tempGroup = [];
                            currentPage++;
                        }
                    }else{
                        if(index < itemCount - 1){
                            tempGroup.push(el);
                        }else{
                            tempGroup.push(el);
                            result.push(tempGroup);
                        }
                    }

                });

            return {
                dividedCont:result,
                itemCount: itemCount,
                numOfPage: numOfPage
            };
        }

        function fillInList(content, container){
            htmlList = '';
            container.html('');
            $(content).each(function(index, el) {
                htmlList += htmlTemp.temp(el);
            });
            container.html(htmlList);
        }

    // 提交搜索关键字
    var searchModule = (function(){
        var searchInputEl = $('#js_searchInput'),
            btnSubmit = $('#js_searchSubmit'),
            searchText;

        btnSubmit.on('click', null, function(event) {
            searchText = searchInputEl.val();
            if(!searchText){
                return;
            }

            $.ajax({
                url: '../php/categories.php',
                type: 'GET',
                data: {searchText: searchText}
            })
            .done(function(result) {
                console.log(result);
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });

        });
    })();
});
