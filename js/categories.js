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
})();
