<?php
require ('init.php');
header("content-Type:text/html;charset=utf-8");
session_start();
$type = $_GET['type'];

//$terms= isset($_GET['subject'])? $_GET['subject'] : '';
    $con = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
    mysql_set_charset("utf8", $con);
$terms='计算机';
    if (!$con) {
        die('连接失败 ' . mysql_error());
    } else {
        mysql_select_db(DB_NAME, $con);

if( $type == 'getSubjectInfo'){
    $sid = $_GET['subjectId'];
    $sql = "SELECT * FROM subjects where subjectID='$sid'";
    $result = mysql_query($sql);
    $arr;
    if(!$result){
        $arr = array(
            "status" => "0",
            "message" => "找不到该课程！"
        );
    }else{
        while( $row = mysql_fetch_array($result, MYSQLI_ASSOC)){
            $arr = array(
                "status" => "200",
                "content" => $row
                );
        }
    }
    echo json_encode($arr, JSON_UNESCAPED_UNICODE);
    mysql_close($con);
}
else if( $type == 'search'){
//搜索学科
        $s="select subjectID from subjects where subjectName like '%$terms%'";
        $res=mysql_query($s);
        $r=mysql_fetch_array($res,MYSQLI_ASSOC);
        //echo $r['subjectID'];
        $id=$r['subjectID'];
        $sql = "select courseName,courseDesc from course where course.subjectID='$id' ";
        $result = mysql_query($sql);
        if (!$result) {
            echo "<script>alert('没有此学科！');//</script>";
            mysql_close($con);
        } else {
            $arr = array();
            while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
                $arr[] = $row;
            }
            echo json_encode($arr, JSON_UNESCAPED_UNICODE);
            mysql_close($con);
        }
    }
    }//链接数据库成功

?>