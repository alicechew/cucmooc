<?php
header("content-Type:text/html;charset=utf-8");
session_start();
//var_dump($_GET);

//echo $_GET['searchText'];
$term= isset($_GET['searchText'])? $_GET['searchText'] : '';
//echo $term;
    $con = mysql_connect("localhost:3306", "root", "");
    mysql_set_charset("utf8", $con);

    if (!$con) {
        die('连接失败 ' . mysql_error());
    } else {
        mysql_select_db("cucmooc", $con);
        //echo("链接数据库成功");

//搜索课程or知识点
        $sql = "select courseName,courseDesc from lesson where courseName like '%$term%'";
        $result = mysql_query($sql);
        if (!$result) {
            echo "<script>alert('没有此课程或知识点！');//</script>";
            mysql_close($con);
        } else {
            $arr = array();
            while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
                $arr[] = $row;
            }
            echo json_encode($arr, JSON_UNESCAPED_UNICODE);
        }

        mysql_close($con);
    }//链接数据库成功

?>