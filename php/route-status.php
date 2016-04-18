<?php
require ('init.php');
header("content-Type:text/html;charset=utf-8");
$routeStr = $_GET['routeStr'];
$uid = $_GET['userId'];

$con = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
mysql_set_charset("utf8",$con);

if (!$con) {
    die('连接失败 ' . mysql_error());
} else {
    mysql_select_db(DB_NAME, $con);
    //echo("链接数据库成功");

    $routeArr = explode("&", $routeStr);
    $rids = implode(",", $routeArr);
    $sql = "SELECT * FROM learningrecord WHERE userID='$uid' AND pathID IN (".$rids.")";

    $result = mysql_query($sql);
    $row = mysql_fetch_array($result, MYSQL_ASSOC);
    if(!$row){
        $arr = array(
            "status" => "0"
        );
    }else{
        $cont=array();
        $cont[]=$row;
        while($row = mysql_fetch_array($result, MYSQL_ASSOC)){
            $cont[] = $row;
        }
         $arr = array(
            "status" => "200",
            "content" => $cont
         );

    }

    echo json_encode($arr,JSON_UNESCAPED_UNICODE);

}
mysql_close($con);
?>

