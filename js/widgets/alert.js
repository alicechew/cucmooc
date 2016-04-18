define(['jquery', 'bootstrap'], function(jQuery, bootstrap) {
    var Q = new Object();

    Q.alert = function(selector, type, cont, duration) {
        var alertType = type,
            alertCont = cont,
            alertDur = duration,
            htmlStr,
            wrap = $(selector),
            notice;

        htmlStr = '<div class="alert alert-' + alertType + ' alert-dismissable" role="alert" style="position:fixed; bottom:0; width:100%; z-index:9999;margin:0;">' + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + alertCont + '</div>';

        wrap.append(htmlStr);
        $('.alert').hide();
        $('.alert').fadeIn();
    };

    //@TODO
    Q.popup = function(selector, type, cont, duration){

    };
    return Q;
});
