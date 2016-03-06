(function(){
    var items = $('.item-panel'),
    courseName = $('.item-tit').find('a'),
    courseDesc = $('.item-desc').find('div');



    $.ajax({
        url: '../php/homepage.php',
        type: 'GET',
        dataType: 'json'
    })
    .done(function(result) {
        //推荐课程数量固定，故直接填充，不动态生成
        courseName.each(function(index, el) {
            // el.innerText = result[index].courseName;
            // firefox 不支持innerText
            $(el).text(result[index].courseName);
        });
        courseDesc.each(function(index, el) {
            // el.innerText = result[index].courseDesc;
            $(el).text(result[index].courseDesc);
        });
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });

})();