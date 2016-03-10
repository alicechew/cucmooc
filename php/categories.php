<?php
require ('init.php');

header("content-Type:text/html;charset=utf-8");
session_start();

$term= isset($_GET['searchText'])? $_GET['searchText'] : '';
$type= isset($_GET['searchType'])? $_GET['searchType'] : '';

    $con = mysql_connect(DB_HOST, DB_USER, DB_PASSWORD);
    mysql_set_charset("utf8", $con);

    if (!$con) {
        die('连接失败 ' . mysql_error());
    } else {
        mysql_select_db(DB_NAME, $con);
        //echo("链接数据库成功");

//搜索课程or知识点
        if (!$type){
            echo 'error';
        }
       else if($type=='course'){
        $sql = "select courseName,courseDesc from course where courseName like '%$term%'";
        $result = mysql_query($sql);
        if (!$result) {
            echo "<script>alert('没有此课程！');//</script>";
            mysql_close($con);
        } else {
            $arr = array();
            while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
                $arr[] = $row;
            }
            echo json_encode($arr, JSON_UNESCAPED_UNICODE);
        }

        mysql_close($con);
        }
       else if($type=='point'){
            $sql = "select pointName,pointDesc from point where pointName like '%$term%'";
            $result = mysql_query($sql);
            if (!$result) {
                echo 'error';
                mysql_close($con);
            } else {
                $arr = array();
                while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
                    $arr[] = $row;
                }
                echo json_encode($arr, JSON_UNESCAPED_UNICODE);
            }

            mysql_close($con);
        }
    }//链接数据库成功

?>