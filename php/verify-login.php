<?php
//防止全局变量造成隐患
$ifLogin = false;

//启动session
session_start();
//判断是否登录
if (isset($_SESSION['ifLogin']) && $_SESSION['ifLogin'] === true){
    echo json_encode(array('ifLogin' => 'true','username' => $_SESSION['username']));
}else{
    //验证失败
    $_SESSION['ifLogin'] = false;
    echo json_encode(array('ifLogin' => 'false','username' => ''));
}

?>