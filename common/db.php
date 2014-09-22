<?php

$con = mysql_connect("localhost","root","root");

if (!$con) {
    die('Could not connect: ' . mysql_error());
}

$dbname = "umsg";
mysql_select_db($dbname, $con);
session_start();


// common functions

date_default_timezone_set("Asia/Shanghai");

function changeTimeZone($timeline) {
    return ($timeline - 8*60*60);
}

function timeFormat($dateline) {
    $date_text = date('Y-m-d', $dateline);

    $now = time();
    $n_y = date('Y', $now);
    $t_y = date('Y', $dateline);
    $gap = $now - $dateline;

    if ($gap < 60) {
        $date_text = '刚刚';
    }
    else if ($gap < 60 * 60) {
        $date_text = floor($gap / 60).'分钟前';
    }
    else if ($gap < 24 * 60 * 60) {
        $date_text = floor($gap / 3600).'小时前';
    }
    else if ($n_y == $t_y) {
        $date_text = date('m-d', $dateline);
    }

    // echo $now;
    return $date_text;
}

function getLatestMsg($userid, $toid, $con) {
    $sql = 'select content from message where authorid='.$userid.' and toid='.$toid.' order by dateline desc limit 1;';
    $res = mysql_query($sql, $con);
    if (!$res) {
        return null;
    }
    return mysql_fetch_array($res)['content'];
}

function getAvator() {
    $user_avator_arr = [
        'temp/user_1.jpg', 
        'temp/user_2.gif', 
        'temp/user_3.gif', 
        'temp/user_4.gif', 
        'temp/user_5.jpg', 
        'temp/user_6.jpg',
        'temp/user_7.jpg',
    ];
    return './static/asset/img/'.$user_avator_arr[mt_rand(0, count($user_avator_arr) - 1)];
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

function url($url) {
    header("Location: ".$url);
    exit;
}


// user set
$username = 'virola';

$userid = 0;
if ($_GET['me']) {
    $userid = $_GET['me'];
}

$usersql = 'select * from user where username="virola";';
if ($userid) {
    $usersql = 'select * from user where userid='.$userid;
}

$res = mysql_query($usersql, $con);
$data = mysql_fetch_array($res);
$user = array(
    'username' => $data['username'], 
    'userid' => $data['userid'],
    'avator' => getAvator(),
);

$common = array('user' => $user);
