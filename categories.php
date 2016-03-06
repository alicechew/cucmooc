<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>

<?php
header("content-Type:text/html;charset=utf-8");
session_start();
var_dump($_POST);
$terms = $_POST['term'];


$con = mysql_connect("localhost:3306", "root", "");
mysql_set_charset("utf8",$con);

if (!$con) {
    die('连接失败 ' . mysql_error());
} else {
    mysql_select_db("cucmooc", $con);
    echo("链接数据库成功");


//搜索课程or知识点
    $sql = "select * from lesson where lesson_name='" . $terms . "' ";
    mysql_query($sql);
    $num = mysql_affected_rows();
    //echo("$num");
    if ($num > 0) {
        $url =" ./pages/knowledge-point.html";
        echo " <script  language = 'javascript' type = 'text/javascript' > ";
        echo " window.location.href = '$url' ";
        echo " </script > ";
    }
    else {
        $sql = "select * from points where lesson_name='" . $terms . "' ";
        mysql_query($sql);
        $num1 = mysql_affected_rows();

        if ($num > 0) {
            $url =" ./pages/knowledge-point.html";
            echo " <script  language = 'javascript' type = 'text/javascript' > ";
            echo " window.location.href = '$url' ";
            echo " </script > ";
        }
    }
        echo "<script>alert('没有此课程或知识点！');location='index.html';</script>";
        mysql_close($con);

}
