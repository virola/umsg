<?php

date_default_timezone_set("Asia/Shanghai");

function timeFormat($dateline) {
    $now = date();
    echo $now;
}

function getAvator() {
    return $user_avator_arr[mt_rand(0, 3)];
}


function getUserByName($username, $connect) {
    $sql = 'select * from user where username="'.$username.'";';

    $res = mysql_query($sql, $connect);
    if ($res && $row = mysql_fetch_array($res)) {
        $data = array(
            'userid' => $row['userid'],
            'username' => $row['username'],
        );

        return $data;
    }
    return null;
}