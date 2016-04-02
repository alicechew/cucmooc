<?php
//防止全局变量造成隐患
$ifLogin = false;

//启动session
session_start();
//判断是否登录
if (isset($_SESSION['ifLogin']) && $_SESSION['ifLogin'] === true){
    //@TODO: 打开数据库调用户的userid和已参与课程

    echo json_encode(array('ifLogin' => 'true','username' => $_SESSION['username'], 'userId' => $_SESSION['userId']));

}else{
    //验证失败
    $_SESSION['ifLogin'] = false;
    echo json_encode(array('ifLogin' => 'false','username' => '', 'userId' => ''));
}

?>