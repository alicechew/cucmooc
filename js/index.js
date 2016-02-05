(function(){
    var items = $('.item-panel'),
    courseName = $('.item-tit').find('a'),
    courseDesc = $('.item-desc').find('div');
    $.ajax({
        url: '../js/data/recommend.json',
        type: 'GET',
        dataType: 'json'
    })
    .done(function(result) {
        courseName.each(function(index, el) {
            el.innerText = result[index].courseName;
        });
        courseDesc.each(function(index, el) {
            el.innerText = result[index].courseDesc;
        });
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });

})();