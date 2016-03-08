<?php
header("content-Type:text/html;charset=utf-8");
session_start();

$con = mysql_connect("localhost:3306", "root", "");
mysql_set_charset("utf8",$con);
if (!$con) {
    die('连接失败 ' . mysql_error());
} else {
    mysql_select_db("cucmooc", $con);
    //echo("链接数据库成功");
    //echo "<br/>";
    $sql = "SELECT courseName,courseDesc FROM lesson ";
    $result = mysql_query($sql);
    $arr=array();
    while($row = mysql_fetch_array($result, MYSQL_ASSOC)){

        $arr[]=$row;
    }
    echo json_encode($arr,JSON_UNESCAPED_UNICODE);

}
mysql_close($con);
?>

