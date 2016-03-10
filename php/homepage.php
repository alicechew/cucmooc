<?php
require ('init.php');
header("content-Type:text/html;charset=utf-8");
session_start();

$con = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
mysql_set_charset("utf8",$con);
if (!$con) {
    die('连接失败 ' . mysql_error());
} else {
    mysql_select_db(DB_NAME, $con);
    //echo("链接数据库成功");
    //echo "<br/>";
    $sql = "SELECT courseName,courseDesc FROM course ";
    $result = mysql_query($sql);
    $arr=array();
    while($row = mysql_fetch_array($result, MYSQL_ASSOC)){

        $arr[]=$row;
    }
    echo json_encode($arr,JSON_UNESCAPED_UNICODE);

}
mysql_close($con);
?>

