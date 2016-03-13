<?php
require ('init.php');
header("content-Type:text/html;charset=utf-8");


$posts = $_POST;
$loginname = $posts['username'];
//链接数据库

$con = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
mysql_set_charset("utf8", $con);

if (!$con)
 {
 die('Could not connect: ' . mysql_error());
 }
 mysql_select_db(DB_NAME, $con);

$sql = "SELECT * FROM users WHERE userName='$loginname'";

$res  = mysql_query($sql);
$rows = mysql_num_rows($res);
//用户已存在
if($rows > 0){
    $arr=array(
        'status'=>'0'
    );
}else{
    //注册成功，插入数据库
    $password = $posts['password'];
    $education = $posts['education'];
    $subjects = json_encode($posts['subjects']);
    $sql = "INSERT INTO users (userName,userPassword,userEducation,userInterest) VALUES ('$loginname','$password','$education','$subjects')";
    $res = mysql_query($sql);
    if($res){
        $arr=array(
        'status'=>'200'
        );
    }
}

$str = json_encode($arr);
echo $str;
mysql_close($con);

?>