<?php
require ('init.php');

$loginname = isset($_GET['username'])?$_GET['username']:'';
$loginpassword = isset($_GET['password'])?$_GET['password']:'';

header("content-Type:text/html;charset=utf-8");
session_start();

$con = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
mysql_set_charset("utf8", $con);

if (!$con)
 {
 die('Could not connect: ' . mysql_error());
 }
 mysql_select_db(DB_NAME, $con);

$sql = "SELECT * FROM users WHERE userName='$loginname' and userPassword='$loginpassword'";

$res  = mysql_query($sql);
$rows = mysql_num_rows($res);
if($rows==0){
	$arr=array(
		'status'=>'0'
	);
	//mysql_query("INSERT INTO rizhi (content,user) VALUES ('以{$loginname}为用户名登录失败','未知用户')");
}else{
	$arr=array(
		'status'=>'200'
	);
	//mysql_query("INSERT INTO rizhi (content,user) VALUES ('用户登录','$loginname')");
}


$str = json_encode($arr);

echo $str;
mysql_close($con);

?>