<?php
require ('init.php');
header("content-Type:text/html;charset=utf-8");


$posts = $_POST;
//清除空白符号
foreach( $posts as $key => $value) {
    $posts[$key] = trim($value);
}
$loginpassword = $posts['password'];
$loginname = $posts['username'];

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
}else{
	$arr=array(
		'status'=>'200'
	);
    //验证成功则启动session
    session_start();
    //注册登录成功的admin变量并赋值
    $_SESSION['ifLogin'] = true;
    $_SESSION['username'] = $loginname;
}


$str = json_encode($arr);

echo $str;
mysql_close($con);

?>