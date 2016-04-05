<?php
require ('init.php');
header("content-Type:text/html;charset=utf-8");
session_start();

$type = isset($_GET['type']) ? $_GET['type'] : '';
// $type = 'getRoutesData';

$con = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
mysql_set_charset("utf8",$con);
if (!$con) {
    die('连接失败 ' . mysql_error());
} else {
    mysql_select_db(DB_NAME, $con);
    //echo("链接数据库成功");

    // 推荐课程
    if($type === 'recommend'){
        $sql = "SELECT courseName,courseDesc FROM course ";
        $result = mysql_query($sql);
        $arr=array();
        while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
            $arr[]=$row;
        }
        echo json_encode($arr,JSON_UNESCAPED_UNICODE);
    }

    //已参加课程
    else if( $type === 'getCoursesId'){
        $uid = $_GET['userId'];
        $sql = "SELECT * FROM collectcourse WHERE userID='$uid'";
        $result = mysql_query($sql);
        $cont = array();
        if( !$result ){
            $arr = array( "status" => "0");
        }else{
            while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
                $cont[] = $row;
            }
            $arr = array(
                "status" => "200",
                "content" => $cont
            );
        }
        echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    }
    //拉取已参与课程信息
    else if( $type === 'getCoursesData'){
        $cidStr = $_GET['courseStr'];
        //拆分字符串
        $cids = explode("&",$cidStr);
        //串接cids
        $sql = "SELECT * FROM course WHERE courseID='".implode("' OR courseID='", $cids)."'";
        $result = mysql_query($sql);
        $cont = array();
        if(!$result){
            $arr = array("status" => "0");
        }else{
            while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
                $cont[] = $row;
            }
            $arr = array(
                "status" => "200",
                "content" => $cont
            );
        }
        echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    }
    //已参加轨迹
    else if( $type === 'getRoutesId'){
        $uid = $_GET['userId'];
        $sql = "SELECT * FROM learningrecord WHERE userID='$uid'";
        $result = mysql_query($sql);
        $cont = array();
        if( !$result ){
            $arr = array( "status" => "0");
        }else{
            while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
                $cont[] = $row;
            }
            $arr = array(
                "status" => "200",
                "content" => $cont
            );
        }
        echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    }
    //拉取已参与估计信息
    else if( $type === 'getRoutesData'){
        $ridStr = $_GET['routeStr'];

        //拆分字符串
        $rids = explode("&",$ridStr);
        //串接cids
        $sql = "SELECT * FROM learningpath WHERE pathID='".implode("' OR pathID='", $rids)."'";
        $result = mysql_query($sql);
        $cont = array();
        if(!$result){
            $arr = array("status" => "0");
        }else{
            while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
                $cont[] = $row;
            }
            $arr = array(
                "status" => "200",
                "content" => $cont
            );
        }
        echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    }
}
mysql_close($con);
?>

