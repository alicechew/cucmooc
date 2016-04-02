<?php
require 'init.php';
header('content-Type:text/html;charset=utf-8');
session_start();
$posts = $_POST['form'];
$type = $_GET['type'] || $_POST['type'];
$loginname = $posts['username'];
//连接数据库
$con = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
mysql_set_charset('utf8', $con);
if (!$con) {
    die('Could not connect: ' . mysql_error());
}
mysql_select_db(DB_NAME, $con);
//判断类型
if($type == 'getSubjects'){  //根据热度列出课程 top10
$sql = 'SELECT subjectName ,subjectID from subjects ORDER BY subjectHeat DESC limit 0,8';
$result = mysql_query($sql);
$array = array();
while ($row = mysql_fetch_array($result, MYSQLI_ASSOC)) {
    $array[] = $row;
}
echo json_encode($array, JSON_UNESCAPED_UNICODE);

} else if($type == 'register'){  //注册

//**********************判断用户名是否已被注册********************
$sql = "SELECT * FROM users WHERE userName='{$loginname}'";
$res = mysql_query($sql);
$rows = mysql_num_rows($res);
if ($rows > 0) {
    $arr = array('status' => '0');
} else {
    //**************用户名可用，插入数据库***********
    //*****插入users表******
    $password = $posts['password'];
    $hash = password_hash("{$password}", PASSWORD_DEFAULT);
    $education = $posts['education'];
    // $subjectsid[] = json_deccode($posts['subjects'], true);
    $
    $sql = "INSERT INTO users (userName,userPassword,userEducation) VALUES ('{$loginname}','{$hash}','{$education}')";
    $res = mysql_query($sql);
    if ($res) {
        $arr = array('status' => '200');
    }
    //**********插入interest表**********
    $sql = "SELECT userID FROM users WHERE userName='{$loginname}'  ";
    $res = mysql_query($sql);
    $row = mysql_fetch_array($res);
    $userid = $row['userID'];
    $sql = "INSERT INTO interest (userID,courseID) values ('{$userid}','{$courseid}')";
    //前端传递courseid
    $res = mysql_query($sql);
    $row = mysql_fetch_array($res);
    if ($res) {
        $arr = array('status' => '200');
    }
}
$str = json_encode($arr);
echo $str;
}

mysql_close($con);