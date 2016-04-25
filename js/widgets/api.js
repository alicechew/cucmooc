define('api', ['jquery'], function() {
    var Q = {
        name: 'API',
        version: 1.2
    };

    var apiUrl = '../php/';

    /**
     * 课程
     */
    //搜索课程
    Q.searchCourses = function(data, doneCb, failCb, alwaysCb) {
        data.searchType = 'course';

        $.ajax({
            url: apiUrl + 'categories.php',
            type: 'GET',
            dataType: 'json',
            data: data,
            async: false
        }).done(doneCb).fail(failCb).always(alwaysCb);
    };

    //获取课程信息
    Q.getCourseData = function(data, doneCb, failCb, alwaysCb) {
        data.type = 'getCoursesData';

        $.ajax({
            url: apiUrl + 'homepage.php',
            type: 'GET',
            dataType: 'json',
            data: data
        }).done(doneCb).fail(failCb).always(alwaysCb);
    };

    //获取用户加入的所有课程
    Q.getEnrollCourses = function(data, doneCb, failCb, alwaysCb) {
        data.type = 'getCoursesId';

        $.ajax({
            url: apiUrl + 'homepage.php',
            type: 'GET',
            dataType: 'json',
            data: data
        }).done(doneCb).fail(failCb).always(alwaysCb);
    };

    //判断是否已加入课程
    Q.verifyEnroll = function(data, doneCb, failCb, alwaysCb) {
        data.type = 'verifyEnroll';

        $.ajax({
            url: apiUrl + 'course.php',
            type: 'GET',
            dataType: 'json',
            data: data
        }).done(doneCb).fail(failCb).always(alwaysCb);
    };

    //加入课程
    Q.enrollCourse = function(data, doneCb, failCb, alwaysCb) {
        data.type = 'enrollCourse';

        $.ajax({
            url: apiUrl + 'course.php',
            type: 'POST',
            dataType: 'json',
            data: data
        }).done(doneCb).fail(failCb).always(alwaysCb);
    };

    //退出课程
    Q.unenrollCourses = function(data, doneCb, failCb, alwaysCb) {
        data.type = 'unenrollCourses';

        $.ajax({
            url: apiUrl + 'course.php',
            type: 'GET',
            dataType: 'json',
            data: data
        }).done(doneCb).fail(failCb).always(alwaysCb);
    };

    //获取推荐课程
    Q.getRecommendCourses = function(data, doneCb, failCb, alwaysCb) {
        data.type = 'recommendCourse';

        $.ajax({
            url: apiUrl + 'homepage.php',
            type: 'GET',
            dataType: 'json',
            data: data
        }).done(doneCb).fail(failCb).always(alwaysCb);
    };


    /**
     * 轨迹
     */
    //获取用户最后观看的轨迹
    Q.getLastRoute = function(data, doneCb, failCb, alwaysCb) {
        data.type = 'getLastRoute';

        $.ajax({
            url: apiUrl + 'homepage.php',
            type: 'GET',
            dataType: 'json',
            data: data,
            async: false
        }).done(doneCb).fail(failCb).always(alwaysCb);
    };

    //获取用户参与某课程下的所有轨迹
    Q.getEnrollRoutes = function(data, doneCb, failCb, alwaysCb) {
        data.type = 'getRoutesId';

        $.ajax({
            url: apiUrl + 'homepage.php',
            type: 'GET',
            dataType: 'json',
            data: data,
            async: false
        }).done(doneCb).fail(failCb).always(alwaysCb);
    };

    //获取轨迹信息
    Q.getRoutesData = function(data, doneCb, failCb, alwaysCb) {
        data.type = 'getRoutesData';

        $.ajax({
            url: apiUrl + 'homepage.php',
            type: 'GET',
            dataType: 'json',
            data: data,
            async: false
        }).done(doneCb).fail(failCb).always(alwaysCb);
    };

    //轨迹学习状态
    Q.getRouteStatus = function(data, doneCb, failCb, alwaysCb) {

        $.ajax({
            url: apiUrl + 'route-status.php',
            type: 'GET',
            dataType: 'json',
            data: data,
            async: false
        }).done(doneCb).fail(failCb).always(alwaysCb);
    };

    //获取轨迹结点信息
    Q.getNodesData = function(data, doneCb, failCb, alwaysCb) {

        $.ajax({
            url: apiUrl + 'route-nodes.php',
            type: 'GET',
            dataType: 'json',
            data: data,
            async: false
        }).done(doneCb).fail(failCb).always(alwaysCb);
    };

    //退出轨迹
    Q.unenrollRoutes = function(data, doneCb, failCb, alwaysCb) {
        data.type = 'unenrollRoutes';

        $.ajax({
            url: apiUrl + 'route.php',
            type: 'GET',
            dataType: 'json',
            data: data,
            async: false
        }).done(doneCb).fail(failCb).always(alwaysCb);
    };

    //获取推荐轨迹
    Q.getRecommendRoutes = function(data, doneCb, failCb, alwaysCb) {
        data.type = 'recommendPath';

        $.ajax({
            url: apiUrl + 'homepage.php',
            type: 'GET',
            dataType: 'json',
            data: data,
            async: false
        }).done(doneCb).fail(failCb).always(alwaysCb);
    };
    return Q;
});
