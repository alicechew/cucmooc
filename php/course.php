<?php
require ('init.php');
header("content-Type:text/html;charset=utf-8");
if(isset($_GET['type'])){
    $type = $_GET['type'];
}else if(isset($_POST['type'])){
    $type = $_POST['type'];
}
// $cid = "1";

$con = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
mysql_set_charset("utf8",$con);

if (!$con) {
    die('连接失败 ' . mysql_error());
} else {
    mysql_select_db(DB_NAME, $con);
    //echo("链接数据库成功");

    /**
     * 获取课程信息
     */
    if($type === 'getCourseData'){
        $cid = $_GET['courseId'];

        $sql = "SELECT * FROM course WHERE courseID='$cid'";
        $result = mysql_query($sql);
        // $arr=array();
        while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
            $arr= array(
                "status" => "200",
                "content" => $row
                );
        }
        echo json_encode($arr,JSON_UNESCAPED_UNICODE);
    }

    /**
     * 验证用户是否加入课程
     */
    else if($type === 'verifyEnroll'){
        $cid = $_GET['courseId'];
        $uid = $_GET['userId'];

        $sql = "SELECT * FROM collectcourse WHERE courseID='$cid' AND userID='$uid'";
        $result = mysql_query($sql);
        $rows = mysql_num_rows($result);
        if(!$rows){
            $arr = array(
                "status" => "0",
                "message" => "找不到匹配结果"
                );
        }else{
            while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
                $arr = array(
                    "status" => "200",
                    "message" => "用户已加入该课程",
                    "content" => $row
                    );
            }
        }
        echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    }
    /**
     * 加入课程
     */
    else if($type === 'enrollCourse'){
        $cid = $_POST['courseId'];
        $uid = $_POST['userId'];
        $time = date('y-m-d h:i:s',time());

        $sql = "INSERT INTO collectcourse (userID,courseID,collectTime) VALUES ('{$uid}','{$cid}','{$time}')";
        $res = mysql_query($sql);
        // $row = mysql_fetch_array($res);
        if ($res) {
            $arr = array("status" => "200");
        }else{
            $arr = array("status" => "0");
        }

        echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    }
    /**
     * 获取轨迹信息
     */
    else if( $type === 'getRoute'){
        $cid = $_GET['courseId'];

        $sql = "SELECT * FROM learningpath WHERE courseID='$cid'";
        $res = mysql_query($sql);
        $cont = array();
        if(!$res){
            $arr = array("status" => "0");
        }else{
            while($row = mysql_fetch_array($res, MYSQL_ASSOC)){
                $cont[] = $row;
            }
            $arr = array(
                "status" => "200",
                "content" => $cont
                );
        }

        echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    }
    /**
     * 加入轨迹
     */
    else if($type === 'enrollRoute'){
        $rid = $_POST['routeId'];
        $uid = $_POST['userId'];
        $nodeStr = $_POST['nodeStr'];
        $first = $_POST['first'];
        $have = '';
        $time = date('y-m-d h:i:s',time());

        $sql = "INSERT INTO learningrecord (userID,pathID,haveLearned,havenotLearned,isLearning,recordUpdateTime) VALUES ('{$uid}','{$rid}','{$have}','{$nodeStr}','{$first}','{$time}')";
        $res = mysql_query($sql);
        // $row = mysql_fetch_array($res);
        if (!$res) {
            $arr = array("status" => "0");
        }else{
            $arr = array("status" => "200");
        }
        echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    }
}
mysql_close($con);
?>

