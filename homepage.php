<?php
header("content-Type:text/html;charset=utf-8");
session_start();

$con = mysql_connect("localhost:3306", "root", "");
mysql_set_charset("utf8",$con);
if (!$con) {
    die('连接失败 ' . mysql_error());
} else {
    mysql_select_db("cucmooc", $con);
   // echo("链接数据库成功");
    //echo "<br/>";
    $sql = "SELECT courseName,courseDesc FROM point ";
    //var_dump($sql);
    $result = mysql_query($sql);
   // while($row=mysql_fetch_assoc($result))//将result结果集中查询结果取出一条
   $arr=array();
    while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
        //var_dump($row);
        //echo "<br/>";
        $arr[]=$row;


    }
    echo json_encode($arr,JSON_UNESCAPED_UNICODE);
    //printf("ID:"%s ,"Name:"%s,$row[0],$row[2]);
}

?>

