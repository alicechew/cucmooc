(function() {

    String.prototype.temp = function(obj) {
        return this.replace(/\$\w+\$/gi, function(matchs) {
            var returns = obj[matchs.replace(/\$/g, '')];
            return (returns + '') == 'undefined' ? '' : returns;
        });
    };

    var htmlList = '',
        htmlTemp = $('#js_template').val();

    $.ajax({
            url: '../js/data/search.json',
            type: 'GET',
            dataType: 'json'
        })
        .done(function(result) {
            console.log("success");
            //@todo:条目数目处理
            result.forEach(function(obj) {
                htmlList += htmlTemp.temp(obj);
            });
            $('.course-list').html(htmlList);
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });

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
})();
