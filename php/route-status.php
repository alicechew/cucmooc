<?php
require ('init.php');
header("content-Type:text/html;charset=utf-8");
$rid = $_GET['routeId'];
$uid = $_GET['userId'];

$con = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
mysql_set_charset("utf8",$con);

if (!$con) {
    die('连接失败 ' . mysql_error());
} else {
    mysql_select_db(DB_NAME, $con);
    //echo("链接数据库成功");

    $sql = "SELECT haveLearned,havenotLearned,isLearning FROM learningrecord WHERE pathID='$rid' and userID='$uid'";
    $result = mysql_query($sql);
    $cont=array();

    $rows = mysql_num_rows($result);
    if($rows == 0){
        $arr = array(
            "status" => "0"
        );
    }else if($rows == 1){
        while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
            // array_push($cont,$row);
            $arr = array(
                "status" => "200",
                "content" => $row
            );
        }

    }

    echo json_encode($arr,JSON_UNESCAPED_UNICODE);

}
mysql_close($con);
?>

