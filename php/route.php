<?php
require ('init.php');
header("content-Type:text/html;charset=utf-8");

if(isset($_GET['type'])){
    $type = $_GET['type'];
}else if(isset($_POST['type'])){
    $type = $_POST['type'];
}

$con = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
mysql_set_charset("utf8",$con);

if (!$con) {
    die('连接失败 ' . mysql_error());
} else {
    mysql_select_db(DB_NAME, $con);
    //echo("链接数据库成功");

    if( $type === 'getRouteData'){
        $rid = $_GET['routeId'];
        $sql = "SELECT * FROM learningpath WHERE pathID='$rid'";
        $result = mysql_query($sql);
        $arr=array();
        while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
            $arr=$row;
        }
        echo json_encode($arr,JSON_UNESCAPED_UNICODE);
    }
     //取消关注轨迹
    else if ($type ==='unenrollRoutes'){
        $uid = $_GET['userId'];

        $ridStr = $_GET['routeStr'];
        $ridArr = explode("&",$ridStr);
        $rids = implode("','", $ridArr);
        $sql = "DELETE FROM learningrecord WHERE userID='$uid' AND pathID IN ('".$rids."')";
        $res = mysql_query($sql);
        if (!$res){
            $arr = array("status" => "0");
        }else {
            $arr = array("status" => "200");
        }

        echo json_encode($arr,JSON_UNESCAPED_UNICODE);

    }

     //完成当前节点，更新数据库信息
    else if ($type ==='updateStatus'){
        $uid = $_POST['userId'];
        $ridStr = $_POST['routeStr'];
        $newHave = $_POST['newHaveLearned'];
        $newHaveNot = $_POST['newHavenotLearned'];
        $newIs = $_POST['newIsLearning'];
        $sql = "UPDATE learningrecord SET haveLearned='$newHave',havenotLearned='$newHaveNot',isLearning='$newIs' WHERE userID='$uid' AND pathID='$ridStr'";
        $res = mysql_query($sql);
        if (!$res){
            $arr = array("status" => "0");
        }else {
            $arr = array("status" => "200");
        }

        echo json_encode($arr,JSON_UNESCAPED_UNICODE);

    }
}

mysql_close($con);
?>

